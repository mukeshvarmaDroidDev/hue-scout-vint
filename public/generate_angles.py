import os
from PIL import Image

def generate_garment_angles():
    public_dir = os.path.dirname(os.path.abspath(__file__))
    styles = ["regular", "oversized", "polo"]
    colors = ["black", "white", "navy", "grey"]

    print(f"Starting image angle generation in: {public_dir}")

    for style in styles:
        for color in colors:
            base_filename = f"{style}-{color}.png"
            base_path = os.path.join(public_dir, base_filename)

            if not os.path.exists(base_path):
                print(f"Warning: Base image not found at {base_path}")
                continue

            try:
                # Open base image
                img = Image.open(base_path)
                w, h = img.size
                
                # 1. Front Angle
                front_path = os.path.join(public_dir, f"{style}-{color}-front.png")
                img.save(front_path)
                
                # 2. Back Angle (Horizontal flip of the front view)
                back_path = os.path.join(public_dir, f"{style}-{color}-back.png")
                back_img = img.transpose(Image.FLIP_LEFT_RIGHT)
                back_img.save(back_path)
                
                # 3. Close-up Texture Angle (30%-70% crop of the chest area zoomed in)
                close_path = os.path.join(public_dir, f"{style}-{color}-close.png")
                left = int(w * 0.3)
                top = int(h * 0.3)
                right = int(w * 0.7)
                bottom = int(h * 0.7)
                
                cropped = img.crop((left, top, right, bottom))
                close_img = cropped.resize((w, h), Image.Resampling.LANCZOS)
                close_img.save(close_path)

                print(f"Generated 3 angles for {style}-{color}")

            except Exception as e:
                print(f"Error processing {base_filename}: {e}")

if __name__ == "__main__":
    generate_garment_angles()
