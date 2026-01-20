import requests
from pathlib import Path

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)

files_to_download = [
    {
        "url": "https://raw.githubusercontent.com/forecastingresearch/forecastbench-datasets/main/leaderboards/csv/leaderboard_tournament.csv",
        "filename": "leaderboard_tournament.csv"
    },
    {
        "url": "https://raw.githubusercontent.com/forecastingresearch/forecastbench/main/src/leaderboard/model_release_dates.csv",
        "filename": "model_release_dates.csv"
    }
]

for file_info in files_to_download:
    response = requests.get(file_info["url"])
    response.raise_for_status()

    output_file = DATA_DIR / file_info["filename"]
    output_file.write_text(response.text)
    print(f"Downloaded {file_info['filename']} to {output_file}")
