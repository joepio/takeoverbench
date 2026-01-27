#!/usr/bin/env python3
"""
Fit projection curves to benchmark data and export parameters for TypeScript.

Reads:
  - data/benchmarks.json (scores)
  - data/models.json (release dates)
  - data/benchmarks_meta.json (projection type per benchmark)

Writes:
  - data/fitted_projections.json

Usage:
  python fit_benchmarks.py          # Fit and write output
  python fit_benchmarks.py --verify # Check if output is up-to-date (for CI/build)
"""

import argparse
import json
import sys
from collections.abc import Callable
from pathlib import Path

import numpy as np
import pandas as pd
from scipy.optimize import curve_fit

# Paths relative to this script (benchmarks/ -> parent is project root)
PROJECT_ROOT = Path(__file__).parent.parent
DATA_DIR = PROJECT_ROOT / "data"


# =============================================================================
# Score transformations per benchmark
# TODO: Move these transformations earlier in the pipeline (into benchmarks.json
# preprocessing) so that raw scores are already normalized before reaching here
# and the frontend.
# =============================================================================

def transform_forecast_bench(scores: np.ndarray) -> np.ndarray:
    """Inverse min-max normalization (lower Brier score is better)."""
    if len(scores) == 0:
        return scores
    min_val = 0
    max_val = max(scores.max(), 1e-9)  # avoid division by zero
    normalized = 1 - (scores - min_val) / (max_val - min_val)
    return np.clip(normalized, 0, 1)


def transform_long_tasks(scores: np.ndarray) -> np.ndarray:
    """Normalize against 40-hour workday (2400 minutes)."""
    nr_hours = 40
    top_minutes = nr_hours * 60 
    return scores / top_minutes


# Map benchmark_id -> transformation function
SCORE_TRANSFORMS: dict[str, Callable] = {
    "forecast_bench": transform_forecast_bench,
    "long_tasks": transform_long_tasks,
}


def load_data() -> tuple[pd.DataFrame, dict[str, dict]]:
    """Load and merge benchmark scores with model release dates."""
    with open(DATA_DIR / "benchmarks.json") as f:
        benchmarks = json.load(f)

    with open(DATA_DIR / "models.json") as f:
        models = json.load(f)

    with open(DATA_DIR / "benchmarks_meta.json") as f:
        meta = json.load(f)

    model_info = {m["id"]: m for m in models}
    meta_by_id = {m["id"]: m for m in meta}

    rows = []
    for bench in benchmarks:
        for score_entry in bench["scores"]:
            model_id = score_entry["modelId"]
            model = model_info.get(model_id, {})
            rows.append({
                "model_id": model_id,
                "release_date": model.get("releaseDate"),
                "benchmark_id": bench["id"],
                "score": score_entry["score"],
            })

    df = pd.DataFrame(rows)
    df["release_date"] = pd.to_datetime(df["release_date"], errors="coerce")
    df = df.dropna(subset=["release_date"])
    df = df.sort_values(["benchmark_id", "release_date"])

    return df, meta_by_id


def filter_sota(df: pd.DataFrame) -> pd.DataFrame:
    """Keep only SOTA points (each point improves on previous best)."""
    df = df.sort_values(["benchmark_id", "release_date"]).copy()
    df["running_max"] = df.groupby("benchmark_id")["score"].transform(
        lambda x: x.expanding().max().shift(1, fill_value=-float("inf"))
    )
    df_sota = df[df["score"] > df["running_max"]].drop(columns=["running_max"])
    return df_sota.reset_index(drop=True)


def fit_logistic(
    dates: pd.Series,
    scores: np.ndarray,
    L_0: float = 0.0,
    L_1: float = 1.0,
) -> dict | None:
    """
    Fit a logistic curve anchored at the last data point.

    Model: y = L_0 + (L_1 - L_0) / (1 + exp(-k * (t - t_mid)))

    We reparameterize to anchor at the last point (t_a, y_a).
    """
    if len(dates) < 2:
        return None

    date_origin = dates.min()
    t = (dates - date_origin).dt.days.astype(float).values
    y = scores.astype(float)

    t_a = t[-1]
    y_a = y[-1]

    # Clamp anchor away from bounds
    y_a_safe = np.clip(y_a, L_0 + 1e-6, L_1 - 1e-6)

    def logistic_anchored(t_vals, k):
        """Logistic passing through (t_a, y_a_safe)."""
        numerator = y_a_safe - L_0
        denominator = (y_a_safe - L_0) + (L_1 - y_a_safe) * np.exp(-k * (t_vals - t_a))
        return L_0 + (L_1 - L_0) * numerator / denominator

    try:
        popt, pcov = curve_fit(
            logistic_anchored,
            t,
            y,
            p0=[0.001],
            bounds=([1e-9], [1.0]),
            maxfev=10000,
        )
        k_fit = float(popt[0])
        k_std = float(np.sqrt(pcov[0, 0])) if pcov[0, 0] > 0 else None
    except (RuntimeError, ValueError) as e:
        print(f"  Warning: curve_fit failed: {e}")
        return None

    return {
        "type": "logistic",
        "k": k_fit,
        "k_std": k_std,
        "L_0": L_0,
        "L_1": L_1,
        "anchor_date": dates.iloc[-1].isoformat(),
        "anchor_y": float(y_a),
        "date_origin": date_origin.isoformat(),
    }


