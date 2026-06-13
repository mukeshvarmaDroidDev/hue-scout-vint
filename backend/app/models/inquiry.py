from datetime import datetime, timezone
from sqlalchemy import String, Text, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base
from typing import Optional

class BulkInquiry(Base):
    __tablename__ = "bulk_inquiries"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_email: Mapped[str] = mapped_column(String(255), nullable=False)
    estimated_volume: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., "100-500", "500-1000", "1000+"
    message_text: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending")  # pending, reviewing, accepted, sampling, production, shipped
    items_inquired: Mapped[Optional[list]] = mapped_column(JSONB, nullable=True)  # List of items e.g. [{"item_id": 1, "name": "Linen Trench", "color": "Natural", "quantity": 250}]
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    user: Mapped[Optional["User"]] = relationship("User", back_populates="inquiries")
