import sys
from pathlib import Path
import json

# Add backend directory to Python path for imports
sys.path.append(str(Path(__file__).resolve().parent))

from sqlalchemy.orm import Session
from app.core.db import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.user import User
from app.models.collection import Collection
from app.models.item import ClothingItem

def seed_db():
    db: Session = SessionLocal()
    try:
        print("Recreating database tables...")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)

        # Load custom image overrides
        overrides_path = Path(__file__).resolve().parent / "product_images.json"
        overrides = {}
        if overrides_path.exists():
            try:
                with open(overrides_path, "r") as f:
                    overrides = json.load(f)
                print(f"Loaded {len(overrides)} image overrides from config.")
            except Exception as e:
                print(f"Warning: could not load image overrides: {e}")

        def get_override(name, default_val):
            for key, val in overrides.items():
                if key.lower() == name.lower():
                    return val
            return default_val

        print("Creating default B2B partner account...")
        hashed_password = get_password_hash("password123")
        default_partner = User(
            company_name="Atelier & Co.",
            email="partner@boutique.com",
            hashed_password=hashed_password,
            is_verified_buyer=True
        )
        db.add(default_partner)

        print("Creating T-Shirt collections...")
        round_neck_col = Collection(
            title="Round Neck T-Shirts",
            slug="round-neck-t-shirts",
            description="Premium 100% bio-wash combed cotton round neck t-shirts, tailored for luxury screen-printing and everyday coordinates.",
            season="SS 2026",
            cover_image_url=get_override("Round Neck T-Shirts", "/round-neck-black.png"),
            is_active=True
        )
        polo_col = Collection(
            title="Polo T-Shirts",
            slug="polo-t-shirts",
            description="Classic pique collared polo t-shirts in various weights, offering structural collar builds and breathable fits.",
            season="SS 2026",
            cover_image_url=get_override("Polo T-Shirts", "/polo-black.png"),
            is_active=True
        )
        
        db.add_all([round_neck_col, polo_col])
        db.commit()  # Generate IDs

        # Colors and Swatches
        colors = [
            {"name": "Noir Black", "hex": "#1C1C1C", "suffix": "black"},
            {"name": "Optic White", "hex": "#FAFAFA", "suffix": "white"},
            {"name": "Navy Dusk", "hex": "#1A252C", "suffix": "navy"},
            {"name": "Melange Grey", "hex": "#A0A0A0", "suffix": "grey"}
        ]
        
        swatches = [{"name": c["name"], "hex": c["hex"]} for c in colors]
        gsms = [160, 180, 200]

        print("Seeding Round Neck T-Shirts (12 items)...")
        for gsm in gsms:
            for color in colors:
                name = f"Bio Wash Round Neck T-Shirt - {gsm} GSM ({color['name']})"
                description = f"A premium {gsm} GSM 100% combed cotton round neck bio-washed T-shirt in {color['name']}. Soft, durable, and perfect for printing or custom apparel lines."
                default_image = f"/round-neck-{color['suffix']}.png"
                image_url = get_override(name, default_image)
                
                item = ClothingItem(
                    collection_id=round_neck_col.id,
                    name=name,
                    description=description,
                    fabric_composition="100% Bio Wash Combed Cotton",
                    gsm_weight=gsm,
                    available_colors=swatches,
                    images=[image_url]
                )
                db.add(item)

        print("Seeding Polo T-Shirts (12 items)...")
        for gsm in gsms:
            for color in colors:
                name = f"Premium Pique Polo T-Shirt - {gsm} GSM ({color['name']})"
                description = f"A high-end {gsm} GSM 100% combed cotton pique polo shirt in {color['name']}. Features a structured collar, buttons, and breathable fit."
                default_image = f"/polo-{color['suffix']}.png"
                image_url = get_override(name, default_image)
                
                item = ClothingItem(
                    collection_id=polo_col.id,
                    name=name,
                    description=description,
                    fabric_composition="100% Premium Combed Cotton Pique",
                    gsm_weight=gsm,
                    available_colors=swatches,
                    images=[image_url]
                )
                db.add(item)

        db.commit()
        print("Database successfully seeded with 24 premium T-shirt variants!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
