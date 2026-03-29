import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.db import init_db
from app.api import api_router

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get settings
settings = get_settings()

# Initialize database
init_db()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Betty API starting up...")
    yield
    # Shutdown
    logger.info("Betty API shutting down...")


# Create FastAPI app
app = FastAPI(
    title="Betty - World Cup 2026 Predictions",
    description="REST API for World Cup 2026 prediction mini app",
    version="0.1.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router)


@app.get("/", tags=["health"])
def root():
    """Health check endpoint"""
    return {
        "status": "ok",
        "version": "0.1.0",
        "name": "Betty API"
    }


@app.get("/health", tags=["health"])
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
