# 🏢 CONTEXTO OPERATIVO Y CANAL DE COMUNICACIÓN — AUDITFLOW AI

## 1. Identidad Corporativa y Destinatarios
- **Empresa:** AuditFlow AI (https://audiflowai.com)
- **Director General (CEO):** Ricardo
  - Correo Corporativo: `ricardo@audiflowai.com`
  - Correo Personal de Notificación Inmediata: `rick28191@gmail.com`
- **Gerente General y Director de Operaciones (COO):** `gm@audiflowai.com`
- **Directora de Marketing y Ventas (CMVO):** `cmvo@audiflowai.com`
- **Director Senior de Meta Ads (Facebook & Instagram):** `meta-ads@audiflowai.com`
- **Especialista Senior en Comportamiento del Consumidor & Anti-Fatiga:** `behavior@audiflowai.com`

---

## 2. Credenciales Verificadas de Envío de Correo (SMTP / Gmail)
Utiliza estas credenciales ya probadas y activas para despachar correos electrónicos de forma 100% autónoma y desatendida:

- **Servidor SMTP:** `smtp.gmail.com`
- **Puerto:** `465` (SSL) o `587` (TLS)
- **Usuario Autenticado:** `rick28191@gmail.com`
- **Contraseña de Aplicación (Google App Password):** `humycnvzdtyzmnos`
- **Nombre de Remitente:** `Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>`
- **Destinatarios de todo Reporte/Alerta:** `ricardo@audiflowai.com, rick28191@gmail.com`

---

## 3. Configuración MCP (Google Workspace & Bridge Local)
Archivo `.agents/mcp_config.json`:

```json
{
  "mcpServers": {
    "google-workspace": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-workspace"],
      "env": {
        "GOOGLE_WORKSPACE_CREDENTIALS_FILE": "credentials.json",
        "GOOGLE_WORKSPACE_TOKEN_FILE": "token.json"
      },
      "description": "Servidor MCP para Google Workspace: Envío de correos por Gmail, gestión de prospectos en Google Sheets, reportes en Google Drive y agendamiento en Google Calendar."
    },
    "n8n-automation-bridge": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-n8n"],
      "env": {
        "N8N_API_URL": "http://localhost:5678/api/v1",
        "N8N_API_KEY": "${N8N_API_KEY}"
      },
      "description": "Puente local para orquestar flujos de trabajo, webhooks y cron jobs sin intervención humana."
    }
  }
}
```

---

## 4. Protocolo Obligatorio de Reporte al Director General (Ricardo)
Cada vez que se solicite o se ejecute una rutina de trabajo, la IA debe estructurar el despacho en formato HTML con las siguientes reglas:

1. **Daily Morning Briefing (Lunes a Viernes 8:00 AM):**
   - Asunto: `📊 [AuditFlow AI] Reporte Matutino de Dirección — [Fecha]`
   - Resumen del pipeline activo en los 14 países, demostraciones en RAM volátil realizadas y cotizaciones abiertas.
2. **Weekly Executive Summary (Viernes 5:00 PM):**
   - Asunto: `📈 [AuditFlow AI] Cierre Semanal Financiero & Pipeline — [Fecha]`
   - Balance de ventas ingresadas ($19, $69, $599) y licitaciones de gobierno.
3. **Alertas Inmediatas:**
   - Ante cada venta cerrada ($19 diagnóstico, $69 Plan Pro, $599 Licencia Corporativa Anual) o avance con sector público.

---

## 5. Plantilla HTML Oficial para Correos Ejecutivos

```html
<!DOCTYPE html>
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
      <h3 style="color: #ffffff; font-size: 18px; margin-top: 0;">{{TITULO_DEL_REPORTE}}</h3>
      
      <div style="background: #0f172a; border-radius: 8px; padding: 18px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #10b981; font-size: 14px;">Métricas Clave de Operación:</p>
        <ul style="margin: 0; padding-left: 20px; color: #e2e8f0; font-size: 13px; line-height: 1.8;">
          <li><strong>Ventas / Pipeline:</strong> {{VENTAS_O_PIPELINE}}</li>
          <li><strong>Demostraciones en RAM:</strong> {{DEMOS_COUNT}}</li>
        </ul>
      </div>
      
      <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;"><strong>Detalle del Despacho:</strong></p>
      <div style="font-size: 14px; line-height: 1.6; color: #94a3b8;">{{DETALLES_Y_ACTIVIDADES}}</div>
    </div>
    <div style="background: #0f172a; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155;">
      AuditFlow AI &bull; audiflowai.com &bull; Enrutado a ricardo@audiflowai.com y rick28191@gmail.com
    </div>
  </div>
</body>
</html>
```

---

## 6. Código Python de Despacho Inmediato

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def enviar_reporte_al_ceo(asunto, html_contenido):
    usuario_smtp = "rick28191@gmail.com"
    clave_app = "humycnvzdtyzmnos"
    destinatarios = ["ricardo@audiflowai.com", "rick28191@gmail.com"]

    msg = MIMEMultipart("alternative")
    msg["Subject"] = asunto
    msg["From"] = "Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>"
    msg["To"] = ", ".join(destinatarios)
    msg.attach(MIMEText(html_contenido, "html", "utf-8"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as server:
        server.login(usuario_smtp, clave_app)
        server.sendmail(usuario_smtp, destinatarios, msg.as_string())
    print("Reporte despachado exitosamente a Ricardo.")
```
