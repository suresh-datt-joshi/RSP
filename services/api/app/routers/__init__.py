from fastapi import APIRouter

from . import advice, predict, reference

api_router = APIRouter()
api_router.include_router(reference.router, prefix="/reference", tags=["reference"])
api_router.include_router(predict.router, prefix="/yield", tags=["prediction"])
api_router.include_router(advice.router, prefix="/advice", tags=["advice"])

__all__ = ["api_router"]

