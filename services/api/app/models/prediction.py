from datetime import date
from typing import Literal
from pydantic import BaseModel, Field, field_validator
from typing import Annotated

CropType = Literal["wheat", "rice", "maize", "cotton", "soybean", "sugarcane"]
SoilType = Literal["alluvial", "black", "red", "laterite", "loamy", "sandy"]
IrrigationType = Literal["rainfed", "drip", "sprinkler", "canal"]


class FarmerInput(BaseModel):
  latitude: float = Field(..., ge=-90.0, le=90.0)
  longitude: float = Field(..., ge=-180.0, le=180.0)
  location_name: str = Field(..., min_length=2, max_length=120)
  crop_type: CropType
  soil_type: SoilType
  irrigation_type: IrrigationType
  acreage: float = Field(..., gt=0)
  rainfall: float = Field(..., ge=0)
  fertilizer_usage: float = Field(..., ge=0)
  sowing_date: date

  @field_validator("location_name")
  @classmethod
  def normalize_location(cls, value: str) -> str:
    return value.strip().title()


class YieldHistoryPoint(BaseModel):
  season: str
  yield_t_per_ha: float = Field(..., ge=0)


class YieldPredictionResponse(BaseModel):
  predicted_yield: float = Field(..., ge=0)
  unit: Literal["tons_per_hectare"] = "tons_per_hectare"
  confidence: float = Field(..., ge=0, le=1)
  baseline_yield: float = Field(..., ge=0)
  historical_yields: Annotated[list[YieldHistoryPoint], Field(min_length=3)]
  risk_alerts: Annotated[set[str], Field(min_length=0)] = set()
  recommended_practices: Annotated[list[str], Field(min_length=1)]
  weather_outlook: dict[str, str]


class AdviceRequest(BaseModel):
  farmer: FarmerInput
  predicted_yield: float


class AdviceCard(BaseModel):
  title: str
  summary: str
  actions: list[str]
  category: Literal["soil", "water", "nutrition", "pest"]


class AdviceResponse(BaseModel):
  knowledge_base: Annotated[list[AdviceCard], Field(min_length=1)]


class ReferenceOptions(BaseModel):
  crops: list[dict[str, str]]
  soils: list[dict[str, str]]
  irrigation: list[dict[str, str]]

