import os
from pathlib import Path
from dotenv import load_dotenv

# Locate and load the .env file relative to this file
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://localhost/huescout")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "b7d341052601cf90e4fbc875b47a3de7b489d8cf2252c842fb187a5522776c5b")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

settings = Settings()
