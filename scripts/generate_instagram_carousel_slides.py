import os
from PIL import Image, ImageDraw, ImageFont

# Crear directorio de salida
output_dir = "c:/Users/Ricardo/Desktop/Audiflow Ai/instagram_carousel_lanzamiento"
os.makedirs(output_dir, exist_ok=True)

# Dimensiones Instagram Portrait (1080 x 1350 px)
W, H = 1080, 1350

# Fuentes
try:
    f_badge = ImageFont.truetype("arialbd.ttf", 24)
    f_hook = ImageFont.truetype("arialbd.ttf", 52)
    f_title = ImageFont.truetype("arialbd.ttf", 46)
    f_sub = ImageFont.truetype("arial.ttf", 30)
    f_body = ImageFont.truetype("arial.ttf", 32)
    f_body_b = ImageFont.truetype("arialbd.ttf", 34)
    f_card_t = ImageFont.truetype("arialbd.ttf", 32)
    f_card_b = ImageFont.truetype("arial.ttf", 26)
    f_footer = ImageFont.truetype("arialbd.ttf", 24)
except:
    f_badge = f_hook = f_title = f_sub = f_body = f_body_b = f_card_t = f_card_b = f_footer = ImageFont.load_default()

def create_base_canvas(slide_num, total_slides=5):
    img = Image.new('RGB', (W, H), color='#07080a')
    draw = ImageDraw.Draw(img)
    
    # Fondo degradado obsidian
    for y in range(H):
        factor = y / H
        r = int(6 * (1 - factor) + 16 * factor)
        g = int(7 * (1 - factor) + 14 * factor)
        b = int(10 * (1 - factor) + 12 * factor)
        draw.line([(0, y), (W, y)], fill=(r, g, b))
        
    # Header de marca
    draw.text((80, 70), "AUDIFLOW AI", fill="#ffffff", font=f_badge)
    draw.text((W - 140, 70), f"{slide_num}/{total_slides}", fill="#d4af37", font=f_badge)
    draw.line([(80, 115), (W - 80, 115)], fill=(212, 175, 55, 100), width=1)
    
    # Footer de marca
    draw.line([(80, H - 110), (W - 80, H - 110)], fill=(255, 255, 255, 30), width=1)
    draw.text((80, H - 80), "audiflowai.com", fill="#807a6e", font=f_footer)
    draw.text((W - 280, H - 80), "Desliza  ->", fill="#d4af37", font=f_footer)
    
    return img, draw

# ==============================================================================
# SLIDE 1: PORTADA
# ==============================================================================
img1, d1 = create_base_canvas(1)
# Badge
d1.rounded_rectangle([80, 160, 520, 215], radius=8, fill="#14120c", outline="#d4af37", width=2)
d1.text((105, 176), "INFORME FIDUCIARIO 2026", fill="#d4af37", font=f_badge)

# Hook
d1.text((80, 280), "¿Tu empresa pierde\nhasta el 9% de su valor\nen contratos\nmal auditados?", fill="#ffffff", font=f_hook, spacing=18)

# Subtitulo
d1.text((80, 680), "La crisis fiduciaria invisible de 2026\nque CFOs y Directores Legales\nya no pueden ignorar.", fill="#d4af37", font=f_title, spacing=14)

# Tarjeta informativa
d1.rounded_rectangle([80, 880, W - 80, 1180], radius=16, fill="#0d0f14", outline="#333742", width=1)
d1.text((120, 920), "PASIVOS OCULTOS EN CONTRATOS:", fill="#e8d8ad", font=f_body_b)
d1.text((120, 980), "* Penalizaciones automaticas vencidas\n* Indexaciones inflacionarias no aplicadas\n* Sobrecostos en convenios de proveedores", fill="#c2baa6", font=f_body, spacing=16)

img1.save(os.path.join(output_dir, "slide_1_portada.png"))

# ==============================================================================
# SLIDE 2: EL DOLOR INVISIBLE
# ==============================================================================
img2, d2 = create_base_canvas(2)
d2.text((80, 160), "El 83% de las auditorias\nmanuales fallan en detectar:", fill="#ffffff", font=f_title, spacing=14)

# 3 Tarjetas de alerta
cards = [
    ("1. Cláusulas de Indexación Desactualizadas", "Pérdidas acumuladas por desfase cambiario e inflación."),
    ("2. Penalizaciones No Ejecutadas", "Obligaciones contractuales de proveedores jamás cobradas."),
    ("3. Riesgos Fiscales y Pasivos Contingentes", "Exposición regulatoria en auditorías externas y entes estatales.")
]

