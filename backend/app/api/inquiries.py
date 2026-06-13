from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.inquiry import BulkInquiry
from app.schemas.inquiry import InquiryCreate, InquiryResponse
from app.models.user import User
from app.api.deps import get_current_user
from typing import List, Optional
import jwt
from app.core.config import settings

router = APIRouter()

def get_optional_current_user(db: Session = Depends(get_db), authorization: Optional[str] = Header(None)) -> Optional[User]:
    """Retrieve user context if Bearer token is valid, otherwise return None (allows guests)."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        user_id = payload.get("user_id")
        if user_id:
            return db.query(User).filter(User.id == user_id).first()
    except jwt.PyJWTError:
        pass
    return None

@router.post("", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
def create_inquiry(
    inquiry_in: InquiryCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Submit a custom bulk inquiry. Links to registered buyer if authenticated."""
    new_inquiry = BulkInquiry(
        user_id=current_user.id if current_user else None,
        company_name=inquiry_in.company_name,
        contact_email=inquiry_in.contact_email,
        estimated_volume=inquiry_in.estimated_volume,
        message_text=inquiry_in.message_text,
        items_inquired=inquiry_in.items_inquired,
        status="pending"
    )
    db.add(new_inquiry)
    db.commit()
    db.refresh(new_inquiry)
    return new_inquiry

@router.get("/my-inquiries", response_model=List[InquiryResponse])
def get_my_inquiries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve the submission history for the authenticated B2B user."""
    inquiries = db.query(BulkInquiry).filter(BulkInquiry.user_id == current_user.id).order_by(BulkInquiry.created_at.desc()).all()
    return inquiries
