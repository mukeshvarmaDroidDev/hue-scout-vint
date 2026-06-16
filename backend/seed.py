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
        plain_regular_col = Collection(
            title="Plain Regular T-Shirts",
            slug="plain-regular-t-shirts",
            description="Premium combed cotton single jersey regular-fit t-shirts. Expertly tailored and bio-washed for luxury touch and everyday coordinates.",
            season="SS 2026",
            cover_image_url=get_override("Plain Regular T-Shirts", "/round-neck-black.png"),
            is_active=True
        )
        plain_oversized_col = Collection(
            title="Plain Oversized T-Shirts",
            slug="plain-oversized-t-shirts",
            description="Heavyweight loop knit oversized t-shirts. Relaxed shoulder drops and structured drape for clean modern streetwear silhouettes.",
            season="SS 2026",
            cover_image_url=get_override("Plain Oversized T-Shirts", "/round-neck-black.png"),
            is_active=True
        )
        polo_col = Collection(
            title="Polo T-Shirts",
            slug="polo-t-shirts",
            description="Classic pique collared polo t-shirts in premium weights, offering structural collar builds and breathable fits.",
            season="SS 2026",
            cover_image_url=get_override("Polo T-Shirts", "/polo-black.png"),
            is_active=True
        )
        
        db.add_all([plain_regular_col, plain_oversized_col, polo_col])
        db.commit()  # Generate IDs

        # Colors and Swatches
        colors = [
            {"name": "Noir Black", "hex": "#1C1C1C", "suffix": "black"},
            {"name": "Optic White", "hex": "#FAFAFA", "suffix": "white"},
            {"name": "Navy Dusk", "hex": "#1A252C", "suffix": "navy"},
            {"name": "Melange Grey", "hex": "#A0A0A0", "suffix": "grey"}
        ]
        
        swatches = [{"name": c["name"], "hex": c["hex"]} for c in colors]

        def get_all_images(style_prefix):
            img_list = []
            for c in colors:
                suffix = c["suffix"]
                # 3 angles for each color
                img_list.extend([
                    f"/{style_prefix}-{suffix}-front.png",
                    f"/{style_prefix}-{suffix}-back.png",
                    f"/{style_prefix}-{suffix}-close.png"
                ])
            return img_list

        print("Seeding clothing items...")
        
        # 1. Plain Regular T-Shirts: 2 GSMs (160, 180) = 2 items
        for gsm in [160, 180]:
            name = f"Plain Regular T-Shirt - {gsm} GSM"
            description = f"A premium {gsm} GSM combed cotton single jersey regular-fit t-shirt. Tailored for high-end wholesale and custom coordinates, bio-washed for maximum softness."
            
            images = get_all_images("regular")
            override_images = get_override(name, None)
            if override_images:
                images = override_images if isinstance(override_images, list) else [override_images]
            
            item = ClothingItem(
                collection_id=plain_regular_col.id,
                name=name,
                description=description,
                fabric_composition="100% Cotton",
                gsm_weight=gsm,
                knit_structure="Single Jersey",
                finish="Bio-Washed",
                available_colors=swatches,
                images=images
            )
            db.add(item)
                
        # 2. Plain Oversized T-Shirts: 2 GSMs (220, 240) = 2 items
        for gsm in [220, 240]:
            name = f"Plain Oversized T-Shirt - {gsm} GSM"
            description = f"A heavy {gsm} GSM combed cotton loop knit oversized t-shirt. Features relaxed drop-shoulder tailoring and substantial drape with a standard softener finish."
            
            images = get_all_images("oversized")
            override_images = get_override(name, None)
            if override_images:
                images = override_images if isinstance(override_images, list) else [override_images]
            
            item = ClothingItem(
                collection_id=plain_oversized_col.id,
                name=name,
                description=description,
                fabric_composition="100% Cotton",
                gsm_weight=gsm,
                knit_structure="Loop Knit",
                finish="Standard Softener",
                available_colors=swatches,
                images=images
            )
            db.add(item)

        # 3. Polo T-Shirts: 1 GSM (220) = 1 item
        name = "Polo T-Shirt - 220 GSM"
        description = "A classic 220 GSM pique polo t-shirt. Breathable knit structure, structured ribbed collar build, and durable standard softener finish."
        
        images = get_all_images("polo")
        override_images = get_override(name, None)
        if override_images:
            images = override_images if isinstance(override_images, list) else [override_images]
        
        item = ClothingItem(
            collection_id=polo_col.id,
            name=name,
            description=description,
            fabric_composition="100% Cotton",
            gsm_weight=220,
            knit_structure="Polo / Pique",
            finish="Standard Softener",
            available_colors=swatches,
            images=images
        )
        db.add(item)

        db.commit()
        print("Database successfully seeded with 5 premium T-shirt variants!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
