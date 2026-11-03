import os
import sys

# Ensure Pillow is installed
try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("Pillow is not installed. Installing it now...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw, ImageFont

base_path = r"c:\Users\FACHRY\porto\public\assets\CARD.png"
photo_path = r"c:\Users\FACHRY\porto\public\assets\Foto Fachry.jpeg"
output_path = r"c:\Users\FACHRY\porto\public\assets\CARD.png"

if not os.path.exists(base_path):
    print(f"Error: {base_path} not found")
    sys.exit(1)

if not os.path.exists(photo_path):
    print(f"Error: {photo_path} not found")
    sys.exit(1)

print("Opening images...")
base_img = Image.open(base_path).convert("RGBA")
photo_img = Image.open(photo_path).convert("RGBA")

# Bounding box coordinates for the placeholder
min_x, max_x = 286, 472
min_y, max_y = 104, 284
width = max_x - min_x + 1
height = max_y - min_y + 1

# Crop and resize photo to fit width x height with cover behavior
photo_w, photo_h = photo_img.size
photo_aspect = photo_w / photo_h
target_aspect = width / height

if photo_aspect > target_aspect:
    new_h = photo_h
    new_w = int(photo_h * target_aspect)
    offset_x = (photo_w - new_w) // 2
    photo_cropped = photo_img.crop((offset_x, 0, offset_x + new_w, photo_h))
else:
    new_w = photo_w
    new_h = int(photo_w / target_aspect)
    offset_y = (photo_h - new_h) // 2
    photo_cropped = photo_img.crop((0, offset_y, photo_w, offset_y + new_h))

photo_resized = photo_cropped.resize((width, height), Image.Resampling.LANCZOS)

# Create mask for rounded corners
mask = Image.new("L", (width, height), 0)
draw_mask = ImageDraw.Draw(mask)
draw_mask.rounded_rectangle([0, 0, width, height], radius=16, fill=255)

# Paste photo onto base image using rounded mask
base_img.paste(photo_resized, (min_x, min_y), mask)

# Clear the "Nama Kalian" area
draw = ImageDraw.Draw(base_img)
draw.rectangle([270, 320, 490, 370], fill=(255, 255, 255, 255))

# Draw the name
name = "Fachry Fariska Ilham"
try:
    font = ImageFont.truetype("arial.ttf", 15)
except IOError:
    font = ImageFont.load_default()

# Get text bounding box to center it
text_bbox = draw.textbbox((0, 0), name, font=font)
text_w = text_bbox[2] - text_bbox[0]
text_h = text_bbox[3] - text_bbox[1]
text_x = 380 - (text_w // 2)
text_y = 345 - (text_h // 2)

draw.text((text_x, text_y), name, fill=(0, 0, 0, 255), font=font)

# Save output
base_img.convert("RGB").save(output_path, "PNG")
print("Card compiled successfully!")
