from __future__ import annotations

from services.model_inference.app.heuristic_model import (
    FarmerContext,
    HeuristicYieldModel,
)

from ..models import FarmerInput, YieldHistoryPoint, YieldPredictionResponse


class YieldEngine:
  """Yield estimator that wraps the shared heuristic model."""

  def __init__(self, model: HeuristicYieldModel | None = None):
    self.model = model or HeuristicYieldModel()

  def predict(self, farmer: FarmerInput) -> YieldPredictionResponse:
    context = FarmerContext(
        latitude=farmer.latitude,
        longitude=farmer.longitude,
        location_name=farmer.location_name,
        crop_type=farmer.crop_type,
        soil_type=farmer.soil_type,
        irrigation_type=farmer.irrigation_type,
        acreage=farmer.acreage,
        rainfall=farmer.rainfall,
        fertilizer_usage=farmer.fertilizer_usage,
        sowing_date=farmer.sowing_date
    )

    estimate = self.model.predict(context)

    history = [
        YieldHistoryPoint(season=season, yield_t_per_ha=value)
        for season, value in estimate.history
    ]

    return YieldPredictionResponse(
        predicted_yield=estimate.value,
        confidence=estimate.confidence,
        baseline_yield=estimate.baseline,
        historical_yields=history,
        risk_alerts=set(estimate.risks),
        recommended_practices=estimate.practices,
        weather_outlook=estimate.weather
    )

