import os
import random
from PIL import Image, ImageDraw, ImageFilter

def generate_back_views():
    public_dir = os.path.dirname(os.path.abspath(__file__))
    colors = ["black", "white", "navy", "grey"]
    
    print(f"Starting seamless back view generation in: {public_dir}")
    
    # -------------------------------------------------------------------------
    # 1. Regular T-Shirts Back View Generation
    # -------------------------------------------------------------------------
    x_l_reg, x_r_reg = 370, 654
    y_shoulder_reg = 245
    y_center_reg = 260
    y_bottom_reg = 370
    a_reg = -0.00074
    
    random.seed(42)
    for color in colors:
        base_path = os.path.join(public_dir, f"regular-{color}.png")
        back_path = os.path.join(public_dir, f"regular-{color}-back.png")
        
        if not os.path.exists(base_path):
            print(f"Warning: regular-{color}.png not found")
            continue
            
        try:
            img = Image.open(base_path).convert("RGB")
            w, h = img.size
            
            # Temp image for interpolation
            temp_img = img.copy()
            temp_pixels = temp_img.load()
            orig_pixels = img.load()
            
            # Fill below curve with horizontal interpolation
            for y in range(y_shoulder_reg - 15, y_bottom_reg + 25):
                c_l = orig_pixels[max(0, x_l_reg - 5), y]
                c_r = orig_pixels[min(w - 1, x_r_reg + 5), y]
                
                for x in range(x_l_reg - 15, x_r_reg + 16):
                    # Back neckline curve check
                    y_curve = a_reg * ((x - 512) ** 2) + y_center_reg
                    if y >= y_curve:
                        # Interpolate
                        weight = (x - (x_l_reg - 15)) / ((x_r_reg + 15) - (x_l_reg - 15))
                        r = (1 - weight) * c_l[0] + weight * c_r[0]
                        g = (1 - weight) * c_l[1] + weight * c_r[1]
                        b = (1 - weight) * c_l[2] + weight * c_r[2]
                        temp_pixels[x, y] = (int(r), int(g), int(b))
                        
            # Blur the interpolated region to remove horizontal streaks
            crop_box = (x_l_reg - 20, y_shoulder_reg - 20, x_r_reg + 20, y_bottom_reg + 30)
            interpolated_area = temp_img.crop(crop_box)
            blurred_area = interpolated_area.filter(ImageFilter.GaussianBlur(radius=6))
            temp_img.paste(blurred_area, (x_l_reg - 20, y_shoulder_reg - 20))
            
            # Add fine monochrome noise
            temp_pixels = temp_img.load()
            for y in range(y_shoulder_reg - 15, y_bottom_reg + 25):
                for x in range(x_l_reg - 15, x_r_reg + 16):
                    y_curve = a_reg * ((x - 512) ** 2) + y_center_reg
                    if y >= y_curve:
                        c = temp_pixels[x, y]
                        noise = random.uniform(-1.0, 1.0)
                        r = min(255, max(0, int(c[0] + noise)))
                        g = min(255, max(0, int(c[1] + noise)))
                        b = min(255, max(0, int(c[2] + noise)))
                        temp_pixels[x, y] = (r, g, b)
                        
            # Create precise composite mask
            mask_full = Image.new('L', (w, h), 0)
            draw_full = ImageDraw.Draw(mask_full)
            
            points = []
            points.append((x_l_reg, y_shoulder_reg + 10))
            for x in range(x_l_reg, x_r_reg + 1):
                y = a_reg * ((x - 512) ** 2) + y_center_reg
                points.append((x, int(y)))
            points.append((x_r_reg, y_shoulder_reg + 10))
            points.append((x_r_reg, y_bottom_reg))
            points.append((x_l_reg, y_bottom_reg))
            draw_full.polygon(points, fill=255)
            
            mask_blurred = mask_full.filter(ImageFilter.GaussianBlur(radius=5))
            
            mask_limit = Image.new('L', (w, h), 0)
            draw_limit = ImageDraw.Draw(mask_limit)
            limit_points = []
            limit_points.append((0, h))
            limit_points.append((0, y_shoulder_reg + 10))
            limit_points.append((x_l_reg, y_shoulder_reg + 10))
            for x in range(x_l_reg, x_r_reg + 1):
                y = a_reg * ((x - 512) ** 2) + y_center_reg
                limit_points.append((x, int(y)))
            limit_points.append((x_r_reg, y_shoulder_reg + 10))
            limit_points.append((w, y_shoulder_reg + 10))
            limit_points.append((w, h))
            draw_limit.polygon(limit_points, fill=255)
            
            final_mask = Image.new('L', (w, h), 0)
            final_mask.paste(mask_blurred, mask=mask_limit)
            
            # Soft vertical transition at the bottom
            final_pixels = final_mask.load()
            for y in range(y_bottom_reg - 25, y_bottom_reg):
                factor = 1.0 - (y - (y_bottom_reg - 25)) / 25
                for x in range(x_l_reg - 15, x_r_reg + 16):
                    final_pixels[x, y] = int(final_pixels[x, y] * factor)
                    
            back_img = Image.composite(temp_img, img, final_mask)
            back_img.save(back_path)
            print(f"Generated back view for regular-{color}")
            
        except Exception as e:
            print(f"Error regular-{color}: {e}")
            
    # -------------------------------------------------------------------------
    # 2. Oversized T-Shirts Back View Generation
    # -------------------------------------------------------------------------
    x_l_ove, x_r_ove = 370, 654
    y_shoulder_ove = 190
    y_center_ove = 240
    y_bottom_ove = 320
    a_ove = -0.00114
    
    for color in colors:
        base_path = os.path.join(public_dir, f"oversized-{color}.png")
        back_path = os.path.join(public_dir, f"oversized-{color}-back.png")
        
        if not os.path.exists(base_path):
            print(f"Warning: oversized-{color}.png not found")
            continue
            
        try:
            img = Image.open(base_path).convert("RGB")
            w, h = img.size
            
            temp_img = img.copy()
            temp_pixels = temp_img.load()
            orig_pixels = img.load()
            
            for y in range(y_shoulder_ove - 15, y_bottom_ove + 25):
                c_l = orig_pixels[max(0, x_l_ove - 5), y]
                c_r = orig_pixels[min(w - 1, x_r_ove + 5), y]
                
                for x in range(x_l_ove - 15, x_r_ove + 16):
                    y_curve = a_ove * ((x - 512) ** 2) + y_center_ove
                    if y >= y_curve:
                        weight = (x - (x_l_ove - 15)) / ((x_r_ove + 15) - (x_l_ove - 15))
                        r = (1 - weight) * c_l[0] + weight * c_r[0]
                        g = (1 - weight) * c_l[1] + weight * c_r[1]
                        b = (1 - weight) * c_l[2] + weight * c_r[2]
                        temp_pixels[x, y] = (int(r), int(g), int(b))
                        
            crop_box = (x_l_ove - 20, y_shoulder_ove - 20, x_r_ove + 20, y_bottom_ove + 30)
            interpolated_area = temp_img.crop(crop_box)
            blurred_area = interpolated_area.filter(ImageFilter.GaussianBlur(radius=6))
            temp_img.paste(blurred_area, (x_l_ove - 20, y_shoulder_ove - 20))
            
            temp_pixels = temp_img.load()
            for y in range(y_shoulder_ove - 15, y_bottom_ove + 25):
                for x in range(x_l_ove - 15, x_r_ove + 16):
                    y_curve = a_ove * ((x - 512) ** 2) + y_center_ove
                    if y >= y_curve:
                        c = temp_pixels[x, y]
                        noise = random.uniform(-1.0, 1.0)
                        r = min(255, max(0, int(c[0] + noise)))
                        g = min(255, max(0, int(c[1] + noise)))
                        b = min(255, max(0, int(c[2] + noise)))
                        temp_pixels[x, y] = (r, g, b)
                        
            mask_full = Image.new('L', (w, h), 0)
            draw_full = ImageDraw.Draw(mask_full)
            
            points = []
            points.append((x_l_ove, y_shoulder_ove + 10))
            for x in range(x_l_ove, x_r_ove + 1):
                y = a_ove * ((x - 512) ** 2) + y_center_ove
                points.append((x, int(y)))
            points.append((x_r_ove, y_shoulder_ove + 10))
            points.append((x_r_ove, y_bottom_ove))
            points.append((x_l_ove, y_bottom_ove))
            draw_full.polygon(points, fill=255)
            
            mask_blurred = mask_full.filter(ImageFilter.GaussianBlur(radius=5))
            
            mask_limit = Image.new('L', (w, h), 0)
            draw_limit = ImageDraw.Draw(mask_limit)
            limit_points = []
            limit_points.append((0, h))
            limit_points.append((0, y_shoulder_ove + 10))
            limit_points.append((x_l_ove, y_shoulder_ove + 10))
            for x in range(x_l_ove, x_r_ove + 1):
                y = a_ove * ((x - 512) ** 2) + y_center_ove
                limit_points.append((x, int(y)))
            limit_points.append((x_r_ove, y_shoulder_ove + 10))
            limit_points.append((w, y_shoulder_ove + 10))
            limit_points.append((w, h))
            draw_limit.polygon(limit_points, fill=255)
            
            final_mask = Image.new('L', (w, h), 0)
            final_mask.paste(mask_blurred, mask=mask_limit)
            
            final_pixels = final_mask.load()
            y_transition_start = y_bottom_ove - 25
            for y in range(y_transition_start, y_bottom_ove):
                factor = 1.0 - (y - y_transition_start) / 25
                for x in range(x_l_ove - 15, x_r_ove + 16):
                    final_pixels[x, y] = int(final_pixels[x, y] * factor)
                    
            back_img = Image.composite(temp_img, img, final_mask)
            back_img.save(back_path)
            print(f"Generated back view for oversized-{color}")
            
        except Exception as e:
            print(f"Error oversized-{color}: {e}")

if __name__ == "__main__":
    generate_back_views()
