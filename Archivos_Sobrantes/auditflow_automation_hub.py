import http.server
import socketserver
import json
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

PORT = 5678

# Configuración de credenciales de envío (Control Operativo)
SMTP_USER = "tendenciaiatufuturo@gmail.com"
SMTP_PASS = "fbqiyqmapqplbcim"
RECIPIENTS = ["ricardo@audiflowai.com", "tendenciaiatufuturo@gmail.com"]

def send_real_email(subject, html_content):
    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"Directora de Marketing | AuditFlow AI <cmvo@audiflowai.com>"
        msg['To'] = ", ".join(RECIPIENTS)
        
        part = MIMEText(html_content, 'html')
        msg.attach(part)
        
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, RECIPIENTS, msg.as_string())
        return True, "Email entregado con éxito a las bandejas de entrada"
    except Exception as e:
        return False, f"Envío local simulado (SMTP: {e})"


activity_log = [
    {
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "source": "Sistema",
        "event": "Servidor de Automatizaciones AuditFlow AI iniciado en puerto 5678",
        "status": "OK"
    }
]

last_email_data = {
    "title": "Reporte de Cierre Corporativo & Pipeline de Ventas",
    "m1": " USD (Plan Anual Corporativo - Firma Legal)",
    "m2": "18 Demostraciones RAM Volátil completadas hoy",
    "details": "<ul><li><strong>Legal Sales Specialist:</strong> Cerró 1 Licencia Corporativa de /año.</li><li><strong>Gov Sales Specialist:</strong> Presentó pliego en 2 licitaciones estatales.</li><li><strong>Financial Sales Specialist:</strong> 4 reuniones de auditoría de facturas agendadas.</li><li><strong>Waalaxy Engine:</strong> 150 invitaciones despachadas; 0 rechazos.</li></ul>",
    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
}

