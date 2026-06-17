from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import time
import logging
from sqlalchemy.exc import OperationalError
from .config import settings

engine = create_engine(
    settings.DATABASE_URL
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    logger.info("Initializing database schemas...")
    retries = 15
    while retries > 0:
        try:
            Base.metadata.create_all(bind=engine)
            logger.info("Database connection and schema creation successful.")
            return
        except (OperationalError, Exception) as e:
            logger.warning(f"Database connection failed: {e}")
            logger.warning(f"Retrying database connection in 3 seconds... ({retries - 1} retries left)")
            time.sleep(3)
            retries -= 1
    
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

