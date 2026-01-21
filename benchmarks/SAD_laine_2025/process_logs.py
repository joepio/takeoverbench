"""Extract scores from InspectAI logs and create a summary CSV."""

from pathlib import Path

from inspect_ai.log import list_eval_logs
from inspect_ai.analysis import evals_df

LOGS_DIR = Path(__file__).parent / "inspect_logs"
OUTPUT_CSV = Path(__file__).parent / "data" / "inspect_sad_mini.csv"


def main():
    logs = list_eval_logs(str(LOGS_DIR), filter=lambda log: log.status == "success")

    if not logs:
        print("No successful evaluation logs found")
        return

    df = evals_df(logs)

    # Average headline score by model (across tasks)
    summary = df.groupby("model").agg(
        score=("score_headline_value", "mean"),
        n_tasks=("score_headline_value", "count"),
    ).reset_index()

    summary = summary.sort_values("score", ascending=False)

    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    summary.to_csv(OUTPUT_CSV, index=False)
    print(summary.to_string(index=False))


if __name__ == "__main__":
    main()
