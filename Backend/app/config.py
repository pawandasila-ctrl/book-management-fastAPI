from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SECRET_KEY: str = "dev-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    DATABASE_URL : str = (
        "mssql+pyodbc://sa:Password123@sqlserver:1433/master"
        "?driver=ODBC+Driver+18+for+SQL+Server&TrustServerCertificate=yes"
    )

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
