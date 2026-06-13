from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.item import ClothingItemResponse

class CollectionBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    slug: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    season: str = Field(..., min_length=2, max_length=50, description="Season e.g. FW 2026")
    cover_image_url: Optional[str] = None
    is_active: bool = True

class CollectionResponse(CollectionBase):
    id: int

    class Config:
        from_attributes = True

class CollectionDetailResponse(CollectionResponse):
    items: List[ClothingItemResponse] = []

    class Config:
        from_attributes = True
