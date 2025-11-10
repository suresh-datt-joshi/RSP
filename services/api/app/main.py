from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .core import settings
from .routers import api_router


def create_app() -> FastAPI:
  app = FastAPI(
      title=settings.project_name,
      version="0.1.0",
      openapi_url=f"{settings.api_prefix}/openapi.json"
  )

  app.add_middleware(
      CORSMiddleware,
      allow_origins=settings.cors_origins,
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"]
  )

  @app.get("/health", tags=["health"])
  async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}

  app.include_router(api_router, prefix=settings.api_prefix)
  return app


app = create_app()

