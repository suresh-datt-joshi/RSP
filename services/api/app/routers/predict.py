from fastapi import APIRouter, Depends

from ..models import FarmerInput, YieldPredictionResponse
from ..services import YieldEngine

router = APIRouter()


def get_engine() -> YieldEngine:
  return YieldEngine()


@router.post(
    "/predict", response_model=YieldPredictionResponse, summary="Predict crop yield"
)
async def predict_yield(
    payload: FarmerInput, engine: YieldEngine = Depends(get_engine)
) -> YieldPredictionResponse:
  """
  Estimate crop yield for the supplied field parameters.

  The heuristic engine emulates an agronomist by combining crop coefficients,
  soil multipliers, rainfall balance, irrigation method, and phenology. A richer
  ML model can replace the engine without touching this endpoint.
  """
  prediction = engine.predict(payload)
  return prediction

