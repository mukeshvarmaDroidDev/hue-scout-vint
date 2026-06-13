from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.collection import Collection
from app.schemas.collection import CollectionResponse, CollectionDetailResponse
from typing import List
from pathlib import Path
import json

router = APIRouter()

def load_overrides():
    mapping_path = Path(__file__).resolve().parent.parent.parent / "product_images.json"
    if mapping_path.exists():
        try:
            with open(mapping_path, "r") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def get_override(overrides, name, default_val):
    for key, val in overrides.items():
        if key.lower() == name.lower():
            return val
    return default_val

@router.get("", response_model=List[CollectionResponse])
def get_collections(db: Session = Depends(get_db)):
    """Fetch all active collections for the landing showroom page."""
    collections = db.query(Collection).filter(Collection.is_active == True).all()
    overrides = load_overrides()
    for col in collections:
        col.cover_image_url = get_override(overrides, col.title, col.cover_image_url)
    return collections

@router.get("/{slug}", response_model=CollectionDetailResponse)
def get_collection_by_slug(slug: str, db: Session = Depends(get_db)):
    """Retrieve detailed collection cards including all garments, swatches, and GSM weights."""
    collection = db.query(Collection).filter(Collection.slug == slug, Collection.is_active == True).first()
    if not collection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested collection does not exist or has been archived."
        )
    overrides = load_overrides()
    collection.cover_image_url = get_override(overrides, collection.title, collection.cover_image_url)
    for item in collection.items:
        override_img = get_override(overrides, item.name, None)
        if override_img:
            item.images = [override_img]
    return collection