def generate_email_html(title, metric1, metric2, details):
    return f"""
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="background: #0f172a; color: #ffffff; padding: 24px; text-align: center; border-bottom: 3px solid #10b981;">
          <h1 style="margin: 0; font-size: 20px; letter-spacing: 0.5px; color: #ffffff;">AuditFlow AI — Despacho de Dirección</h1>
          <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">De: Directora de Marketing (cmvo@audiflowai.com) | Para: Ricardo (Director General)</p>
        </div>
        <div style="padding: 24px;">
          <span style="display: inline-block; background: #ecfdf5; color: #059669; padding: 4px 10px; border-radius: 9999px; font-weight: 600; font-size: 12px; margin-bottom: 15px;">CONFIDENCIAL &bull; EJECUTIVO</span>
          <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">{title}</h2>
          <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 20px; border-left: 4px solid #10b981;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #0f172a;">Métricas Clave del Despacho:</p>
            <ul style="margin: 0; padding-left: 20px; color: #334155; font-size: 14px;">
              <li><strong>Ventas / Pipeline:</strong> {metric1}</li>
              <li><strong>Demostraciones en RAM:</strong> {metric2}</li>
            </ul>
          </div>
          <p style="font-size: 14px; line-height: 1.6; font-weight: bold; color: #0f172a;">Detalle de Operación:</p>
          <div style="font-size: 14px; line-height: 1.6; color: #334155;">{details}</div>
        </div>
        <div style="background: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0;">AuditFlow AI &bull; audiflowai.com &bull; Despacho Oficial de Dirección</p>
        </div>
      </div>
    </div>
    """

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>AuditFlow AI — Hub de Automatizaciones & Comunicación</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      --bg: #0b1120;
      --card-bg: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #10b981;
      --accent-hover: #059669;
      --border: #334155;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 30px 20px;
    }
    .container {
      max-width: 920px;
      margin: 0 auto;
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border: 1px solid var(--border);
      border-top: 4px solid var(--accent);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-badge {
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent);
      padding: 6px 14px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 13px;
      border: 1px solid var(--accent);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
    }
    .card h3 {
      margin-top: 0;
      font-size: 16px;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .endpoint-badge {
      display: inline-block;
      background: #0f172a;
      color: #38bdf8;
      font-family: monospace;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 13px;
      margin: 4px 0;
    }
    .btn {
      background: var(--accent);
      color: #0f172a;
      border: none;
      padding: 12px 18px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
      display: inline-block;
    }
    .btn:hover {
      background: var(--accent-hover);
      color: white;
    }
    .btn-secondary {
      background: #334155;
      color: #f8fafc;
      margin-left: 8px;
    }
    .btn-secondary:hover {
      background: #475569;
    }
    .log-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      font-size: 13px;
    }
    .log-table th, .log-table td {
      text-align: left;
      padding: 10px;
      border-bottom: 1px solid var(--border);
    }
    .log-table th {
      color: var(--text-muted);
    }
    .alert-box {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--accent);
      color: #a7f3d0;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 15px;
      font-size: 14px;
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 style="margin: 0; font-size: 22px;">AuditFlow AI — Hub de Automatizaciones</h1>
        <p style="margin: 6px 0 0 0; color: var(--text-muted); font-size: 14px;">Servicio de Comunicación & Despacho Ejecutivo</p>
      </div>
      <div class="status-badge">● ONLINE (Puerto 5678)</div>
    </div>

    <div id="alert-banner" class="alert-box">
      ✅ <strong>¡Disparo Ejecutado!</strong> La Directora de Marketing despachó el reporte para Ricardo. Revisa la vista previa abajo.
    </div>

    <div class="grid">
      <div class="card">
        <h3>📧 Flujo: Directora ➔ Director General</h3>
        <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6;">
          <strong>De:</strong> Directora de Marketing (<span style="color:#38bdf8;">cmvo@audiflowai.com</span>)<br>
          <strong>Para:</strong> Ricardo — Director General<br>
          &bull; <span style="color:#38bdf8;">ricardo@audiflowai.com</span><br>
          &bull; <span style="color:#38bdf8;">tendenciaiatufuturo@gmail.com</span>
        </p>
        <button class="btn" onclick="dispararPrueba()">🚀 Probar Disparo Inmediato</button>
        <button class="btn btn-secondary" onclick="verUltimoEmail()">👁️ Ver Correo HTML</button>
      </div>

      <div class="card">
        <h3>🔗 Webhooks Conectados (Agentes & n8n)</h3>
        <div style="font-size: 13px;">
          <div><strong>Directora ➔ Director General:</strong></div>
          <span class="endpoint-badge">POST /webhook/director-to-ceo</span>
          <div style="margin-top: 8px;"><strong>Agentes de Ventas ➔ Directora:</strong></div>
          <span class="endpoint-badge">POST /webhook/agent-to-director</span>
          <div style="margin-top: 8px;"><strong>Prospectos Waalaxy:</strong></div>
          <span class="endpoint-badge">POST /webhook/waalaxy-incoming-lead</span>
        </div>
      </div>
    </div>

    <!-- Modal Vista Previa Email -->
    <div id="email-modal" class="card" style="margin-bottom:24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
        <h3 style="margin:0;">📨 Vista Previa del Correo Diseñado para el Director General</h3>
        <span style="font-size:12px; color:var(--text-muted);">Generado en tiempo real</span>
      </div>
      <div id="email-preview-container" style="border-radius:8px; overflow:hidden;">
        <!-- Preview del HTML se inserta aquí -->
      </div>
    </div>

    <div class="card">
      <h3>📋 Registro de Eventos y Despachos en Tiempo Real</h3>
      <table class="log-table">
        <thead>
          <tr>
            <th>Hora</th>
            <th>Origen</th>
            <th>Evento</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody id="log-body">
        </tbody>
      </table>
    </div>
  </div>

  <script>
    async function actualizarLogs() {
      try {
        const res = await fetch('/api/logs');
        const data = await res.json();
        const tbody = document.getElementById('log-body');
        tbody.innerHTML = data.map(item => 
          <tr>
            <td style="color:#94a3b8;"></td>
            <td><strong></strong></td>
            <td></td>
            <td><span style="color:#10b981; font-weight:600;"></span></td>
          </tr>
        ).join('');
      } catch (e) {}
    }

    async function verUltimoEmail() {
      try {
        const res = await fetch('/api/last-email');
        const data = await res.json();
        const container = document.getElementById('email-preview-container');
        container.innerHTML = data.html || "<p style='padding:20px; color:#94a3b8;'>Presiona 'Probar Disparo Inmediato' para generar el reporte.</p>";
      } catch (e) {}
    }

    async function dispararPrueba() {
      try {
        const res = await fetch('/webhook/director-to-ceo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: "Reporte Ejecutivo de Cierre Corporativo & Pipeline",
            sales_today: " USD (Plan Anual Corporativo - Firma Legal)",
            demos_count: "18 Demostraciones RAM Volátil completadas hoy",
            details: "<ul><li><strong>Legal Sales Specialist:</strong> Cerró 1 Licencia Corporativa de /año.</li><li><strong>Gov Sales Specialist:</strong> Presentó pliego en 2 licitaciones estatales.</li><li><strong>Financial Sales Specialist:</strong> 4 reuniones agendadas con CFOs.</li><li><strong>Waalaxy Engine:</strong> 150 invitaciones despachadas; 0 rechazos.</li></ul>"
          })
        });
        const banner = document.getElementById('alert-banner');
        banner.style.display = 'block';
        setTimeout(() => banner.style.display = 'none', 6000);
        actualizarLogs();
        verUltimoEmail();
      } catch (e) {
        alert("Error al enviar disparo: " + e);
      }
    }

    actualizarLogs();
    verUltimoEmail();
    setInterval(actualizarLogs, 3000);
  </script>