y_pos = 360
for title, desc in cards:
    d2.rounded_rectangle([80, y_pos, W - 80, y_pos + 180], radius=12, fill="#12141a", outline="#992222", width=2)
    d2.text((110, y_pos + 30), title, fill="#ffffff", font=f_card_t)
    d2.text((110, y_pos + 85), desc, fill="#baa4a4", font=f_card_b)
    y_pos += 220

d2.text((80, 1060), "Revisar contratos con hojas de cálculo\nya no es auditable: es una ruleta fiduciaria.", fill="#d4af37", font=f_body_b)

img2.save(os.path.join(output_dir, "slide_2_dolor.png"))

# ==============================================================================
# SLIDE 3: COMPARATIVA (ANTES VS AUDITFLOW AI)
# ==============================================================================
img3, d3 = create_base_canvas(3)
d3.text((80, 160), "El Quiebre de Paradigma:\nMétodo Antiguo vs. AuditFlow AI", fill="#ffffff", font=f_title, spacing=14)

# Columna Tradicional
d3.rounded_rectangle([80, 340, W - 80, 640], radius=14, fill="#161214", outline="#552222", width=1)
d3.text((110, 370), "METODO TRADICIONAL (MANUAL)", fill="#e66b6b", font=f_card_t)
d3.text((110, 430), "* 3 semanas de revision por muestreo aleatorio\n* Solo cubre el 10% del universo de contratos\n* Alto sesgo humano y riesgo de omision", fill="#c2baa6", font=f_body, spacing=14)

# Columna AuditFlow AI
d3.rounded_rectangle([80, 680, W - 80, 1020], radius=14, fill="#0f171c", outline="#d4af37", width=2)
d3.text((110, 710), "AUDITFLOW AI (MOTOR DETERMINISTA)", fill="#d4af37", font=f_card_t)
d3.text((110, 770), "* 100% de los contratos auditados en segundos\n* Mapeo de pasivos y sobrecostos en tiempo real\n* Cero alucinaciones con trazabilidad fiduciaria", fill="#ffffff", font=f_body, spacing=14)

img3.save(os.path.join(output_dir, "slide_3_comparativa.png"))

# ==============================================================================
# SLIDE 4: FRAMEWORK DE BLINDAJE EN 3 PASOS
# ==============================================================================
img4, d4 = create_base_canvas(4)
d4.text((80, 160), "Cómo blindar tu estructura\ncontractual en 3 pasos:", fill="#ffffff", font=f_title, spacing=14)

steps = [
    ("PASO 1: Ingesta en Memoria Volatil", "Carga contratos y facturas con privacidad de grado bancario."),
    ("PASO 2: Escaneo Fiduciario Instantáneo", "Detección de sobrecostos, penalizaciones y redlines automáticos."),
    ("PASO 3: Reporte Ejecutivo para Junta", "Métricas listas para el CFO, General Counsel y Comité de Auditoría.")
]

y_pos = 350
for title, desc in steps:
    d4.rounded_rectangle([80, y_pos, W - 80, y_pos + 180], radius=12, fill="#0d1117", outline="#d4af37", width=1)
    d4.text((110, y_pos + 30), title, fill="#d4af37", font=f_card_t)
    d4.text((110, y_pos + 85), desc, fill="#e6e8ec", font=f_card_b)
    y_pos += 220

img4.save(os.path.join(output_dir, "slide_4_framework.png"))

# ==============================================================================
# SLIDE 5: LLAMADO A LA ACCIÓN (CTA)
# ==============================================================================
img5, d5 = create_base_canvas(5)
d5.text((80, 160), "¿Listo para eliminar las\nfugas de capital en tus\ncontratos hoy mismo?", fill="#ffffff", font=f_hook, spacing=16)

d5.rounded_rectangle([80, 480, W - 80, 940], radius=16, fill="#0d0f14", outline="#d4af37", width=2)
d5.text((120, 530), "ACCESO EXCLUSIVO DE LANZAMIENTO:", fill="#d4af37", font=f_card_t)
d5.text((120, 600), "1. Comenta 'CONTRATO' abajo\n2. Te enviamos por DM el Diagnostico\n   de Riesgo Fiduciario 2026\n3. Audita tu primer contrato GRATIS", fill="#ffffff", font=f_body_b, spacing=18)

d5.text((120, 830), "👉 O visita: audiflowai.com", fill="#38bdf8", font=f_body_b)

d5.text((80, 1020), "AuditFlow AI — San Salvador & Cobertura en 14 Paises", fill="#8a8373", font=f_footer)

img5.save(os.path.join(output_dir, "slide_5_cta.png"))

print("Todas las 5 diapositivas del carrusel de Instagram fueron generadas exitosamente!")
