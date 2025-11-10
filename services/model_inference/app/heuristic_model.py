from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from math import cos, sin
from typing import Iterable

import numpy as np


@dataclass
class FarmerContext:
  latitude: float
  longitude: float
  location_name: str
  crop_type: str
  soil_type: str
  irrigation_type: str
  acreage: float
  rainfall: float
  fertilizer_usage: float
  sowing_date: date


@dataclass
class YieldEstimate:
  value: float
  unit: str
  confidence: float
  baseline: float
  history: list[tuple[str, float]]
  risks: list[str]
  practices: list[str]
  weather: dict[str, str]


class HeuristicYieldModel:
  """Reusable agronomic heuristic shared between API and offline tasks."""

  crop_base = {
      "wheat": 3.2,
      "rice": 3.6,
      "maize": 4.1,
      "cotton": 2.4,
      "soybean": 2.8,
      "sugarcane": 80.0
  }
  soil_multiplier = {
      "alluvial": 1.1,
      "black": 1.05,
      "red": 0.95,
      "laterite": 0.9,
      "loamy": 1.0,
      "sandy": 0.8
  }
  irrigation_multiplier = {
      "rainfed": 0.92,
      "drip": 1.12,
      "sprinkler": 1.05,
      "canal": 1.0
  }
  rainfall_optimum = {
      "wheat": (40, 120),
      "rice": (120, 220),
      "maize": (80, 160),
      "cotton": (60, 130),
      "soybean": (70, 150),
      "sugarcane": (180, 280)
  }
  fertilizer_optimum = {
      "wheat": (80, 140),
      "rice": (100, 160),
      "maize": (90, 150),
      "cotton": (70, 130),
      "soybean": (60, 110),
      "sugarcane": (220, 320)
  }

  def predict(self, farmer: FarmerContext) -> YieldEstimate:
    crop_base = self.crop_base[farmer.crop_type]
    soil_factor = self.soil_multiplier[farmer.soil_type]
    irrigation_factor = self.irrigation_multiplier[farmer.irrigation_type]
    rainfall_factor = self._range_factor(
        farmer.rainfall, self.rainfall_optimum[farmer.crop_type]
    )
    fertilizer_factor = self._range_factor(
        farmer.fertilizer_usage, self.fertilizer_optimum[farmer.crop_type]
    )
    phenology_factor = self._phenology_factor(farmer.sowing_date)
    microclimate_factor = self._microclimate_factor(
        farmer.latitude, farmer.longitude
    )

    predicted = (
        crop_base
        * soil_factor
        * irrigation_factor
        * rainfall_factor
        * fertilizer_factor
        * phenology_factor
        * microclimate_factor
    )
    if farmer.crop_type == "sugarcane":
      predicted = predicted / 10

    baseline = crop_base * soil_factor * 0.95
    history = self._history(baseline, predicted)
    risks = self._risks(farmer, rainfall_factor, fertilizer_factor)
    practices = self._practices(farmer, risks)
    weather = self._weather(farmer)
    confidence = self._confidence(risks)

    return YieldEstimate(
        value=round(predicted, 2),
        unit="tons_per_hectare",
        confidence=confidence,
        baseline=round(baseline, 2),
        history=history,
        risks=risks,
        practices=practices,
        weather=weather
    )

  @staticmethod
  def _range_factor(value: float, optimum: tuple[float, float]) -> float:
    lower, upper = optimum
    if lower <= value <= upper:
      return 1.05
    distance = min(abs(value - lower), abs(value - upper))
    decay = max(0.6, 1 - (distance / (upper - lower + 1)) * 0.5)
    return decay

  @staticmethod
  def _phenology_factor(sowing_date: date) -> float:
    today = date.today()
    delta = (today - sowing_date).days
    if delta < 0:
      return 0.8
    growth_stage = min(delta / 120, 1)
    return 0.85 + growth_stage * 0.2

  @staticmethod
  def _microclimate_factor(latitude: float, longitude: float) -> float:
    lat_rad = np.deg2rad(latitude)
    lon_rad = np.deg2rad(longitude)
    seasonal_wave = 0.05 * sin(lat_rad * 2) + 0.03 * cos(lon_rad)
    return 1 + seasonal_wave

  @staticmethod
  def _history(baseline: float, predicted: float) -> list[tuple[str, float]]:
    seasons = ["Kharif 22", "Rabi 22", "Kharif 23", "Rabi 23", "Current"]
    progression = np.linspace(baseline * 0.95, predicted, num=len(seasons))
    return [(season, round(value, 2)) for season, value in zip(seasons, progression)]

  @staticmethod
  def _risks(
      farmer: FarmerContext, rainfall_factor: float, fertilizer_factor: float
  ) -> list[str]:
    risks: list[str] = []
    if farmer.rainfall < 50:
      risks.append("Low rainfall detected; plan supplemental irrigation.")
    if rainfall_factor < 0.75:
      risks.append("Rainfall outside optimal window; monitor moisture levels.")
    if fertilizer_factor < 0.75:
      risks.append("Nutrient application below target; review fertiliser plan.")
    if farmer.irrigation_type == "rainfed" and farmer.soil_type == "sandy":
      risks.append("Sandy soil under rainfed conditions increases drought risk.")
    return risks

  @staticmethod
  def _practices(
      farmer: FarmerContext, risks: Iterable[str]
  ) -> list[str]:
    practices = [
        "Incorporate organic matter to improve soil structure.",
        "Schedule field scouting twice a week during vegetative growth."
    ]
    if any("rainfall" in risk.lower() for risk in risks):
      practices.append("Adopt mulching to conserve soil moisture.")
    if farmer.irrigation_type in {"drip", "sprinkler"}:
      practices.append("Calibrate irrigation equipment for uniform coverage.")
    else:
      practices.append("Explore micro-irrigation subsidy programmes in your area.")
    if farmer.soil_type in {"red", "laterite"}:
      practices.append("Plan lime application to balance soil pH.")
    return practices[:4]

  @staticmethod
  def _weather(farmer: FarmerContext) -> dict[str, str]:
    seed = int((farmer.latitude + 90) * 1000 + (farmer.longitude + 180) * 1000)
    rng = np.random.default_rng(seed)
    rainfall_delta = rng.uniform(-20, 30)
    temp_trend = rng.uniform(-1.5, 2.5)
    conditions = ["stable", "favourable", "cautious"]
    summary = conditions[int(rng.choice(len(conditions)))]

    return {
        "summary": summary.capitalize(),
        "rainfallOutlook": f"{'+' if rainfall_delta >= 0 else ''}{rainfall_delta:.0f}% vs normal",
        "temperatureTrend": f"{temp_trend:+.1f}°C anomaly"
    }

  @staticmethod
  def _confidence(risks: Iterable[str]) -> float:
    risk_count = len(list(risks))
    return max(0.55, 0.85 - risk_count * 0.08)