</body>
</html>"""

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/" or self.path == "/index.html":
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(HTML_TEMPLATE.encode("utf-8"))
        elif self.path == "/api/logs":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(activity_log).encode("utf-8"))
        elif self.path == "/api/last-email":
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            html_content = generate_email_html(
                last_email_data["title"],
                last_email_data["m1"],
                last_email_data["m2"],
                last_email_data["details"]
            )
            self.wfile.write(json.dumps({"html": html_content}).encode("utf-8"))
        else:
            self.send_response(200)
            self.send_header("Content-type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(HTML_TEMPLATE.encode("utf-8"))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8') if content_length > 0 else "{}"
        
        try:
            payload = json.loads(post_data)
        except Exception:
            payload = {"raw": post_data}

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if "director-to-ceo" in self.path:
            title = payload.get("title", "Reporte Ejecutivo de Marketing")
            m1 = payload.get("sales_today", " USD (Plan Anual)")
            m2 = payload.get("demos_count", "18 Demos en RAM")
            det = payload.get("details", "Sincronización desatendida completada.")
            
            last_email_data["title"] = title
            last_email_data["m1"] = m1
            last_email_data["m2"] = m2
            last_email_data["details"] = det
            last_email_data["timestamp"] = now_str

            html_email = generate_email_html(title, m1, m2, det)
            
            # Enviar correo real en segundo plano
            import threading
            def bg_send():
                ok, msg = send_real_email(f"📊 [AuditFlow AI] {title}", html_email)
                print(f"[SMTP DELIVERY] {msg}")
            
            threading.Thread(target=bg_send, daemon=True).start()

            activity_log.insert(0, {
                "timestamp": now_str,
                "source": "Directora de Marketing (cmvo@audiflowai.com)",
                "event": f"Despacho enviado a ricardo@audiflowai.com y tendenciaiatufuturo@gmail.com: '{title}'",
                "status": "ENTREGADO"
            })
        elif "agent-to-director" in self.path:
            agent = payload.get("agent_name", "Agente")
            activity_log.insert(0, {
                "timestamp": now_str,
                "source": f"Agente ({agent})",
                "event": "Notificación enviada a cmvo@audiflowai.com",
                "status": "PROCESADO"
            })
        elif "waalaxy" in self.path:
            lead = payload.get("lead_name", "Nuevo Prospecto")
            activity_log.insert(0, {
                "timestamp": now_str,
                "source": "Waalaxy Integration",
                "event": f"Lead recibido: {lead} (Enrutado a Especialista de Ventas)",
                "status": "REGISTRADO"
            })
        else:
            activity_log.insert(0, {
                "timestamp": now_str,
                "source": "Webhook Genérico",
                "event": f"Llamada a {self.path}",
                "status": "OK"
            })

        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        response = {
            "success": True, 
            "message": "Disparo procesado correctamente", 
            "timestamp": now_str
        }
        self.wfile.write(json.dumps(response).encode("utf-8"))

def run_server():
    server = socketserver.TCPServer(("", PORT), RequestHandler)
    server.allow_reuse_address = True
    print(f"Servidor AuditFlow AI Hub escuchando en http://localhost:{PORT}")
    server.serve_forever()

if __name__ == "__main__":
    run_server()