def fit_exponential(
    dates: pd.Series,
    scores: np.ndarray,
) -> dict | None:
    """
    Fit an exponential curve anchored at the last data point.

    Model: y = y_a * exp(b * (t - t_a))

    This ensures the curve passes through (t_a, y_a) and only fits
    the growth rate parameter b.
    """
    if len(dates) < 2:
        return None

    date_origin = dates.min()
    t = (dates - date_origin).dt.days.astype(float).values
    y = scores.astype(float)

    t_a = t[-1]
    y_a = y[-1]

    if y_a <= 0:
        print("  Warning: anchor y must be positive for exponential fit")
        return None

    def exponential_anchored(t_vals, b):
        """Exponential passing through (t_a, y_a)."""
        return y_a * np.exp(b * (t_vals - t_a))

    try:
        popt, pcov = curve_fit(
            exponential_anchored,
            t,
            y,
            p0=[0.001],
            bounds=([-1.0], [1.0]),
            maxfev=10000,
        )
        b_fit = float(popt[0])
        b_std = float(np.sqrt(pcov[0, 0])) if pcov[0, 0] > 0 else None
    except (RuntimeError, ValueError) as e:
        print(f"  Warning: curve_fit failed: {e}")
        return None

    return {
        "type": "exponential",
        "b": b_fit,
        "b_std": b_std,
        "date_origin": date_origin.isoformat(),
        "anchor_date": dates.iloc[-1].isoformat(),
        "anchor_y": float(y_a),
    }


def apply_transforms(df: pd.DataFrame) -> pd.DataFrame:
    """Apply score transformations per benchmark BEFORE SOTA filtering."""
    df = df.copy()
    for bench_id, transform_fn in SCORE_TRANSFORMS.items():
        mask = df["benchmark_id"] == bench_id
        if mask.any():
            df.loc[mask, "score"] = transform_fn(df.loc[mask, "score"].values)
            print(f"  Transformed {bench_id} ({mask.sum()} rows)")
    return df


def compute_fits() -> dict:
    """Compute all fitted projections and return as dict."""
    print("Loading data...")
    df, meta_by_id = load_data()

    print("Applying score transformations...")
    df = apply_transforms(df)

    print("Filtering to SOTA...")
    df_sota = filter_sota(df)

    results = {}
    benchmark_ids = df_sota["benchmark_id"].unique()

    for bench_id in benchmark_ids:
        bench_df = df_sota[df_sota["benchmark_id"] == bench_id].copy()
        meta = meta_by_id.get(bench_id, {})
        projection_type = meta.get("projectionType", "s-curve")

        print(f"Fitting {bench_id} ({projection_type}, {len(bench_df)} SOTA points)...")

        if len(bench_df) < 2:
            print("  Skipping: not enough data points")
            continue

        dates = bench_df["release_date"]
        scores = bench_df["score"].values

        # Get baseline from meta if available
        random_baseline = meta.get("randomBaseline")
        L_0 = random_baseline if random_baseline is not None else 0.0

        if projection_type == "s-curve":
            fit_result = fit_logistic(dates, scores, L_0=L_0, L_1=1.0)
        elif projection_type == "exponential":
            fit_result = fit_exponential(dates, scores)
        else:
            print(f"  Unknown projection type: {projection_type}")
            continue

        if fit_result:
            fit_result["n_points"] = len(bench_df)
            results[bench_id] = fit_result
            print(f"  Success: {fit_result}")
        else:
            print("  Failed to fit")

    return results


def main():
    parser = argparse.ArgumentParser(description="Fit projection curves to benchmark data")
    parser.add_argument(
        "--verify",
        action="store_true",
        help="Verify that fitted_projections.json is up-to-date (exits with error if not)",
    )
    args = parser.parse_args()

    results = compute_fits()
    output_path = DATA_DIR / "fitted_projections.json"

    if args.verify:
        # Compare computed results with existing file
        if not output_path.exists():
            print(f"\nERROR: {output_path} does not exist")
            sys.exit(1)

        with open(output_path) as f:
            existing = json.load(f)

        computed_json = json.dumps(results, indent=2, sort_keys=True)
        existing_json = json.dumps(existing, indent=2, sort_keys=True)

        if computed_json != existing_json:
            print(f"\nERROR: {output_path} is out of sync with source data!")
            print("Run 'pnpm run fit' to update it.")
            sys.exit(1)
        else:
            print(f"\nOK: {output_path} is up-to-date")
            sys.exit(0)
    else:
        # Write output
        with open(output_path, "w") as f:
            json.dump(results, f, indent=2)
        print(f"\nWrote {len(results)} fitted projections to {output_path}")


if __name__ == "__main__":
    main()
