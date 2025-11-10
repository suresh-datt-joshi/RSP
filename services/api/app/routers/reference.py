from fastapi import APIRouter

from ..models import ReferenceOptions

router = APIRouter()

REFERENCE_DATA = ReferenceOptions(
    crops=[
        {"id": "wheat", "name": "Wheat", "duration": "120 days"},
        {"id": "rice", "name": "Rice", "duration": "135 days"},
        {"id": "maize", "name": "Maize", "duration": "110 days"},
        {"id": "cotton", "name": "Cotton", "duration": "180 days"},
        {"id": "soybean", "name": "Soybean", "duration": "105 days"},
        {"id": "sugarcane", "name": "Sugarcane", "duration": "300 days"}
    ],
    soils=[
        {"id": "alluvial", "name": "Alluvial", "suitability": "High fertility"},
        {"id": "black", "name": "Black (Regur)", "suitability": "Moisture retentive"},
        {"id": "red", "name": "Red", "suitability": "Good drainage"},
        {"id": "laterite", "name": "Laterite", "suitability": "Acidic"},
        {"id": "loamy", "name": "Loamy", "suitability": "Balanced texture"},
        {"id": "sandy", "name": "Sandy", "suitability": "Fast draining"}
    ],
    irrigation=[
        {"id": "rainfed", "name": "Rainfed", "waterUse": "Seasonal rainfall"},
        {"id": "drip", "name": "Drip", "waterUse": "Precise low volume"},
        {"id": "sprinkler", "name": "Sprinkler", "waterUse": "Moderate"},
        {"id": "canal", "name": "Canal", "waterUse": "Surface flow"}
    ]
)


@router.get("/options", response_model=ReferenceOptions)
async def get_reference_options() -> ReferenceOptions:
  return REFERENCE_DATA

