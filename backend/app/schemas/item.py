from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class ClothingItemBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = None
    fabric_composition: str = Field(..., description="e.g., 100% Belgian Linen")
    gsm_weight: int = Field(..., ge=30, le=1000, description="GSM weight of the fabric")
    available_colors: List[Dict[str, str]] = Field(..., description="Wholesale color swatches, e.g. [{'name': 'Cream', 'hex': '#FDFBF7'}]")
    images: List[str] = Field(..., description="Array of clothing lookbook image URLs")

class ClothingItemResponse(ClothingItemBase):
    id: int
    collection_id: int

    class Config:
        from_attributes = True
