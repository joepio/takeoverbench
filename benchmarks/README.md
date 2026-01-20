# Benchmark data

## IN PROGRESS

Currently most of the raw data is available but this repository does not contain code yet to convert these to a common format that can be used for the website. 
TODO:

- [ ] Decide on a common data format that all the benchmarks can be converted to
- [ ] Write `process_data.py` scripts for each benchmark. Use the model meta data from `models.yaml` to get the release date and organization of a model. Or for some benchmarks, use the specific downloaded meta data (such as for Forecast Bench) or maybe a combination. Should include renaming models to the same standard as used in `models.yaml`.
- [ ] Add possibility to create or extend data if the benchmark is available on [Inspect Evals](https://github.com/UKGovernmentBEIS/inspect_evals). For example this has to be done for Make Me Say to get any data at all, and it could be used for SAD (at least getting SAD-mini data) to complement existing leaderboard data
- [ ] Have export code that merges this data and feeds into the web application. Potentially `evaluations.yaml` can be used to provide paths for this.

## Running scripts

**With `uv` package manager:**

1. change into the `benchmarks` directory
2. run scripts with `uv run {benchmark}/{script}.py`, e.g.:

```bash
uv run CyBench_zhang_2024/download_data.py
```
