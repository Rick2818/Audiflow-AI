import os
from PIL import Image, ImageDraw, ImageFont

img_path = r"C:\Users\Ricardo\.gemini\antigravity\brain\65b9ffc5-c66d-46d2-ac9d-98d0e4640d90\.user_uploaded\media_1788214745422.png"
out_path = r"C:\Users\Ricardo\.gemini\antigravity\brain\65b9ffc5-c66d-46d2-ac9d-98d0e4640d90\instrucciones_pantalla_2.png"

img = Image.open(img_path).convert('RGB')
draw = ImageDraw.Draw(img)
w, h = img.size

# 1. Cancel button / X button on modal
cx1, cy1, cx2, cy2 = int(0.57 * w), int(0.87 * h), int(0.64 * w), int(0.92 * h)
draw.rectangle([cx1, cy1, cx2, cy2], outline=(255, 0, 80), width=5)

# 2. Date filter behind
dx1, dy1, dx2, dy2 = int(0.72 * w), int(0.535 * h), int(0.945 * w), int(0.595 * h)
draw.rectangle([dx1, dy1, dx2, dy2], outline=(0, 200, 255), width=5)

# Banners
draw.rectangle([cx1 - 260, cy1 - 40, cx1 + 10, cy1 - 5], fill=(255, 0, 80))
draw.rectangle([dx1 - 10, dy1 - 45, dx2 + 10, dy1 - 5], fill=(0, 200, 255))

try:
    font_bold = ImageFont.truetype("arialbd.ttf", 17)
except Exception:
    font_bold = ImageFont.load_default()

draw.text((cx1 - 250, cy1 - 35), "1. HAZ CLIC EN 'CANCELAR'", fill=(255, 255, 255), font=font_bold)
draw.text((dx1, dy1 - 40), "2. CAMBIA ESTA FECHA A 'HOY'", fill=(0, 0, 0), font=font_bold)

img.save(out_path)
print("SUCCESS: Imagen 2 guardada en:", out_path)
