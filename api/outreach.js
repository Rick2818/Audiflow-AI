import nodemailer from 'nodemailer';

function generateOutreachProspects(batch = 2) {
  const firstNamesBatch1 = ['Carlos', 'Elena', 'Roberto', 'Mariana', 'Javier', 'Sofia', 'Mateo', 'Lucia', 'Alejandro', 'Valentina', 'Diego', 'Camila', 'Fernando', 'Isabella', 'Gabriel', 'Victoria', 'Alexander', 'Charlotte', 'William', 'Amelia', 'Oliver', 'Emma', 'Lucas', 'Sophia', 'Benjamin', 'Mia', 'Henry', 'Evelyn', 'Sebastian', 'Harper'];
  const lastNamesBatch1 = ['Mendoza', 'Rostova', 'Gómez', 'Silva', 'Peralta', 'Vargas', 'Morales', 'Castillo', 'Navarro', 'Ríos', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzales', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const domainsBatch1 = ['mendozalaw.com', 'constructora.sv', 'gomezlogistics.com', 'vargasretail.co', 'castillocorp.mx', 'navarrotrade.cl', 'riosbanking.pe', 'peraltabuilders.gt', 'moralesinvestments.cr', 'silvaparami.ar', 'techconsulting.io', 'innovatech.es', 'lombardcapital.ch', 'apexglobal.co.uk', 'vertextrading.de', 'nordiclogistics.se', 'finanzeprova.it', 'cloudscale.fr', 'beneluxventures.nl', 'helsinkisystems.fi'];

  const firstNamesBatch2 = ['Andrés', 'Valeria', 'Rodrigo', 'Daniela', 'Gonzalo', 'Natalia', 'Esteban', 'Camila', 'Felipe', 'Catalina', 'Mauricio', 'Lorena', 'Santiago', 'Adriana', 'Ignacio', 'Paula', 'Arthur', 'Grace', 'Lucas', 'Chloe', 'Liam', 'Zoe', 'Noah', 'Lily', 'Mason', 'Hannah', 'Ethan', 'Ella', 'James', 'Aria'];
  const lastNamesBatch2 = ['Alvarado', 'Bermúdez', 'Cisneros', 'Delgado', 'Escobar', 'Fuentes', 'Guzmán', 'Herrera', 'Ibáñez', 'Jiménez', 'Lara', 'Montero', 'Noriega', 'Orellana', 'Paredes', 'Quezada', 'Ramírez', 'Salazar', 'Trejo', 'Urrutia', 'Velasco', 'Walker', 'White', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen'];
  const domainsBatch2 = ['alvaradoholdings.sv', 'bermudezcapital.mx', 'cisneroslogistics.co', 'delgadogroup.cl', 'escobarenterprise.pe', 'fuentesindustries.gt', 'guzmanpartners.cr', 'herreratrade.pa', 'ibanezventures.es', 'monteroglobal.ch', 'apexcorp.co.uk', 'bavariasoftware.de', 'nordicscale.se', 'parisinnovate.fr', 'beneluxcloud.nl', 'helsinkifintech.fi', 'pacificlawcorp.us', 'summitadvisors.us', 'manhattanassets.us', 'londontechgroup.co.uk'];

  const firstNames = batch === 2 ? firstNamesBatch2 : firstNamesBatch1;
  const lastNames = batch === 2 ? lastNamesBatch2 : lastNamesBatch1;
  const domains = batch === 2 ? domainsBatch2 : domainsBatch1;
  const roles = ['CFO & VP of Finance', 'Director Legal B2B', 'Gerente de Compras & Procurement', 'General Counsel', 'Director de Operaciones & Finanzas'];
  const countries = ['El Salvador', 'México', 'Colombia', 'Chile', 'Perú', 'Guatemala', 'Costa Rica', 'España', 'Estados Unidos', 'Inglaterra', 'Suiza', 'Alemania', 'Francia', 'Luxemburgo'];

  const prospects = [];
  for (let i = 1; i <= 500; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3) % lastNames.length];
    const dom = domains[(i * 7) % domains.length];
    const role = roles[i % roles.length];
    const country = countries[i % countries.length];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@${dom}`;
    const company = dom.split('.')[0].toUpperCase();
    prospects.push({
      email,
      name: `${fn} ${ln}`,
      company,
      role,
      country,
      batch: `batch_${batch}`,
      campaign: `outreach_batch${batch}_irresistible_hook`
    });
  }
  return prospects;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const isVercelCron = (req.headers['x-vercel-cron'] === '1' || (req.headers['user-agent'] || '').includes('vercel-cron'));
    const adminPassword = req.headers['x-admin-password'] || body?.admin_password || req.query?.admin_password;
    const expectedPassword = process.env.ADMIN_PASSWORD || 'AuditFlow2026!';

    if (!isVercelCron && adminPassword !== expectedPassword) {
      return res.status(401).json({ success: false, error: 'No autorizado. Contraseña de administración incorrecta.' });
    }

    let { prospects, test_mode = false, batch = 2 } = body;

    if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
      prospects = generateOutreachProspects(batch);
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

      const englishCountries = ['estados unidos', 'eeuu', 'ee.uu.', 'united states', 'us', 'usa', 'inglaterra', 'uk', 'united kingdom', 'england', 'suiza', 'switzerland', 'ch', 'francia', 'france', 'fr', 'luxemburgo', 'luxembourg', 'lu', 'alemania', 'germany', 'de', 'dinamarca', 'denmark', 'dk', 'noruega', 'norway', 'no', 'finlandia', 'finland', 'fi'];
      const isEn = lang === 'en' || englishCountries.some(c => (country || '').toLowerCase().includes(c));

      // HOOK IRRESISTIBLE EN ESPAÑOL
      let subject = `🎁 Análisis preventivo de contratos y facturas para ${company} (100% Gratis)`;
      let bodyHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">AuditFlow AI — Auditoría de Contratos B2B (${country})</h2>
          <p>Hola <strong>${name}</strong> (${role} en <strong>${company}</strong>):</p>
          <p style="line-height: 1.6; color: #e5e7eb;">
            Mi nombre es <strong>Ricardo</strong> y recientemente lancé <strong>AuditFlow AI</strong>, una herramienta de inteligencia artificial que revisa contratos y facturas en <strong>8 segundos</strong> para encontrar cláusulas trampa, penalizaciones ocultas o cobros indebidos de entre <strong>$3,500 y $18,000 USD</strong> antes de autorizar pagos.
          </p>
          <p style="line-height: 1.6; color: #e5e7eb;">
            Queremos regalarte a ti y a tu equipo de <strong>${company}</strong> un <strong>análisis 100% gratis</strong> de cualquier contrato o factura de proveedor que tengas activo para que compruebes en tiempo real qué detecta.
          </p>
          <p style="text-align: center; margin: 25px 0;">
            <a href="https://audiflowai.com/?ref=outreach_gift_${encodeURIComponent(country)}" style="background-color: #10b981; color: #000000; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">🎁 Probar Auditoría Gratuita de ${company}</a>
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #1f2937;">
            <p style="margin: 0 0 4px 0; color: #d1d5db; font-size: 14px;">Quedo a tu total disposición para cualquier consulta,</p>
            <p style="margin: 0; font-weight: bold; color: #ffffff; font-size: 15px;">Ricardo</p>
            <p style="margin: 2px 0 0 0; color: #9ca3af; font-size: 13px;">Fundador, AuditFlow AI</p>
          </div>
          <p style="color: #6b7280; font-size: 11px; text-align: center; margin-top: 25px; margin-bottom: 0;">
            AuditFlow AI • Procesamiento Efímero en Memoria Volátil RAM (0 Almacenamiento en Disco • Cifrado AES-256)
          </p>
        </div>`;

      // HOOK IRRESISTIBLE EN INGLÉS
      if (isEn) {
        subject = `🎁 Free preventive contract & invoice audit for ${company}`;
        bodyHtml = `
          <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">AuditFlow AI — B2B Contract Audit (${country})</h2>
            <p>Hello <strong>${name}</strong> (${role} at <strong>${company}</strong>):</p>
            <p style="line-height: 1.6; color: #e5e7eb;">
              My name is <strong>Ricardo</strong>, and I recently launched <strong>AuditFlow AI</strong>, an AI engine that audits vendor contracts and invoices in <strong>8 seconds</strong> to detect hidden trap clauses, unfair penalties, and billing leakages of <strong>$3,500 to $18,000 USD</strong> before payment approval.
            </p>
            <p style="line-height: 1.6; color: #e5e7eb;">
              I would love to gift your team at <strong>${company}</strong> a <strong>100% free audit</strong> on any active contract or vendor invoice so you can experience firsthand what savings and risks it identifies.
            </p>
            <p style="text-align: center; margin: 25px 0;">
              <a href="https://audiflowai.com/?ref=outreach_gift_en_${encodeURIComponent(country)}" style="background-color: #10b981; color: #000000; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">🎁 Try Free Audit for ${company}</a>
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #1f2937;">
              <p style="margin: 0 0 4px 0; color: #d1d5db; font-size: 14px;">Feel free to reach out directly if you have any questions,</p>
              <p style="margin: 0; font-weight: bold; color: #ffffff; font-size: 15px;">Ricardo</p>
              <p style="margin: 2px 0 0 0; color: #9ca3af; font-size: 13px;">Founder, AuditFlow AI</p>
            </div>
            <p style="color: #6b7280; font-size: 11px; text-align: center; margin-top: 25px; margin-bottom: 0;">
              AuditFlow AI • Volatile RAM Ephemeral Processing (Zero Disk Storage • AES-256 Encryption)
            </p>
          </div>`;
      }

      if (!test_mode) {
        try {
          const info = await transporter.sendMail({
            from: `"Ricardo | AuditFlow AI" <${gmailUser}>`,
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
      batch: batch || 2,
      total_processed: results.length,
      test_mode,
      details: results
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
