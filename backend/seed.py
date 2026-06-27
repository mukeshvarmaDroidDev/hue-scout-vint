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
            title="Regular T-Shirts",
            slug="regular-t-shirts",
            description="Premium combed cotton single jersey regular-fit t-shirts. Expertly tailored and bio-washed for luxury touch and everyday coordinates.",
            season="SS 2026",
            cover_image_url=get_override("Regular T-Shirts", "/regular-black-tshirt-clean.png"),
            is_active=True
        )
        plain_oversized_col = Collection(
            title="Oversized T-Shirts",
            slug="oversized-t-shirts",
            description="Heavyweight loop knit oversized t-shirts. Relaxed shoulder drops and structured drape for clean modern streetwear silhouettes.",
            season="SS 2026",
            cover_image_url=get_override("Oversized T-Shirts", "/oversized-black-tshirt-clean.png"),
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

        # Colors and Swatches for Regular & Oversized T-Shirts (11 colors)
        colors_reg_oversized = [
            {"name": "Noir Black", "hex": "#1C1C1C", "suffix": "black"},
            {"name": "Optic White", "hex": "#FAFAFA", "suffix": "white"},
            {"name": "Navy Dusk", "hex": "#1A252C", "suffix": "navy"},
            {"name": "Melange Grey", "hex": "#A0A0A0", "suffix": "grey"},
            {"name": "Red", "hex": "#A31D1D", "suffix": "red"},
            {"name": "Maroon", "hex": "#5A1827", "suffix": "maroon"},
            {"name": "Sky Blue", "hex": "#A9C9D8", "suffix": "skyblue"},
            {"name": "Coral", "hex": "#E27D60", "suffix": "coral"},
            {"name": "Yellow", "hex": "#E9C46A", "suffix": "yellow"},
            {"name": "Beige", "hex": "#E3DAC9", "suffix": "beige"},
            {"name": "Bottle Green", "hex": "#1B4D3E", "suffix": "bottlegreen"}
        ]
        swatches_reg_oversized = [{"name": c["name"], "hex": c["hex"]} for c in colors_reg_oversized]

        # Colors and Swatches for Polo T-Shirts (4 original colors)
        colors_polo = [
            {"name": "Noir Black", "hex": "#1C1C1C", "suffix": "black"},
            {"name": "Optic White", "hex": "#FAFAFA", "suffix": "white"},
            {"name": "Navy Dusk", "hex": "#1A252C", "suffix": "navy"},
            {"name": "Melange Grey", "hex": "#A0A0A0", "suffix": "grey"}
        ]
        swatches_polo = [{"name": c["name"], "hex": c["hex"]} for c in colors_polo]

        def get_all_images(style_prefix):
            if style_prefix == "regular":
                img_list = []
                for c in colors_reg_oversized:
                    suffix = c["suffix"]
                    front_file = "placeholder.svg"
                    back_file = "placeholder.svg"
                    
                    if suffix == "black":
                        front_file = "regular-black-tshirt-clean.png"
                        back_file = "regular-black-tshirt-back.png"
                    elif suffix == "white":
                        front_file = "regular-white-tshirt-clean.png"
                        back_file = "regular-white-back-tshirt-clean.png"
                    elif suffix == "navy":
                        front_file = "regular-navy-dusk-tshirt-clean.png"
                        back_file = "regular-navy-dusk-back-tshirt-clean.png"
                    elif suffix == "grey":
                        front_file = "regular-melange-grey-tshirt-clean.png"
                        back_file = "regular-melange-grey-back-tshirt-clean.png"
                    elif suffix == "red":
                        front_file = "regular-red-tshirt-clean.png"
                        back_file = "regular-red-back-tshirt-clean.png"
                    elif suffix == "maroon":
                        front_file = "regular-maroon-tshirt-clean.png"
                        back_file = "regular-maroon-back-tshirt-clean.png"
                    elif suffix == "skyblue":
                        front_file = "regular-sky-blue-tshirt-clean.png"
                        back_file = "regular-sky-blue-back-tshirt-clean.png"
                    elif suffix == "coral":
                        front_file = "regular-coral-tshirt-clean.png"
                        back_file = "regular-coral-back-tshirt-clean.png"
                    elif suffix == "yellow":
                        front_file = "regular-yellow-tshirt-clean.png"
                        back_file = "regular-yellow-back-tshirt-clean.png"
                    elif suffix == "beige":
                        front_file = "regular-beige-tshirt-clean.png"
                        back_file = "regular-beige-back-tshirt-clean.png"
                    elif suffix == "bottlegreen":
                        front_file = "regular-bottle-green-tshirt-clean.png"
                        back_file = "regular-bottle-green-back-tshirt-clean.png"
                        
                    img_list.extend([
                        f"/{front_file}",
                        f"/{back_file}",
                        "/placeholder.svg",
                        f"/regular-{suffix}-close.png"
                    ])
                return img_list
            elif style_prefix == "oversized":
                img_list = []
                for c in colors_reg_oversized:
                    suffix = c["suffix"]
                    front_file = "placeholder.svg"
                    back_file = "placeholder.svg"
                    
                    if suffix == "black":
                        front_file = "oversized-black-tshirt-clean.png"
                        back_file = "oversized-black-back-tshirt-clean.png"
                    elif suffix == "white":
                        front_file = "oversized-white-tshirt-clean.png"
                        back_file = "oversized-white-back-tshirt-clean.png"
                    elif suffix == "navy":
                        front_file = "oversized-navy-dusk-tshirt-clean.png"
                        back_file = "oversized-navy-dusk-back-tshirt-clean.png"
                    elif suffix == "grey":
                        front_file = "oversized-melange-grey-tshirt-clean.png"
                        back_file = "oversized-melange-grey-back-tshirt-clean.png"
                    elif suffix == "red":
                        front_file = "oversized-red-tshirt-clean.png"
                        back_file = "oversized-red-back-tshirt-clean.png"
                    elif suffix == "maroon":
                        front_file = "oversized-maroon-tshirt.png"
                        back_file = "oversized-maroon-back-tshirt.png"
                    elif suffix == "skyblue":
                        front_file = "oversized-sky-blue-tshirt-clean.png"
                        back_file = "oversized-sky-blue-back-tshirt-clean.png"
                    elif suffix == "coral":
                        front_file = "oversized-coral-tshirt-clean.png"
                        back_file = "oversized-coral-back-tshirt-clean.png"
                    elif suffix == "yellow":
                        front_file = "oversized-yellow-tshirt-clean.png"
                        back_file = "oversized-yellow-back-tshirt-clean.png"
                    elif suffix == "beige":
                        front_file = "oversized-beige-tshirt-clean.png"
                        back_file = "oversized-beige-back-tshirt-clean.png"
                    elif suffix == "bottlegreen":
                        front_file = "oversized-bottle-green-tshirt-clean.png"
                        back_file = "oversized-bottle-green-back-tshirt-clean.png"
                        
                    img_list.extend([
                        f"/{front_file}",
                        f"/{back_file}",
                        "/placeholder.svg",
                        f"/oversized-{suffix}-close.png"
                    ])
                return img_list
            elif style_prefix == "hoodie":
                img_list = []
                for c in colors_reg_oversized[:8]:
                    img_list.extend([
                        "/placeholder.svg",
                        "/placeholder.svg",
                        "/placeholder.svg",
                        "/placeholder.svg"
                    ])
                return img_list
            img_list = []
            for c in colors_polo:
                suffix = c["suffix"]
                # 4 images per colorway: Front, Back, Branded Front, Texture Close-up
                img_list.extend([
                    f"/{style_prefix}-{suffix}-front.png",
                    f"/{style_prefix}-{suffix}-back.png",
                    f"/branded-{style_prefix}-{suffix}-front.png",
                    f"/{style_prefix}-{suffix}-close.png"
                ])
            return img_list

        print("Seeding clothing items...")
        
        # 1. Regular T-Shirts
        name = "Regular Plain T-Shirt"
        description = "A premium combed cotton single jersey regular-fit t-shirt. Tailored for high-end wholesale and custom coordinates, bio-washed for maximum softness."
        images = get_all_images("regular")
        item = ClothingItem(
            collection_id=plain_regular_col.id,
            name=name,
            description=description,
            fabric_composition="100% Cotton",
            gsm_weight=160,
            knit_structure="Single Jersey",
            finish="Bio-Washed",
            available_colors=swatches_reg_oversized,
            images=images
        )
        db.add(item)
            
        # 2. Oversized T-Shirts
        name = "Oversized T-Shirt"
        description = "A heavy combed cotton loop knit oversized t-shirt. Features relaxed drop-shoulder tailoring and substantial drape with a standard softener finish."
        images = get_all_images("oversized")
        item = ClothingItem(
            collection_id=plain_oversized_col.id,
            name=name,
            description=description,
            fabric_composition="100% Cotton",
            gsm_weight=220,
            knit_structure="Loop Knit",
            finish="Standard Softener",
            available_colors=swatches_reg_oversized,
            images=images
        )
        db.add(item)

        # 3. Polo T-Shirts
        name = "Polo T-Shirt"
        description = "A classic premium pique polo t-shirt. Breathable knit structure, structured ribbed collar build, and durable standard softener finish."
        images = get_all_images("polo")
        item = ClothingItem(
            collection_id=polo_col.id,
            name=name,
            description=description,
            fabric_composition="100% Cotton",
            gsm_weight=220,
            knit_structure="Polo / Pique",
            finish="Standard Softener",
            available_colors=swatches_polo,
            images=images
        )
        db.add(item)

        # 4. Regular Plain Hoodies
        name = "Regular Plain Hoodie"
        description = "A premium fleece cotton hoodie featuring a clean regular-fit drape. Constructed with a double cap stitch knit structure and a bio-washed finish for ultimate warmth and a luxury soft feel."
        images = get_all_images("hoodie")
        item = ClothingItem(
            collection_id=plain_regular_col.id,
            name=name,
            description=description,
            fabric_composition="Fleece Cotton",
            gsm_weight=300,
            knit_structure="Double Cap Stitch",
            finish="Bio-Washed",
            available_colors=swatches_reg_oversized[:8],
            images=images
        )
        db.add(item)

        db.commit()
        print("Database successfully seeded with 6 premium variants!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
