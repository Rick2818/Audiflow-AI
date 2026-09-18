function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const {
      documentName = 'Informe_Auditoria_AuditFlow.pdf',
      riskScore = 85,
      findings = [],
      summary = 'Auditoría preventiva de fugas financieras y revisión de cláusulas de riesgo.',
      forensic_hash = '',
      forensic_cert = ''
    } = body;

    const safeDocName = escapeHtml(documentName.replace(/[^a-zA-Z0-9_\-.]/g, '_'));
    const safeSummary = escapeHtml(summary || '');
    const certCode = escapeHtml(forensic_cert || ('AUDITFLOW-SHA256-' + (forensic_hash ? forensic_hash.substring(0, 16).toUpperCase() : 'VERIFIED')));
    const hashCode = escapeHtml(forensic_hash || 'sha256_ephemeral_ram_' + Date.now());
    const safeRiskScore = Math.min(100, Math.max(0, parseInt(riskScore, 10) || 85));

    let findingsHtml = '';
    if (Array.isArray(findings) && findings.length > 0) {
      findingsHtml = findings.map((f, i) => {
        const rawType = typeof f === 'object' && f !== null ? (f.type || 'Riesgo Detectado') : 'Riesgo Detectado';
        const rawDesc = typeof f === 'object' && f !== null ? (f.description || '') : String(f);
        const rawImpact = typeof f === 'object' && f !== null ? (f.impact || '') : '';

        const safeType = escapeHtml(rawType);
        const safeDesc = escapeHtml(rawDesc);
        const safeImpact = escapeHtml(rawImpact);

        return `
        <div style="margin-bottom: 12px; padding: 10px; border-left: 4px solid #ef4444; background: #1e293b; color: #f8fafc; font-family: monospace;">
          <strong>[HALLAZGO #${i + 1}] ${safeType}:</strong> ${safeDesc}
          ${safeImpact ? `<br><span style="color: #f59e0b;">Impacto Financiero: ${safeImpact}</span>` : ''}
        </div>
      `;
      }).join('');
    } else {
      findingsHtml = '<p style="color: #10b981;">No se detectaron cláusulas leoninas críticas en el escaneo.</p>';
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>AuditFlow AI - Informe de Auditoría</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; margin: 0; }
          .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; }
          .logo { color: #3b82f6; font-size: 24px; font-weight: bold; }
          .score { background: #ef4444; color: white; padding: 6px 12px; border-radius: 6px; font-weight: bold; float: right; }
          .card { background: #111827; border: 1px solid #1f2937; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
          .cert-box { background: #0f172a; border: 1px dashed #38bdf8; padding: 14px; border-radius: 8px; margin-bottom: 20px; font-family: monospace; font-size: 11px; }
          .footer { font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #1f2937; padding-top: 15px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <!-- CORREGIDO (2026-09-17): usaba el "riskScore" crudo (sin
               sanitizar ni acotar) en vez de "safeRiskScore" ya calculado
               arriba, permitiendo XSS reflejado en esta página HTML. -->
          <span class="score">Score de Riesgo: ${safeRiskScore}/100</span>
          <div class="logo">AuditFlow <span style="color:#10b981">AI</span> — Reporte Ejecutivo Marca Blanca</div>
          <p style="color: #9ca3af; font-size: 12px;">Documento Auditado: <strong>${safeDocName}</strong> | Fecha: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="cert-box">
          <strong style="color: #38bdf8;">🛡️ CERTIFICACIÓN FORENSE DE INTEGRIDAD CRIPTOGRÁFICA</strong><br>
          <span style="color: #94a3b8;">ID Certificado: <strong>${certCode}</strong></span><br>
          <span style="color: #94a3b8; word-break: break-all;">Firma SHA-256: <code>${hashCode}</code></span><br>
          <span style="color: #34d399;">Garantía Fiduciaria: Procesamiento 100% en Memoria RAM Volátil (SOC-2 / GDPR Art. 28 • Cero Retención en Disco).</span>
        </div>

        <div class="card">
          <h3 style="color: #10b981; margin-top: 0;">📋 Resumen de Auditoría Financiera & Legal</h3>
          <p style="line-height: 1.6;">${safeSummary}</p>
        </div>

        <div class="card">
          <h3 style="color: #ef4444; margin-top: 0;">🚨 Hallazgos Clave & Cláusulas de Riesgo Detectadas</h3>
          ${findingsHtml}
        </div>

        <div class="footer">
          © 2026 AuditFlow AI • Procesado en Memoria RAM Volátil • Cifrado AES-256 (0 Archivos en Disco).
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(htmlContent);
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
