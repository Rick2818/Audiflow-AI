import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def enviar_reporte_al_ceo(asunto, html_contenido):
    usuario_smtp = "tendenciaiatufuturo@gmail.com"
    clave_app = "fbqiyqmapqplbcim"
    destinatarios = ["ricardo@audiflowai.com", "tendenciaiatufuturo@gmail.com"]

    msg = MIMEMultipart("alternative")
    msg["Subject"] = asunto
    msg["From"] = "Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>"
    msg["To"] = ", ".join(destinatarios)
    msg.attach(MIMEText(html_contenido, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as server:
        server.login(usuario_smtp, clave_app)
        server.sendmail(usuario_smtp, destinatarios, msg.as_string())
    print("Reporte despachado exitosamente a Ricardo (ricardo@audiflowai.com y tendenciaiatufuturo@gmail.com).")

if __name__ == "__main__":
    html_ejemplo = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b1120; color: #f8fafc; padding: 25px; margin: 0;">
  <div style="max-width: 580px; margin: 0 auto; background: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.4);">
    <div style="background: #0f172a; padding: 24px; text-align: center; border-bottom: 3px solid #10b981;">
      <h2 style="color: #ffffff; margin: 0; font-size: 22px;">AuditFlow AI — Despacho de Dirección</h2>
      <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">De: Directora de Marketing (cmvo@audiflowai.com) &bull; Para: Ricardo (Director General)</p>
    </div>
    <div style="padding: 26px;">
      <span style="display: inline-block; background: #064e3b; color: #34d399; border: 1px solid #10b981; padding: 4px 12px; border-radius: 9999px; font-weight: 700; font-size: 12px; margin-bottom: 16px;">CONFIDENCIAL &bull; EJECUTIVO</span>
      <h3 style="color: #ffffff; font-size: 18px; margin-top: 0;">Prueba de Conexión SMTP Exitosa</h3>
      
      <div style="background: #0f172a; border-radius: 8px; padding: 18px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #10b981; font-size: 14px;">Métricas Clave de Operación:</p>
        <ul style="margin: 0; padding-left: 20px; color: #e2e8f0; font-size: 13px; line-height: 1.8;">
          <li><strong>Ventas / Pipeline:</strong> 500 Leads / 21 Aceptadas / 11 Respuestas</li>
          <li><strong>Demostraciones en RAM:</strong> 100% Activo</li>
        </ul>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;"><strong>Detalle del Despacho:</strong></p>
      <div style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
        Este correo confirma que las credenciales SMTP de rick28191@gmail.com están autenticadas y funcionando con éxito para el despacho de reportes a la Dirección General.
      </div>
    </div>
    <div style="background: #0f172a; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155;">
      AuditFlow AI &bull; audiflowai.com &bull; Despacho Oficial de Dirección
    </div>
  </div>
</body>
</html>"""
    enviar_reporte_al_ceo("📊 [AuditFlow AI] Prueba de Conexión SMTP y Plantilla Oficial", html_ejemplo)
