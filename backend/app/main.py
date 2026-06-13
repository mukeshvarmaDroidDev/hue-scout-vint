from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import engine, Base
from app.api import auth, collections, inquiries
# Import all models to ensure they are registered with Base metadata
from app.models import User, Collection, ClothingItem, BulkInquiry

# Automatically create PostgreSQL database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HUEscout B2B Clothing Showroom API",
    description="Backend services for the minimalist high-fashion bulk supply digital showroom.",
    version="1.0.0"
)

# CORS configurations for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production domains as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(collections.router, prefix="/api/v1/collections", tags=["Collections"])
app.include_router(inquiries.router, prefix="/api/v1/inquiries", tags=["Inquiries"])

@app.get("/api/v1/health")
def health_check():
    """Health check endpoint to verify backend status."""
    return {"status": "healthy"}
