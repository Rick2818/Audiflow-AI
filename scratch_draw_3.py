import os
from PIL import Image, ImageDraw, ImageFont

img_path = r"C:\Users\Ricardo\.gemini\antigravity\brain\65b9ffc5-c66d-46d2-ac9d-98d0e4640d90\.user_uploaded\media_1788214836813.png"
out_path = r"C:\Users\Ricardo\.gemini\antigravity\brain\65b9ffc5-c66d-46d2-ac9d-98d0e4640d90\instrucciones_pantalla_3.png"

img = Image.open(img_path).convert('RGB')
draw = ImageDraw.Draw(img)
w, h = img.size

# 1. Search filter tag "Audiflow X" and "Borrar" button
bx1, by1, bx2, by2 = int(0.90 * w), int(0.47 * h), int(0.95 * w), int(0.52 * h)
draw.rectangle([bx1, by1, bx2, by2], outline=(255, 0, 80), width=5)

tx1, ty1, tx2, ty2 = int(0.07 * w), int(0.47 * h), int(0.36 * w), int(0.52 * h)
draw.rectangle([tx1, ty1, tx2, ty2], outline=(0, 200, 255), width=5)

# Banners
draw.rectangle([bx1 - 280, by1 - 40, bx1 + 10, by1 - 5], fill=(255, 0, 80))
draw.rectangle([tx1 - 5, ty1 - 40, tx1 + 350, ty1 - 5], fill=(0, 200, 255))

try:
    font_bold = ImageFont.truetype("arialbd.ttf", 16)
except Exception:
    font_bold = ImageFont.load_default()

draw.text((bx1 - 270, by1 - 35), "HAZ CLIC AQUI EN 'Borrar'", fill=(255, 255, 255), font=font_bold)
draw.text((tx1 + 5, ty1 - 35), "O HAZ CLIC EN ESTA (X) PARA QUITAR EL FILTRO", fill=(0, 0, 0), font=font_bold)

img.save(out_path)
print("SUCCESS: Imagen 3 guardada en:", out_path)
