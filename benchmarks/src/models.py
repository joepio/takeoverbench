"""Pydantic models for benchmark data export format."""

from datetime import date
from pathlib import Path
from typing import Optional

import yaml
from pydantic import BaseModel


# Default path to models.yaml relative to this file
DEFAULT_MODELS_YAML = Path(__file__).parent.parent / "models.yaml"


class MetaEntryYaml(BaseModel):
    """Model info as stored in models.yaml."""

    display_name: str
    release_date: date
    organization: str
    parameters: Optional[str] = None
    description: Optional[str] = None
    aliases: list[str] = []


class ModelMetaYaml(BaseModel):
    """Root model for models.yaml file."""

    models: dict[str, MetaEntryYaml]

    @classmethod
    def from_yaml(cls, path: Path = DEFAULT_MODELS_YAML) -> "ModelMetaYaml":
        """Load and validate models.yaml file."""
        with open(path) as f:
            data = yaml.safe_load(f)
        return ModelMetaYaml.model_validate(data)

    def build_alias_map(self) -> dict[str, str]:
        """Build mapping from aliases to canonical model IDs."""
        alias_map = {}
        for model_id, info in self.models.items():
            alias_map[model_id] = model_id
            for alias in info.aliases:
                alias_map[alias] = model_id
        return alias_map


class ModelExport(BaseModel):
    """Model metadata for export."""

    id: str
    name: str
    releaseDate: str
    organization: str


class ModelMetaData:
    def __init__(self) -> None:
        self.models_config = ModelMetaYaml.from_yaml()
        self.alias_map = self.models_config.build_alias_map()
    
    def get(self, model: str) -> ModelExport:
        model = model.split("/")[-1]
        model_canonical = self.alias_map.get(model, model)
        if model_canonical not in self.models_config.models:
            raise KeyError(f"No meta data found for model name: {model}")
        model_config = self.models_config.models[model_canonical]
        return ModelExport(id=model_canonical, name=model_config.display_name, releaseDate=str(model_config.release_date), organization=model_config.organization)

class ModelScore(BaseModel):
    """A single model's score on the benchmark."""

    modelId: str
    score: float
    stdError: Optional[float] = None


class BenchmarkData(BaseModel):
    """Complete benchmark data object for export."""
    id: str
    name: str
    metricName: str # metric, win-rate or hours [h] or so
    scores: list[ModelScore]
    randomBaseline: float | None = None
    humanBaseline: float | None = None
    expertBaseline: float | None = None
    url: str | None = None
