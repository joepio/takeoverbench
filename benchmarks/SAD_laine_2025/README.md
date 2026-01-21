# SAD

## Scripts

Run all of the below from `benchmarks` as working directory.

### Downloading Data

```bash
uv run SAD_laine_2025/download_data.py
```

### Creating our own data

`run_config.yaml` contains config parameters and model choice.

Running

```bash
uv run SAD_laine_2025/run_sad_experiments.py
```

creates Inspect AI logs in the `inspect_logs` directory.

Once you have completed runs, you can run
```bash
uv run SAD_laine_2025/process_logs.py
```

to convert the log files into csv.

### Export Script

The `export_data.py` script processes SAD benchmark data and exports it to the standardized format.

#### Input Files

- `data/sad.csv` - Original SAD benchmark results
- `data/inspect_sad_mini.csv` - Custom inspect evaluation results
- `../models.yaml` - Model metadata

#### Output Files

Outputs are written to the `results/` directory:

- `benchmark.json` - Benchmark data
- `models.json` - Model metadata for all models with scores

#### Usage

```bash
uv run SAD-laine_2025/export_data.py
```

## Data information

**Data Source:**

`https://situational-awareness-dataset.org/#results `

**Model meta data:**

Local meta data file

**Column used as score metric:**

`score`

**Implementation details:**

- Using the 'plain prompt' variation. (This is what is reported in the data source but in the paper multiple variants exist)
