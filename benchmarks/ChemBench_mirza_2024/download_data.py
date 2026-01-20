from pathlib import Path
import requests

LEADERBOARD_URL = "https://chembench.lamalab.org/static/data/chembench_leaderboard.json"
LEADERBOARD_FILE = Path(__file__).parent / "data/chembench_leaderboard.json"
LEADERBOARD_FILE .parent.mkdir(exist_ok=True)
if __name__ == "__main__":
    # Fetch the leaderboard data
    print(f"Fetching leaderboard from {LEADERBOARD_URL}")
    response = requests.get(LEADERBOARD_URL)
    response.raise_for_status()
    print(f"Saving leaderboard to {LEADERBOARD_FILE}")
    with open(LEADERBOARD_FILE, "w") as f:
        f.write(response.text)



