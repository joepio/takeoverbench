import argparse
from datetime import datetime
from pathlib import Path

import yaml
from inspect_ai import eval_set
from inspect_evals.sad import (
    sad_facts_human_defaults,
    sad_facts_llms,
    sad_influence,
    sad_stages_full,
    sad_stages_oversight,
)

LOGS_BASE_DIR = Path(__file__).parent / "inspect_logs"
CONFIG_PATH = Path(__file__).parent / "run_config.yaml"

TASKS = [
    sad_facts_human_defaults,
    sad_facts_llms,
    sad_influence,
    sad_stages_full,
    sad_stages_oversight,
]


def load_config() -> dict:
    if CONFIG_PATH.exists():
        return yaml.safe_load(CONFIG_PATH.read_text())
    return {"models": [], "completed": []}


def save_config(config: dict) -> None:
    CONFIG_PATH.write_text(yaml.dump(config, default_flow_style=False, sort_keys=False))


def main():
    parser = argparse.ArgumentParser(description="Run SAD benchmark evaluations")
    parser.add_argument(
        "--models", "-m", nargs="+", help="Override config models (space-separated)"
    )
    parser.add_argument(
        "--include-completed",
        action="store_true",
        help="Include models already in the completed list (default: skip them)",
    )
    args = parser.parse_args()

    config = load_config()

    models = args.models or config.get("models", [])
    completed = set(config.get("completed", []))

    if not args.include_completed:
        models = [m for m in models if m not in completed]

    if not models:
        print("No models to run. Add models to run_config.yaml or use --models")
        return

    print(f"Running {len(TASKS)} tasks on {len(models)} model(s):")
    for m in models:
        print(f"  - {m}")

    settings = config.get("settings", {})
    run_dir = LOGS_BASE_DIR / datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    run_dir.mkdir(parents=True, exist_ok=True)

    eval_set(
        TASKS,
        str(run_dir),
        model=models,
        limit=None,
        max_tasks=5,
        epochs=1,
        max_connections=settings.get("max_connections"),
    )

    # Mark all as completed
    completed.update(models)
    config["completed"] = list(completed)
    save_config(config)
    print(f"Marked {len(models)} model(s) as completed")


if __name__ == "__main__":
    main()

