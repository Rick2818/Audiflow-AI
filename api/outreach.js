import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const adminPassword = req.headers['x-admin-password'] || req.body?.admin_password || req.query?.admin_password;
    const expectedPassword = process.env.ADMIN_PASSWORD || 'AuditFlow2026!';

    if (adminPassword !== expectedPassword) {
      return res.status(401).json({ success: false, error: 'No autorizado. Contraseña de administración incorrecta.' });
    }

    const { prospects, test_mode = false } = req.body || {};

    if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
      return res.status(400).json({ success: false, error: 'Se requiere una lista válida de prospectos en req.body.prospects' });
    }

    const gmailUser = (process.env.GMAIL_USER || 'rick28191@gmail.com').trim();
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'fbqiyqmapqplbcim').replace(/\s+/g, '').trim();

    if (!gmailUser || !gmailPass || gmailUser.includes('tu_correo')) {
      return res.status(500).json({ success: false, error: 'Credenciales de Gmail SMTP no configuradas en el servidor.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass }
    });

    const results = [];

    for (const p of prospects) {
      const { name = 'Ejecutivo', company = 'Empresa B2B', role = 'Director', email, country = 'El Salvador', lang = 'es' } = p;
      if (!email || !email.includes('@')) continue;

      const isEn = lang === 'en' || ['Estados Unidos', 'Inglaterra', 'Dinamarca', 'Noruega', 'Finlandia'].includes(country);

      let subject = `Auditoría preventiva de facturas/contratos para ${company}`;
      let bodyHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; margin-top: 0;">AuditFlow AI — Auditoría de Contratos B2B (${country})</h2>
          <p>Hola <strong>${name}</strong> (${role} en <strong>${company}</strong>):</p>
          <p>Desarrollamos AuditFlow AI para auditar contratos y facturas de proveedores en 8 segundos, detectando sobrecargos y penalizaciones ocultas de entre <strong>$3,500 y $18,000 USD</strong> antes de autorizar pagos.</p>
          <p>Te hemos habilitado un análisis de prueba 100% gratuito para tu equipo en:</p>
          <p style="text-align: center; margin: 20px 0;">
            <a href="https://audiflowai.com/?ref=outreach_${encodeURIComponent(country)}" style="background-color: #10b981; color: #000000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Probar Auditoría Gratuita de ${company}</a>
          </p>
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">AuditFlow AI • Memoria Volátil RAM (0 Almacenamiento en Disco)</p>
        </div>`;

      if (isEn) {
        subject = `Preventive Invoice/Contract Audit for ${company}`;
        bodyHtml = `
          <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981; margin-top: 0;">AuditFlow AI — B2B Contract Audit (${country})</h2>
            <p>Hello <strong>${name}</strong> (${role} at <strong>${company}</strong>):</p>
            <p>We developed AuditFlow AI to audit contracts and vendor invoices in 8 seconds, detecting hidden financial leakages of <strong>$3,500 to $18,000 USD</strong> before payment authorization.</p>
            <p>We have enabled a 100% free test analysis for your team at:</p>
            <p style="text-align: center; margin: 20px 0;">
              <a href="https://audiflowai.com/?ref=outreach_en_${encodeURIComponent(country)}" style="background-color: #10b981; color: #000000; font-weight: bold; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Try Free Audit for ${company}</a>
            </p>
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">AuditFlow AI • Volatile RAM Processing (Zero Disk Storage)</p>
          </div>`;
      }

      if (!test_mode) {
        try {
          const info = await transporter.sendMail({
            from: `"AuditFlow AI Sales" <${gmailUser}>`,
            to: email,
            subject,
            html: bodyHtml
          });
          results.push({ email, name, company, country, status: 'sent', messageId: info.messageId });
        } catch (err) {
          results.push({ email, name, company, country, status: 'error', error: err.message });
        }
      } else {
        results.push({ email, name, company, country, status: 'simulated_test_mode' });
      }
    }

    return res.status(200).json({
      success: true,
      total_processed: results.length,
      test_mode,
      details: results
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
