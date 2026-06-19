import os
from PIL import Image, ImageChops

def generate_experiment():
    public_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Load white regular t-shirt base
    white_tshirt_path = os.path.join(public_dir, "regular-white.png")
    if not os.path.exists(white_tshirt_path):
        print("Error: regular-white.png not found")
        return
        
    tshirt = Image.open(white_tshirt_path).convert("RGBA")
    
    # 2. Load pattern image
    pattern_path = os.path.join(public_dir, "Artboard 1 copy 6@4x-100.jpg")
    if not os.path.exists(pattern_path):
        print("Error: Artboard 1 copy 6@4x-100.jpg not found")
        return
        
    pattern = Image.open(pattern_path).convert("RGBA")
    pattern = pattern.resize(tshirt.size, Image.Resampling.LANCZOS)
    
    # 3. Multiply pattern and tshirt to apply shadows/folds
    tshirt_rgb = tshirt.convert("RGB")
    pattern_rgb = pattern.convert("RGB")
    
    blended_rgb = ImageChops.multiply(pattern_rgb, tshirt_rgb)
    
    # Put back the alpha channel of the tshirt so the background remains transparent
    tshirt_alpha = tshirt.split()[3]
    blended = Image.new("RGBA", tshirt.size)
    blended.paste(blended_rgb, (0, 0))
    blended.putalpha(tshirt_alpha)
    
    # 4. Overlay the black H logo (Asset 3.png)
    logo_path = os.path.join(public_dir, "Asset 3.png")
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        logo_w, logo_h = 60, 60
        resized_logo = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
        
        # Centered chest placement
        x_pos = int((tshirt.size[0] - logo_w) / 2)
        y_pos = 380
        blended.paste(resized_logo, (x_pos, y_pos), resized_logo)
        
    # 5. Save in artifacts directory
    artifact_dir = "/Users/mukeshvarma/.gemini/antigravity-ide/brain/53087a9e-746a-4fc0-9844-f54bfb515ffc"
    out_path = os.path.join(artifact_dir, "experiment-regular-pattern-front.png")
    
    if not os.path.exists(artifact_dir):
        os.makedirs(artifact_dir, exist_ok=True)
        
    blended.save(out_path)
    print(f"Experimental garment generated successfully at: {out_path}")

if __name__ == "__main__":
    generate_experiment()
