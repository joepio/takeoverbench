# Forecast Bench

**Data Source:**

`https://raw.githubusercontent.com/forecastingresearch/forecastbench-datasets/main/leaderboards/csv/leaderboard_tournament.csv`

**Model meta data:**

`https://raw.githubusercontent.com/forecastingresearch/forecastbench/main/src/leaderboard/model_release_dates.csv`

**Column used as score metric:**

`Overall`

**Implemenation notes:**

- We pick the ony the top 50 most performant models to display. 
- we rename 'freeze values' to 'crowd forcast' in the model release data. This is a discrepancy between how model names are written in the downloaded files. See https://github.com/forecastingresearch/forecastbench/blob/8fc705a685cfda81bf5166206b7163384950d6b5/src/leaderboard/main.py#L1162-L1166 where the original authors do it as well