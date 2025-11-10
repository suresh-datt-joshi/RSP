from fastapi import APIRouter, HTTPException

from ..models.crop_lifecycle import CropLifecycleRequest, CropLifecycleResponse
from ..services.crop_lifecycle_service import CropLifecycleService

router = APIRouter(prefix="/crop-lifecycle", tags=["crop-lifecycle"])


@router.post("/generate", response_model=CropLifecycleResponse, summary="Generate crop lifecycle calendar")
async def generate_crop_lifecycle(request: CropLifecycleRequest) -> CropLifecycleResponse:
    """
    Generate a complete crop lifecycle calendar with stage-wise care instructions,
    irrigation and fertilizer schedules, and weather-based alerts.
    
    This endpoint provides dynamic calendar (CalDyn) functionality with:
    - Detailed growth stages and their durations
    - Stage-specific care activities and recommendations
    - Irrigation and fertilization schedules
    - Weather forecast and alerts
    - Harvest readiness indicators
    """
    try:
        lifecycle = await CropLifecycleService.generate_lifecycle(request)
        return lifecycle
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate lifecycle calendar: {str(e)}")
