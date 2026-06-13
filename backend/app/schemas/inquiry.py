from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Dict, Optional, Any

class InquiryCreate(BaseModel):
    company_name: str = Field(..., min_length=2, max_length=255, description="Client company name")
    contact_email: EmailStr = Field(..., description="Corporate communication email")
    estimated_volume: str = Field(..., description="Estimated bulk quantity bracket, e.g. '100-500', '500-1000', '1000+'")
    message_text: Optional[str] = Field(None, description="Custom specifications and requirements")
    items_inquired: Optional[List[Dict[str, Any]]] = Field(
        None, 
        description="JSONB structured array of garments e.g. [{'id': 1, 'name': 'Linen Robe', 'color': 'White', 'quantity': 150}]"
    )

class InquiryResponse(InquiryCreate):
    id: int
    user_id: Optional[int] = None
    status: str = Field(..., description="Status of the inquiry (e.g. pending, reviewing, accepted, shipped)")
    created_at: datetime

    class Config:
        from_attributes = True
