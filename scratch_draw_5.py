import os
from PIL import Image, ImageDraw, ImageFont

img_path = r"C:\Users\Ricardo\.gemini\antigravity\brain\65b9ffc5-c66d-46d2-ac9d-98d0e4640d90\.user_uploaded\media_1788215053558.png"
out_path = r"C:\Users\Ricardo\.gemini\antigravity\brain\65b9ffc5-c66d-46d2-ac9d-98d0e4640d90\instrucciones_pantalla_5.png"

img = Image.open(img_path).convert('RGB')
draw = ImageDraw.Draw(img)
w, h = img.size

# 1. "Anuncios" Tab
ax1, ay1, ax2, ay2 = int(0.385 * w), int(0.54 * h), int(0.48 * w), int(0.595 * h)
draw.rectangle([ax1, ay1, ax2, ay2], outline=(255, 0, 80), width=5)

# Banner
draw.rectangle([ax1 - 10, ay1 - 45, ax2 + 60, ay1 - 5], fill=(255, 0, 80))

try:
    font_bold = ImageFont.truetype("arialbd.ttf", 16)
except Exception:
    font_bold = ImageFont.load_default()

draw.text((ax1, ay1 - 38), "HAZ CLIC EN LA PESTAÑA 'Anuncios'", fill=(255, 255, 255), font=font_bold)

img.save(out_path)
print("SUCCESS: Imagen 5 guardada en:", out_path)
