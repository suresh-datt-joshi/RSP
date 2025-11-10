from datetime import date, datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel, Field

from .prediction import CropType


class CropLifecycleRequest(BaseModel):
    crop_type: CropType
    planting_date: date
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    location_name: str = Field(..., min_length=2, max_length=120)
    acreage: float = Field(..., gt=0)


class CropStage(BaseModel):
    stage_name: str
    start_date: date
    end_date: date
    duration_days: int
    description: str
    care_activities: List[str]
    irrigation_frequency: str
    fertilizer_recommendations: List[str]
    weather_considerations: str
    risk_factors: List[str]


class WeatherAlert(BaseModel):
    date: date
    alert_type: str
    severity: str
    description: str
    recommendations: List[str]


class CropLifecycleResponse(BaseModel):
    crop_type: str
    crop_name: str
    planting_date: date
    harvest_date: date
    total_duration_days: int
    current_stage: str
    current_day: int
    location: str
    stages: List[CropStage]
    weather_alerts: List[WeatherAlert]
    irrigation_schedule: List[dict]
    fertilizer_schedule: List[dict]
    general_care_tips: List[str]
    harvest_readiness_indicators: List[str]
