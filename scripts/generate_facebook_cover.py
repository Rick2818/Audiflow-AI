from PIL import Image, ImageDraw, ImageFont

# Dimensiones exactas de Facebook Page Cover (1640 x 624 px)
W, H = 1640, 624
img = Image.new('RGB', (W, H), color='#07080a')
draw = ImageDraw.Draw(img)

# 1. Fondo Degradado Suave Obsidian Luxury
for y in range(H):
    factor = y / H
    r = int(5 * (1 - factor) + 16 * factor)
    g = int(6 * (1 - factor) + 14 * factor)
    b = int(9 * (1 - factor) + 12 * factor)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# 2. Resplandor dorado ambiental suave (Golden Glow)
for r in range(160, 0, -2):
    glow_color = (212, 175, 55)
    draw.ellipse([1380 - r, 280 - r, 1380 + r, 280 + r], outline=(glow_color[0], glow_color[1], glow_color[2]), width=1)

# Fuentes
try:
    font_badge = ImageFont.truetype("arialbd.ttf", 16)
    font_title1 = ImageFont.truetype("arialbd.ttf", 38)
    font_title2 = ImageFont.truetype("arialbd.ttf", 38)
    font_sub = ImageFont.truetype("arial.ttf", 22)
    font_pillars = ImageFont.truetype("arialbd.ttf", 19)
    font_footer = ImageFont.truetype("arialbd.ttf", 15)
    font_logo = ImageFont.truetype("arialbd.ttf", 16)
except:
    font_badge = font_title1 = font_title2 = font_sub = font_pillars = font_footer = font_logo = ImageFont.load_default()

# 3. Badge Superior Dorado
badge_x, badge_y = 110, 85
badge_w, badge_h = 490, 40
draw.rounded_rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + badge_h], radius=8, fill="#14120c", outline="#d4af37", width=2)
draw.text((badge_x + 35, badge_y + 10), "LEGALTECH & FINANCIAL DUE DILIGENCE", fill="#d4af37", font=font_badge)

# 4. Titular Principal
draw.text((badge_x, 150), "Due Diligence & Auditoria Juridico-Contable", fill="#ffffff", font=font_title1)
draw.text((badge_x, 205), "en Tiempo Real con IA Fiduciaria", fill="#d4af37", font=font_title2)

# 5. Subtitulo
draw.text((badge_x, 280), "Disenado para Directores Legales, General Counsel, Compliance y CFOs", fill="#c2baa6", font=font_sub)

# 6. Pilares de valor
draw.text((badge_x, 350), "+ Pasivos Ocultos    + Redlines de Contratos    + Cero Alucinaciones", fill="#e8d8ad", font=font_pillars)

# 7. Trust Stamp Footer
draw.text((badge_x, 430), "PRIVACIDAD EN MEMORIA VOLATIL  |  COBERTURA 14 PAISES  |  AUDIFLOWAI.COM", fill="#827a69", font=font_footer)

# 8. Tarjeta del Logo a la Derecha
card_x, card_y = 1240, 85
card_w, card_h = 280, 420
draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=16, fill="#0c0e12", outline="#d4af37", width=2)

# Monograma "A" dentro de la tarjeta
# Pierna Izquierda (Blanca)
left_poly = [
    (card_x + 65, card_y + 280),
    (card_x + 125, card_y + 90),
    (card_x + 155, card_y + 90),
    (card_x + 95, card_y + 280)
]
draw.polygon(left_poly, fill="#ffffff")

# Pierna Derecha (Dorada)
right_poly = [
    (card_x + 120, card_y + 90),
    (card_x + 150, card_y + 90),
    (card_x + 215, card_y + 280),
    (card_x + 185, card_y + 280)
]
draw.polygon(right_poly, fill="#d4af37")

# Barra transversal
draw.rectangle([card_x + 95, card_y + 195, card_x + 185, card_y + 215], fill="#d4af37")

# Texto bajo el logo
draw.text((card_x + 55, card_y + 340), "AUDIFLOWAI.COM", fill="#ffffff", font=font_logo)

# Guardar en las rutas
img.save("c:/Users/Ricardo/Desktop/Audiflow Ai/banner_audiflowai.png", "PNG", quality=100)
img.save("c:/Users/Ricardo/Desktop/Audiflow Ai/banner_facebook_audiflowai.png", "PNG", quality=100)

print("Cover de Facebook renderizado con máxima calidad y sin glifos rotos!")
