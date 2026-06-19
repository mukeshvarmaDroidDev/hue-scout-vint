import os
import glob
from PIL import Image

def apply_texture_blend(base_img, logo_img, x, y, strength=1.0):
    w_logo, h_logo = logo_img.size
    bg_crop = base_img.crop((x, y, x + w_logo, y + h_logo))
    bg_grey = bg_crop.convert("L")
    pixels = list(bg_grey.getdata())
    mean_light = sum(pixels) / len(pixels) if len(pixels) > 0 else 128
    
    bg_data = bg_grey.load()
    modulated_logo = logo_img.copy()
    mod_data = modulated_logo.load()
    
    for px in range(w_logo):
        for py in range(h_logo):
            r, g, b, a = mod_data[px, py]
            if a > 0:
                bg_l = bg_data[px, py]
                factor = 1.0 + strength * ((bg_l / mean_light) - 1.0)
                r = min(255, max(0, int(r * factor)))
                g = min(255, max(0, int(g * factor)))
                b = min(255, max(0, int(b * factor)))
                mod_data[px, py] = (r, g, b, a)
                
    out_img = base_img.copy()
    out_img.paste(modulated_logo, (x, y), modulated_logo)
    return out_img

def generate_branded_garments():
    public_dir = os.path.dirname(os.path.abspath(__file__))
    colors = ["black", "white", "navy", "grey"]
    
    print(f"Starting branded garment generation in: {public_dir}")
    
    # 1. Clear old branded files
    print("Clearing old branded image files...")
    old_files = glob.glob(os.path.join(public_dir, "branded-*.png"))
    for file_path in old_files:
        try:
            os.remove(file_path)
            print(f"Removed: {os.path.basename(file_path)}")
        except Exception as e:
            print(f"Error removing {file_path}: {e}")

    # Paths to logo assets
    logo_black_mark = os.path.join(public_dir, "Asset 3.png")   # Black H
    logo_white_mark = os.path.join(public_dir, "Asset 4.png")   # White H
    logo_black_word = os.path.join(public_dir, "Asset 5.png")   # Black wordmark
    logo_white_word = os.path.join(public_dir, "Asset 6.png")   # White wordmark

    # Check that logo assets exist
    for logo_path in [logo_black_mark, logo_white_mark, logo_black_word, logo_white_word]:
        if not os.path.exists(logo_path):
            print(f"Error: Logo asset not found at {logo_path}")
            return

    # Process each style
    styles = ["regular", "oversized", "polo"]
    
    for style in styles:
        for color in colors:
            base_style = style
            base_filename = f"{base_style}-{color}.png"
            base_path = os.path.join(public_dir, base_filename)
            
            if not os.path.exists(base_path):
                print(f"Warning: Base image not found at {base_path}")
                continue
                
            try:
                # Open base image (always represents the front of the t-shirt)
                front_base = Image.open(base_path).convert("RGBA")
                w, h = front_base.size
                
                # Determine logo colors based on garment color (white for black/navy, black for white/grey)
                is_dark_garment = color in ["black", "navy"]
                brand_mark_path = logo_white_mark if is_dark_garment else logo_black_mark
                brand_word_path = logo_white_word if is_dark_garment else logo_black_word
                
                # Load images
                mark_logo = Image.open(brand_mark_path).convert("RGBA")
                word_logo = Image.open(brand_word_path).convert("RGBA")
                
                # Create output path
                front_out_path = os.path.join(public_dir, f"branded-{style}-{color}-front.png")
                
                # ---------------------------------------------------------------------
                # 1. STYLE: REGULAR
                # ---------------------------------------------------------------------
                if style == "regular":
                    if color in ["white", "grey"]:
                        # Pocket logo configuration (wearer's left chest / viewer's right)
                        logo_w, logo_h = 45, 45
                        resized_logo = mark_logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
                        x_pos, y_pos = 610, 450
                        
                        # Apply natural texture blending
                        front_img = apply_texture_blend(front_base, resized_logo, x_pos, y_pos, strength=1.0)
                        front_img.save(front_out_path)
                    else:
                        # Center logo configuration
                        logo_w, logo_h = 130, 130
                        resized_logo = mark_logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
                        x_pos = int((w - logo_w) / 2)
                        y_pos = 535
                        
                        # Apply natural texture blending
                        front_img = apply_texture_blend(front_base, resized_logo, x_pos, y_pos, strength=1.0)
                        front_img.save(front_out_path)
                    
                # ---------------------------------------------------------------------
                # 2. STYLE: POLO
                # ---------------------------------------------------------------------
                elif style == "polo":
                    # Logo details
                    logo_w, logo_h = 50, 50
                    resized_logo = mark_logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
                    
                    # White and grey polo use hanger-lay layout.
                    # Navy and black polo use flat-lay layout.
                    if color in ["white", "grey"]:
                        x_pos, y_pos = 620, 440
                    else:
                        x_pos, y_pos = 615, 360
                    
                    # Apply natural texture blending
                    front_img = apply_texture_blend(front_base, resized_logo, x_pos, y_pos, strength=1.0)
                    front_img.save(front_out_path)
                    
                # ---------------------------------------------------------------------
                # 3. STYLE: OVERSIZED
                # ---------------------------------------------------------------------
                elif style == "oversized":
                    # Logo details (wordmark for oversized front print)
                    orig_w, orig_h = word_logo.size
                    logo_w = 340
                    logo_h = int((orig_h / orig_w) * logo_w)
                    resized_logo = word_logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
                    x_pos = int((w - logo_w) / 2)
                    y_pos = 370
                    
                    # Apply natural texture blending
                    front_img = apply_texture_blend(front_base, resized_logo, x_pos, y_pos, strength=1.0)
                    front_img.save(front_out_path)
                
                print(f"Generated branded front for {style}-{color}")
                
            except Exception as e:
                print(f"Error processing branded {base_filename}: {e}")

if __name__ == "__main__":
    generate_branded_garments()
