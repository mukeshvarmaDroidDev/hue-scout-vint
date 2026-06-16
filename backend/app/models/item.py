from sqlalchemy import String, Integer, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class ClothingItem(Base):
    __tablename__ = "clothing_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    collection_id: Mapped[int] = mapped_column(ForeignKey("collections.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    fabric_composition: Mapped[str] = mapped_column(String(255), nullable=False)  # e.g., "100% Belgian Linen"
    gsm_weight: Mapped[int] = mapped_column(Integer, nullable=False)  # e.g., 340 GSM
    available_colors: Mapped[list] = mapped_column(JSONB, nullable=False)  # JSONB list of colors e.g. [{"name": "Charcoal", "hex": "#1A1A1A"}]
    images: Mapped[list] = mapped_column(JSONB, nullable=False)  # JSONB array of image URLs
    knit_structure: Mapped[str] = mapped_column(String(255), nullable=True)  # e.g., "Single Jersey"
    finish: Mapped[str] = mapped_column(String(255), nullable=True)  # e.g., "Bio-Washed"

    collection: Mapped["Collection"] = relationship("Collection", back_populates="items")
