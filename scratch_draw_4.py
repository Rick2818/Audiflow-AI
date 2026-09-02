import os
from PIL import Image, ImageDraw, ImageFont

img_path = r"C:\Users\Ricardo\.gemini\antigravity\brain\65b9ffc5-c66d-46d2-ac9d-98d0e4640d90\.user_uploaded\media_1788214907124.png"
out_path = r"C:\Users\Ricardo\.gemini\antigravity\brain\65b9ffc5-c66d-46d2-ac9d-98d0e4640d90\instrucciones_pantalla_4.png"

img = Image.open(img_path).convert('RGB')
draw = ImageDraw.Draw(img)
w, h = img.size

# 1. "Ver resultados" link
vx1, vy1, vx2, vy2 = int(0.16 * w), int(0.85 * h), int(0.28 * w), int(0.89 * h)
draw.rectangle([vx1, vy1, vx2, vy2], outline=(255, 0, 80), width=5)

# Banner
draw.rectangle([vx1 - 5, vy1 - 45, vx1 + 330, vy1 - 5], fill=(255, 0, 80))

try:
    font_bold = ImageFont.truetype("arialbd.ttf", 17)
except Exception:
    font_bold = ImageFont.load_default()

draw.text((vx1 + 5, vy1 - 40), "HAZ CLIC AQUI EN 'Ver resultados'", fill=(255, 255, 255), font=font_bold)

img.save(out_path)
print("SUCCESS: Imagen 4 guardada en:", out_path)
