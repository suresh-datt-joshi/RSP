from functools import lru_cache
from pydantic import BaseSettings, Field


class Settings(BaseSettings):
  """Application settings loaded from environment variables or defaults."""

  project_name: str = Field(default="SmartYield API")
  api_prefix: str = Field(default="/api")
  cors_origins: list[str] = Field(
      default_factory=lambda: [
          "http://localhost:3000",
          "http://127.0.0.1:3000"
      ]
  )
  model_data_path: str = Field(default="data/processed")

  class Config:
    env_file = ".env"
    case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
  return Settings()


settings = get_settings()

