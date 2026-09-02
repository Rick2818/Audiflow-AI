import os
from PIL import Image, ImageDraw, ImageFont

img_path = r"C:\Users\Ricardo\.gemini\antigravity\brain\65b9ffc5-c66d-46d2-ac9d-98d0e4640d90\.user_uploaded\media_1788214589350.png"
out_path = r"C:\Users\Ricardo\.gemini\antigravity\brain\65b9ffc5-c66d-46d2-ac9d-98d0e4640d90\instrucciones_pantalla.png"

img = Image.open(img_path).convert('RGB')
draw = ImageDraw.Draw(img)
w, h = img.size

# Date filter box coordinates
x1, y1, x2, y2 = int(0.69 * w), int(0.535 * h), int(0.955 * w), int(0.595 * h)
draw.rectangle([x1, y1, x2, y2], outline=(255, 0, 80), width=6)

# X close button on 'Crear vista'
cx1, cy1, cx2, cy2 = int(0.91 * w), int(0.60 * h), int(0.93 * w), int(0.64 * h)
draw.rectangle([cx1, cy1, cx2, cy2], outline=(0, 200, 255), width=5)

# Banner 1
draw.rectangle([x1 - 10, y1 - 45, x2 + 10, y1 - 5], fill=(255, 0, 80))
# Banner 2
draw.rectangle([cx1 - 250, cy1 - 5, cx1 - 10, cy1 + 25], fill=(0, 200, 255))

try:
    font_bold = ImageFont.truetype("arialbd.ttf", 18)
    font_small = ImageFont.truetype("arialbd.ttf", 15)
except Exception:
    font_bold = ImageFont.load_default()
    font_small = font_bold

draw.text((x1, y1 - 38), "1. HAZ CLIC AQUI Y ELIGE 'HOY'", fill=(255, 255, 255), font=font_bold)
draw.text((cx1 - 240, cy1 + 2), "2. CIERRA ESTE PANEL (X)", fill=(0, 0, 0), font=font_small)

img.save(out_path)
print("SUCCESS: Imagen guardada en:", out_path)
