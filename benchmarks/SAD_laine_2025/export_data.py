#!/usr/bin/env python3
"""Export SAD benchmark data to standardized format."""

import csv
import json
from pathlib import Path

from models import BenchmarkData, ModelMetaData, ModelScore


def main():
    script_dir = Path(__file__).parent
    output_dir = script_dir / "results"
    output_dir.mkdir(exist_ok=True)

    # Load model metadata
    meta_data = ModelMetaData()

    # Load and combine scores from both CSVs
    scores_by_model = {}
    random_baseline = None

    # Load original SAD data (filter for SAD type, Plain Prompt variant)
    with open(script_dir / "data" / "sad.csv") as f:
        for row in csv.DictReader(f):
            if row["type"] == "SAD-mini" and row["variant"] == "Plain Prompt":
                try:
                    model_id = meta_data.get(row["model"]).id
                except KeyError:
                    print(f"Warning: No meta data was found for model '{row["model"]}'")
                    continue
                scores_by_model[model_id] = {
                    "score": float(row["score"]),
                    "std": float(row["std"]) if row["std"] else None,
                }
                if random_baseline is None:
                    random_baseline = float(row["random_chance"])

    # Load inspect results (overrides existing scores)
    inspect_path = script_dir / "data" / "inspect_sad_mini.csv"
    if inspect_path.exists():
        with open(inspect_path) as f:
            for row in csv.DictReader(f):
                model_id = meta_data.get(row["model"]).id
                scores_by_model[model_id] = {
                    "score": float(row["score"]),
                    "std": None,
                }

    # Build output structures
    scores = [
        ModelScore(modelId=mid, score=data["score"], stdError=data["std"])
        for mid, data in scores_by_model.items()
    ]
    scores.sort(key=lambda x: x.score, reverse=True)

    model_metadata = [meta_data.get(mid) for mid in scores_by_model]
    model_metadata.sort(key=lambda x: x.releaseDate)

    benchmark = BenchmarkData(
        id="sad",
        name="SAD",
        metricName="score",
        scores=scores,
        randomBaseline=random_baseline,
        url="https://situational-awareness-dataset.org/#results",
    )

    # Write outputs
    with open(output_dir / "benchmark.json", "w") as f:
        json.dump(benchmark.model_dump(), f, indent=2)

    with open(output_dir / "models.json", "w") as f:
        json.dump([m.model_dump() for m in model_metadata], f, indent=2)

    print(f"Exported {len(scores)} scores and {len(model_metadata)} models to {output_dir}")


if __name__ == "__main__":
    main()