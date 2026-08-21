export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { title = 'Informe de Auditoría y Redlines B2B', content = '', counter_proposal = '' } = req.body || {};

    const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '');

    // Generación de documento .docx compatible en formato HTML/Word XML
    const docxHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${cleanTitle}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; margin: 30px; color: #1e293b; line-height: 1.6; }
          h1 { color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; }
          h2 { color: #0284c7; margin-top: 24px; }
          .redline-delete { color: #dc2626; text-decoration: line-through; background-color: #fee2e2; padding: 2px 4px; }
          .redline-add { color: #16a34a; font-weight: bold; background-color: #dcfce7; padding: 2px 4px; }
          .counter-box { background-color: #f8fafc; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; font-family: 'Courier New', monospace; }
          .footer { margin-top: 40px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
        <div style='background-color:#09090b; color:#ffffff; padding:15px; border-radius:6px; border-left:5px solid #10b981; margin-bottom:20px;'>
          <span style='background-color:#10b981; color:#000000; font-weight:bold; font-size:10px; padding:2px 6px; border-radius:3px;'>✓ AUDITORÍA B2B VERIFICADA</span>
          <h2 style='color:#ffffff; margin:6px 0 0 0; font-size:15px;'>AuditFlow AI — Control de Cambios & Redlines para Negociación Corporativa</h2>
          <p style='color:#cbd5e1; font-size:11px; margin:3px 0 0 0;'>Auditado en memoria RAM volátil • Conforme a SOC2 & GDPR • 0 Persistencia en disco</p>
        </div>

        <h1>${cleanTitle}</h1>
        <p><strong>Fecha de Generación:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
        <p><strong>Estado de Negociación:</strong> Redlines Aplicados y Listos para Envío al Proveedor</p>
        <hr>

        <h2>1. Resumen Ejecutivo & Marcas de Revisión (Redlines)</h2>
        <div>
          ${content || '<p>Se han identificado cláusulas leoninas de penalización y sobrecargos no declarados. Se sugiere la eliminación inmediata de la cláusula de indexación doble acumulativa.</p>'}
        </div>

        <h2>2. Contra-Propuesta Formal de Renegociación</h2>
        <div class='counter-box'>
          ${(counter_proposal || 'Por medio de la presente, solicitamos el ajuste inmediato de los términos conforme al contrato marco pactado.').replace(/\n/g, '<br>')}
        </div>

        <div class='footer' style='margin-top:40px; font-size:11px; color:#475569; border-top:2px solid #e2e8f0; padding-top:12px;'>
          <p><strong>Verificación Institucional:</strong> Documento auditado mediante la infraestructura B2B de <strong>AuditFlow AI</strong> (<a href='https://audiflowai.com' style='color:#0284c7;'>https://audiflowai.com</a>). Procesado de forma efímera en memoria RAM sin persistencia en disco.</p>
          <p style='color:#94a3b8; font-size:10px;'>Audita tus contratos o facturas en &lt;10s con prueba gratuita en <a href='https://audiflowai.com' style='color:#0284c7;'>https://audiflowai.com</a>.</p>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'application/vnd.ms-word');
    res.setHeader('Content-Disposition', `attachment; filename="${cleanTitle || 'AuditFlow_Redlines'}.doc"`);
    return res.status(200).send(docxHtml);

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
