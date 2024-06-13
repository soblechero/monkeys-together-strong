import os
import secrets
from typing import Annotated, Any, Literal

from dotenv import load_dotenv
from pydantic import (
    AnyUrl,
    BeforeValidator,
    computed_field
)
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    load_dotenv()
    model_config = SettingsConfigDict(
        env_file=f"./.env.{os.getenv('ENV_MODE', 'development')}",  # Dynamically set env file
        env_ignore_empty=True,
        extra="ignore"
    )

    PROJECT_NAME: str = "Monkeys Together Strong"

    API_VER_PREFIX: str = ""
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 28 days = 28 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 28
    ENVIRONMENT: Literal["development", "testing", "production"] = "development"
    BACKEND_CORS_ORIGINS: Annotated[list[str] | str, BeforeValidator(parse_cors)] = "*"

    IGDB_CLIENT_ID: str = ""
    IGDB_CLIENT_SECRET: str = ""
    IGDB_ACCESS_TOKEN_URL: AnyUrl = "https://id.twitch.tv/oauth2/token"
    IGDB_ACCESS_TOKEN: str | None = None
    IGDB_ACCESS_TOKEN_EXPIRY: float | None = None

    FIRST_USER: str = "testuser1@test.dev"
    FIRST_USER_PASSWORD: str = "Test1234!"
    USERS_OPEN_REGISTRATION: bool = False

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "4444"
    POSTGRES_DB: str = "mts_db"

    SQLITE_FILE: str = "sqlite:///./data/dev.db"

    # MultiHostUrl('postgresql+psycopg://postgres:4444@localhost:5432/mts_db')
    @computed_field
    @property
    def DATABASE_URI(self) -> str:
        if self.ENVIRONMENT == "development":
            return self.SQLITE_FILE
        return MultiHostUrl.build(
            scheme="postgresql+psycopg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        ).unicode_string()


settings = Settings()
