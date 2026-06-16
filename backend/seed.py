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

        def get_aligned_colors_and_images(item_color_name, style_prefix):
            matching_color_idx = next(i for i, c in enumerate(colors) if c["name"].lower() == item_color_name.lower())
            
            aligned_colors = swatches[matching_color_idx:] + swatches[:matching_color_idx]
            
            suffix_list = [c["suffix"] for c in colors]
            aligned_images = [f"/{style_prefix}-{s}.png" for s in suffix_list]
            aligned_images = aligned_images[matching_color_idx:] + aligned_images[:matching_color_idx]
            
            return aligned_colors, aligned_images

        print("Seeding clothing items...")
        
        # 1. Plain Regular T-Shirts: 2 GSMs (160, 180) * 4 Colors = 8 items
        for gsm in [160, 180]:
            for color in colors:
                name = f"Plain Regular T-Shirt - {gsm} GSM ({color['name']})"
                description = f"A premium {gsm} GSM combed cotton single jersey regular-fit t-shirt in {color['name']}. Tailored for high-end wholesale and custom coordinates, bio-washed for maximum softness."
                
                item_colors, item_images = get_aligned_colors_and_images(color["name"], "regular")
                images = get_override(name, item_images)
                if isinstance(images, str):
                    images = [images]
                
                item = ClothingItem(
                    collection_id=plain_regular_col.id,
                    name=name,
                    description=description,
                    fabric_composition="100% Cotton",
                    gsm_weight=gsm,
                    knit_structure="Single Jersey",
                    finish="Bio-Washed",
                    available_colors=item_colors,
                    images=images
                )
                db.add(item)
                
        # 2. Plain Oversized T-Shirts: 2 GSMs (220, 240) * 4 Colors = 8 items
        for gsm in [220, 240]:
            for color in colors:
                name = f"Plain Oversized T-Shirt - {gsm} GSM ({color['name']})"
                description = f"A heavy {gsm} GSM combed cotton loop knit oversized t-shirt in {color['name']}. Features relaxed drop-shoulder tailoring and substantial drape with a standard softener finish."
                
                item_colors, item_images = get_aligned_colors_and_images(color["name"], "oversized")
                images = get_override(name, item_images)
                if isinstance(images, str):
                    images = [images]
                
                item = ClothingItem(
                    collection_id=plain_oversized_col.id,
                    name=name,
                    description=description,
                    fabric_composition="100% Cotton",
                    gsm_weight=gsm,
                    knit_structure="Loop Knit",
                    finish="Standard Softener",
                    available_colors=item_colors,
                    images=images
                )
                db.add(item)

        # 3. Polo T-Shirts: 1 GSM (220) * 4 Colors = 4 items
        for color in colors:
            name = f"Polo T-Shirt - 220 GSM ({color['name']})"
            description = f"A classic 220 GSM pique polo t-shirt in {color['name']}. Breathable knit structure, structured ribbed collar build, and durable standard softener finish."
            
            item_colors, item_images = get_aligned_colors_and_images(color["name"], "polo")
            images = get_override(name, item_images)
            if isinstance(images, str):
                images = [images]
            
            item = ClothingItem(
                collection_id=polo_col.id,
                name=name,
                description=description,
                fabric_composition="100% Cotton",
                gsm_weight=220,
                knit_structure="Polo / Pique",
                finish="Standard Softener",
                available_colors=item_colors,
                images=images
            )
            db.add(item)

        db.commit()
        print("Database successfully seeded with 20 premium T-shirt variants!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
