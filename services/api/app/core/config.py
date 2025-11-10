from functools import lru_cache
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
  """Application settings loaded from environment variables or defaults."""
  
  model_config = {"protected_namespaces": ()}

  project_name: str = Field(default="SmartYield API")
  api_prefix: str = Field(default="/api")
  cors_origins: list[str] = Field(
      default_factory=lambda: [
          "http://localhost:3000",
          "http://localhost:5000",
          "http://127.0.0.1:3000",
          "http://127.0.0.1:5000"
      ]
  )
  cors_origin_regex: str | None = Field(
      default=r"https://.*\.replit\.dev"
  )
  model_data_path: str = Field(default="data/processed")


@lru_cache()
def get_settings() -> Settings:
  return Settings()


settings = get_settings()

