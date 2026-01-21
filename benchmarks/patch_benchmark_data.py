#!/usr/bin/env python3
"""
TEMPORARY SCRIPT: Patch benchmark data with partial updates.

This script updates the main data/benchmarks.json and data/models.json files
with partial benchmark results from individual benchmark directories.

This is a transitional tool.
Once all benchmarks are integrated and we can compile the full dataset from
individual benchmark sources, this script should be removed in favor of a
proper build/compilation step.

Usage:
    python benchmarks/patch_benchmark_data.py <results_dir>

Example:
    python benchmarks/patch_benchmark_data.py benchmarks/SAD_laine_2025/results

The script expects the results directory to contain:
- benchmark.json: Single benchmark data object
- models.json: List of model metadata objects

It will:
1. Load the main data files (data/benchmarks.json, data/models.json)
2. Load partial data from the specified results directory
3. Merge the partial data into the main files (update existing, add new)
4. Write the updated files back
"""

import argparse
import json
from pathlib import Path
from typing import Iterable
from models import ModelExportEntry, ModelsExport, BenchmarkData, BenchmarksExport
from pydantic import BaseModel

# Paths relative to repository root
REPO_ROOT = Path(__file__).parent.parent
DATA_DIR = REPO_ROOT / "data"
MAIN_BENCHMARKS = DATA_DIR / "benchmarks.json"
MAIN_MODELS = DATA_DIR / "models.json"


def load_model_data(path: Path) -> list[ModelExportEntry]:
    """Load model file."""
    with open(path) as f:
        return ModelsExport.validate_json(f.read())


def load_benchmarks_data(path: Path) -> list[BenchmarkData]:
    """Load benchmarks file."""
    with open(path) as f:
        return BenchmarksExport.validate_json(f.read())


def load_benchmark_data(path: Path) -> BenchmarkData:
    """Load benchmark file."""
    with open(path) as f:
        return BenchmarkData.model_validate_json(f.read())


def save_json(path: Path, data: Iterable[BaseModel]) -> None:
    """Save JSON file with consistent formatting."""
    data_list = [data_entry.model_dump() for data_entry in data]
    with open(path, "w") as f:
        json.dump(data_list, f, indent=2)


def merge_benchmarks(main: list[BenchmarkData], patch: BenchmarkData) -> list[BenchmarkData]:
    """
    Merge a single benchmark patch into the main benchmarks list.

    If a benchmark with the same id exists, replace it entirely.
    Otherwise, append the new benchmark.
    """
    patch_id = patch.id

    # Find and replace existing benchmark, or append new one
    found = False
    for i, benchmark in enumerate(main):
        if benchmark.id == patch_id:
            main[i] = patch
            found = True
            print(f"  Updated benchmark: {patch_id}")
            break

    if not found:
        main.append(patch)
        print(f"  Added new benchmark: {patch_id}")

    return main


def merge_models(main: list[ModelExportEntry], patch: list[ModelExportEntry]) -> list[ModelExportEntry]:
    """
    Merge model patches into the main models list.

    Models are matched by id. New models are added, existing ones are updated.
    The result is sorted by id for consistency.
    """
    # Build a dict for efficient lookup
    models_by_id = {m.id: m for m in main}

    added = 0
    updated = 0
    for model in patch:
        model_id = model.id
        if model_id in models_by_id:
            models_by_id[model_id] = model
            updated += 1
        else:
            models_by_id[model_id] = model
            added += 1

    print(f"  Models: {added} added, {updated} updated")

    # Return sorted list
    return sorted(models_by_id.values(), key=lambda m: m.id)


def main():
    parser = argparse.ArgumentParser(
        description="Patch main benchmark data with results from a benchmark directory.",
        epilog="Example: python benchmarks/patch_benchmark_data.py benchmarks/SAD_laine_2025/results",
    )
    parser.add_argument(
        "results_dir",
        type=Path,
        help="Path to results directory containing benchmark.json and models.json",
    )
    args = parser.parse_args()

    source_dir = args.results_dir.resolve()
    if not source_dir.is_dir():
        parser.error(f"Results directory does not exist: {source_dir}")

    benchmark_file = source_dir / "benchmark.json"
    models_file = source_dir / "models.json"

    if not benchmark_file.exists() and not models_file.exists():
        parser.error(f"No benchmark.json or models.json found in {source_dir}")

    print("Loading main data files...")
    benchmarks = load_benchmarks_data(MAIN_BENCHMARKS)
    models = load_model_data(MAIN_MODELS)

    print(f"Processing patches from: {source_dir}")

    if benchmark_file.exists():
        patch_benchmark = load_benchmark_data(benchmark_file)
        benchmarks = merge_benchmarks(benchmarks, patch_benchmark)
    else:
        print(f"  Warning: {benchmark_file.name} not found, skipping")

    if models_file.exists():
        patch_models = load_model_data(models_file)
        models = merge_models(models, patch_models)
    else:
        print(f"  Warning: {models_file.name} not found, skipping")

    print("\nSaving updated data files...")
    save_json(MAIN_BENCHMARKS, benchmarks)
    save_json(MAIN_MODELS, models)
    print("Done!")


if __name__ == "__main__":
    main()