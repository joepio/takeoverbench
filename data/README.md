# TakeOverBench Data Files

This directory contains the data files used by TakeOverBench to display AI capability benchmarks, models, and threat models.

## File Structure

### `benchmarks.json`
Contains the raw benchmark score data. This file is **automatically generated/overwritten** by data processing scripts.

**Structure:**
```json
[
  {
    "id": "benchmark_id",
    "name": "Benchmark Name (fallback)",
    "description": "Description (fallback)",
    "metricName": "metric_name",
    "scores": [
      {
        "modelId": "model_id",
        "score": 0.85,
        "stdError": 0.02
      }
    ],
    "randomBaseline": null,
    "humanBaseline": null,
    "expertBaseline": null,
    "url": null
  }
]
```

**⚠️ Warning:** This file should be regenerated from raw data sources. Do not manually edit metadata fields here as they will be overwritten.

### `benchmarks_meta.json`
Contains the **human-maintained metadata** for benchmarks. This file takes precedence over `benchmarks.json` for display metadata.

**Structure:**
```json
[
  {
    "id": "benchmark_id",
    "name": "Human-Readable Benchmark Name",
    "description": "Detailed description of what this benchmark measures",
    "url": "https://link-to-benchmark-paper-or-repo.com",
    "color": "#2563eb",
    "category": "reasoning",
    "projectionType": "s-curve",
    "humanBaseline": 0.75,
    "expertBaseline": 0.92,
    "randomBaseline": 0.25
  }
]
```

**Fields:**
- `id`: Unique identifier (must match the id in `benchmarks.json`)
- `name`: Display name for the UI
- `capabilityName`: Human-readable capability name (e.g., "cybersecurity" for "CyBench")
- `description`: Human-readable description of the benchmark
- `url`: Link to the benchmark's homepage, paper, or repository
- `color`: Hex color code for chart visualization (auto-generated if not provided)
- `category`: One of: `reasoning`, `coding`, `mathematics`, `science`, `multimodal`, `agentic`
- `projectionType`: How to project future trends: `s-curve` (for saturation), `exponential` (for unbounded growth), or `none`
- `humanBaseline`: Average human performance (0-1 scale)
- `expertBaseline`: Expert human performance (0-1 scale)
- `randomBaseline`: Random/chance performance (0-1 scale)

### `models.json`
Contains information about AI models that have been evaluated on benchmarks.

**Structure:**
```json
[
  {
    "id": "model_id",
    "name": "Model Display Name",
    "releaseDate": "2024-01-15",
    "organization": "Organization Name",
    "description": "Optional description"
  }
]
```

### `threat_models.json`
Contains threat scenarios and their associated benchmarks.

**Structure:**
```json
[
  {
    "id": "threat_id",
    "name": "Threat Name",
    "shortDescription": "Brief description",
    "longDescription": "Detailed description",
    "benchmarks": ["benchmark_id_1", "benchmark_id_2"]
  }
]
```

## Data Merging Logic

The application merges `benchmarks_meta.json` with `benchmarks.json` at runtime:

1. Scores and raw data come from `benchmarks.json`
2. Display metadata (name, description, color, etc.) comes from `benchmarks_meta.json` **if present**
3. Falls back to `benchmarks.json` values if metadata is not defined
4. Color is auto-generated if not provided in either file

This allows you to:
- Regenerate `benchmarks.json` from raw data sources without losing human-curated metadata
- Maintain clean, readable descriptions and categories separately from score data
- Version control metadata changes independently from data updates

## Updating Benchmarks

### To update benchmark scores:
1. Regenerate `benchmarks.json` from your data source
2. The UI will automatically use the new scores with existing metadata

### To update benchmark metadata:
1. Edit `benchmarks_meta.json`
2. Add or modify the metadata for the benchmark ID
3. Changes will take effect immediately

### To add a new benchmark:
1. Add the benchmark data (with scores) to `benchmarks.json`
2. Add metadata entry to `benchmarks_meta.json` with the same `id`
3. Update `src/lib/data.ts` if the benchmark requires a custom score transformer

## Score Transformations

Some benchmarks use non-standard scoring scales. Custom transformers are defined in `src/lib/data.ts`:

- **frontiermatch**: Converts permille (0-1000) to fraction (0-1)
- **forecast_bench**: Inverse min-max normalization (lower is better)
- **long_tasks**: Normalizes minutes against a 1-day (1440 minutes) cap

Add new transformers in the `transformers` object if you add benchmarks with unique scoring systems.