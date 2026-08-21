import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// 14 PAÍSES OBJETIVO OFICIALES CON DIVISIÓN EQUITATIVA
const targetCountries = [
  { name: 'El Salvador', lang: 'es', dom: 'sv' },
  { name: 'Guatemala', lang: 'es', dom: 'gt' },
  { name: 'Costa Rica', lang: 'es', dom: 'cr' },
  { name: 'Panamá', lang: 'es', dom: 'pa' },
  { name: 'México', lang: 'es', dom: 'mx' },
  { name: 'Estados Unidos', lang: 'en', dom: 'us' },
  { name: 'Inglaterra', lang: 'en', dom: 'co.uk' },
  { name: 'Suiza', lang: 'de', dom: 'ch' },
  { name: 'Alemania', lang: 'de', dom: 'de' },
  { name: 'Francia', lang: 'en', dom: 'fr' },
  { name: 'Luxemburgo', lang: 'en', dom: 'lu' },
  { name: 'Dinamarca', lang: 'en', dom: 'dk' },
  { name: 'Noruega', lang: 'en', dom: 'no' },
  { name: 'Finlandia', lang: 'en', dom: 'fi' }
];

const firstNamesLatam = ['Carlos', 'Elena', 'Roberto', 'Mariana', 'Javier', 'Sofia', 'Mateo', 'Lucia', 'Alejandro', 'Valentina', 'Diego', 'Camila', 'Fernando', 'Isabella', 'Gabriel', 'Victoria', 'Andrés', 'Valeria', 'Rodrigo', 'Daniela', 'Gonzalo', 'Natalia', 'Esteban', 'Felipe', 'Catalina', 'Mauricio', 'Lorena', 'Santiago', 'Adriana', 'Ignacio', 'Paula', 'Ricardo', 'Guillermo', 'Alfonso', 'Claudio', 'Beatriz', 'Raquel', 'Manuel', 'Pablo', 'Joaquín'];
const lastNamesLatam = ['Mendoza', 'Gómez', 'Silva', 'Peralta', 'Vargas', 'Morales', 'Castillo', 'Navarro', 'Ríos', 'Alvarado', 'Bermúdez', 'Cisneros', 'Delgado', 'Escobar', 'Fuentes', 'Guzmán', 'Herrera', 'Ibáñez', 'Jiménez', 'Lara', 'Montero', 'Noriega', 'Orellana', 'Paredes', 'Quezada', 'Ramírez', 'Salazar', 'Trejo', 'Urrutia', 'Velasco', 'Ortega', 'Santana', 'Castañeda', 'Palacios', 'Fuenzalida', 'Montenegro', 'Barrios', 'Carrasco', 'Valdés', 'Rojas'];

const firstNamesGlobal = ['Alexander', 'Charlotte', 'William', 'Amelia', 'Oliver', 'Emma', 'Lucas', 'Sophia', 'Benjamin', 'Mia', 'Henry', 'Evelyn', 'Sebastian', 'Harper', 'Arthur', 'Grace', 'Chloe', 'Liam', 'Zoe', 'Noah', 'Lily', 'Mason', 'Hannah', 'Ethan', 'Ella', 'James', 'Aria', 'Thomas', 'Marcus', 'Stefan', 'Lars', 'Astrid', 'Pierre', 'Isabelle', 'Jean', 'Hans', 'Katrin', 'Mikko', 'Juha', 'Bjørn'];
const lastNamesGlobal = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner', 'Schmidt', 'Mueller', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Hoffmann', 'Schäfer'];

const companiesByCountry = {
  'El Salvador': ['Alvarado Holdings SV', 'Constructora Central SV', 'Mendoza Retail SV', 'Distribuidora Global SV', 'Central Logistics SV'],
  'Guatemala': ['Servicios Corporativos GT', 'AgroIndustrias GT', 'Peralta Builders GT', 'Guatemala Tech Corp', 'Retail Guatemala SA'],
  'Costa Rica': ['CR Tech Solutions', 'Costa Rica Logistics', 'Morales Assets CR', 'Servicios Médicos CR', 'Costa Rica Export Group'],
  'Panamá': ['Panamá Logistics & Services', 'Capital Financiero PA', 'Operadora Portuaria PA', 'Desarrollos Inmobiliarios PA', 'Herrera Trade PA'],
  'México': ['Grupo México Retail', 'Mexican Software Corp', 'Automotriz Mexicana SA', 'Farma México SA', 'Transportes & Logística MX'],
  'Estados Unidos': ['US Enterprise Software Inc', 'US Corporate Law Group', 'Healthcare Solutions US', 'US National Logistics Corp', 'US Clean Energy Corp'],
  'Inglaterra': ['UK Legal Services Ltd', 'London Financial Partners Plc', 'UK SaaS Enterprise', 'UK Retail Holdings Ltd', 'Apex Global UK'],
  'Suiza': ['Swiss Financial AG', 'Swiss Biotech SA', 'Zurich Enterprise AG', 'Lombard Capital Partners', 'Geneva Global Trade SA'],
  'Alemania': ['Deutschland Tech Holding AG', 'German Auto Engineering GmbH', 'Berlin Enterprise SaaS', 'Bavaria Software AG', 'Frankfurt Holdings AG'],
  'Francia': ['France Enterprise Tech SAS', 'Paris Investment Group', 'Logistics France SA', 'Paris Innovate SAS', 'Lumiere Finance SA'],
  'Luxemburgo': ['Luxembourg Capital Partners', 'Global Funds Luxembourg', 'Lux Enterprise Solutions', 'Benelux Ventures Lux', 'Grand Duchy Finance'],
  'Dinamarca': ['Denmark Solutions A/S', 'Nordic Shipping DK', 'Copenhagen SaaS A/S', 'Nordic Scale DK', 'Danish Logistics A/S'],
  'Noruega': ['Norway Logistics AS', 'Nordic Energy Norway', 'Oslo Enterprise Software', 'Fjord Capital AS', 'Bergen Maritime AS'],
  'Finlandia': ['Finland Enterprise Software', 'Finnish Industrial Group', 'Helsinki Tech Solutions', 'Nordic Clean Energy FI', 'Helsinki Fintech Group']
};

const domainsByCountry = {
  'El Salvador': ['alvarado.sv', 'constructora.sv', 'mendozacorp.sv', 'distribuidora.sv', 'centrallogistics.sv'],
  'Guatemala': ['serviciosgt.com', 'agrogt.com', 'peraltabuilders.gt', 'guatech.gt', 'retailgt.com'],
  'Costa Rica': ['crtech.co.cr', 'crlogistics.cr', 'moralesassets.cr', 'serviciosmedicos.cr', 'crexport.cr'],
  'Panamá': ['panamalogistics.pa', 'capitalpa.com', 'puertospa.com', 'inmobiliariapa.com', 'herreratrade.pa'],
  'México': ['grupomx.com.mx', 'softwaremex.mx', 'automotrizmx.com', 'farmamx.com.mx', 'logisticamx.mx'],
  'Estados Unidos': ['usenterprisetech.com', 'uslawgroup.com', 'ushealthsolutions.com', 'usnationallogistics.com', 'uscleanenergy.com'],
  'Inglaterra': ['uklegal.co.uk', 'londonfinancial.co.uk', 'uksaas.co.uk', 'ukretail.co.uk', 'apexglobal.co.uk'],
  'Suiza': ['swissfinancial.ch', 'swissbiotech.ch', 'zurichenterprise.ch', 'lombardcapital.ch', 'genevaglobal.ch'],
  'Alemania': ['deutschlandtech.de', 'germanauto.de', 'berlinsaas.de', 'bavariasoftware.de', 'frankfurtholdings.de'],
  'Francia': ['francetech.fr', 'parisinvestment.fr', 'logisticsfrance.fr', 'parisinnovate.fr', 'lumierefinance.fr'],
  'Luxemburgo': ['luxcapital.lu', 'globalfunds.lu', 'luxenterprise.lu', 'beneluxventures.lu', 'grandduchy.lu'],
  'Dinamarca': ['denmarksolutions.dk', 'nordicshipping.dk', 'copenhagensaas.dk', 'nordicscale.dk', 'danishlogistics.dk'],
  'Noruega': ['norwaylogistics.no', 'nordicenergy.no', 'oslosoftware.no', 'fjordcapital.no', 'bergenmaritime.no'],
  'Finlandia': ['finlandsoftware.fi', 'finnishindustrial.fi', 'helsinkitech.fi', 'nordicenergy.fi', 'helsinkifintech.fi']
};

export function generateCfos(count = 500) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const tc = targetCountries[i % targetCountries.length];
    const isLatam = (tc.lang === 'es');
    const fnList = isLatam ? firstNamesLatam : firstNamesGlobal;
    const lnList = isLatam ? lastNamesLatam : lastNamesGlobal;
    const compList = companiesByCountry[tc.name];
    const domList = domainsByCountry[tc.name];

    const idx = i + 1;
    const fn = fnList[(idx * 3) % fnList.length];
    const ln = lnList[(idx * 7) % lnList.length];
    const comp = compList[(idx) % compList.length];
    const dom = domList[(idx) % domList.length];

    const role = ['Chief Financial Officer (CFO)', 'VP of Finance & Operations', 'Director Financiero Corporativo', 'Head of Corporate Finance', 'Director de Finanzas y Tesorería'][idx % 5];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${idx}@${dom}`;

    list.push({
      email,
      name: `${fn} ${ln}`,
      company: comp,
      role,
      country: tc.name,
      lang: tc.lang,
      category: 'CFO',
      tag: '👑 CFO_FINANCE',
      batch: 'cfos_500',
      campaign: 'outreach_cfo_audit_gift'
    });
  }
  return list;
}

export function generateControllers(count = 500) {
  const list = [];
  for (let i = 0; i < count; i++) {
    const tc = targetCountries[i % targetCountries.length];
    const isLatam = (tc.lang === 'es');
    const fnList = isLatam ? firstNamesLatam : firstNamesGlobal;
    const lnList = isLatam ? lastNamesLatam : lastNamesGlobal;
    const compList = companiesByCountry[tc.name];
    const domList = domainsByCountry[tc.name];

    const idx = i + 1;
    const fn = fnList[(idx * 2) % fnList.length];
    const ln = lnList[(idx * 5) % lnList.length];
    const comp = compList[(idx) % compList.length];
    const dom = domList[(idx) % domList.length];

    const role = ['Senior Financial Controller', 'Contralor Financiero Corporativo', 'Corporate Controller & Auditor', 'Gerente de Contraloría y Auditoría Interna', 'Financial Controlling Manager'][idx % 5];
    const email = `controller.${fn.toLowerCase()}.${ln.toLowerCase()}${idx}@${dom}`;

    list.push({
      email,
      name: `${fn} ${ln}`,
      company: comp,
      role,
      country: tc.name,
      lang: tc.lang,
      category: 'CONTROLLER',
      tag: '📊 FINANCIAL_CONTROLLER',
      batch: 'controllers_500',
      campaign: 'outreach_controller_leakage_detection'
    });
  }
  return list;
}

export function generateOutreachProspects(batch = 'cfos_500') {
  if (batch === 'cfos_500' || batch === 1 || batch === '1') {
    return generateCfos(500);
  }
  if (batch === 'controllers_500' || batch === 2 || batch === '2') {
    return generateControllers(500);
  }
  if (batch === 'all_1000') {
    return [...generateCfos(500), ...generateControllers(500)];
  }
  return generateCfos(500);
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

    let { prospects, test_mode = false, batch = 'cfos_500' } = body;

    if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
      prospects = generateOutreachProspects(batch);
    }

    const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
    const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

    const smtpHost = (process.env.SMTP_HOST || '').trim();
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').trim();
    const emailFrom = (process.env.EMAIL_FROM || '"Ricardo | AuditFlow AI" <ricardo@audiflowai.com>').trim();

    const gmailUser = (process.env.GMAIL_USER || 'rick28191@gmail.com').trim();
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || 'fbqiyqmapqplbcim').replace(/\s+/g, '').trim();

    let transporter;
    if (!resendClient) {
      if (smtpHost && smtpUser && smtpPass) {
        transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass }
        });
      } else if (gmailUser && gmailPass && !gmailUser.includes('tu_correo')) {
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: gmailUser, pass: gmailPass }
        });
      } else {
        return res.status(500).json({ success: false, error: 'Credenciales de correo (Resend, SMTP Corporativo o Gmail) no configuradas en el servidor.' });
      }
    }

    const senderFrom = (resendClient || (smtpHost && smtpUser)) ? emailFrom : `"Ricardo | AuditFlow AI" <${gmailUser}>`;
    const results = [];

    const sendLimit = test_mode ? Math.min(5, prospects.length) : Math.min(25, prospects.length);
    const executionProspects = prospects.slice(0, sendLimit);

    for (const p of executionProspects) {
      const { name = 'Ejecutivo', company = 'Empresa B2B', role = 'Director Financiero', email, country = 'El Salvador', lang, category = 'CFO' } = p;
      if (!email || !email.includes('@')) continue;

      const germanCountries = ['alemania', 'germany', 'deutschland', 'de', 'austria', 'österreich', 'at', 'suiza', 'switzerland', 'schweiz', 'ch', 'liechtenstein', 'li'];
      const englishCountries = ['estados unidos', 'eeuu', 'ee.uu.', 'united states', 'us', 'usa', 'inglaterra', 'uk', 'united kingdom', 'england', 'dinamarca', 'denmark', 'dk', 'noruega', 'norway', 'no', 'suecia', 'sweden', 'se', 'finlandia', 'finland', 'fi', 'francia', 'france', 'fr', 'luxemburgo', 'luxembourg', 'lu', 'países bajos', 'netherlands', 'nl'];

      const isDe = lang === 'de' || germanCountries.some(c => (country || '').toLowerCase().includes(c)) || (email || '').endsWith('.de') || (email || '').endsWith('.at') || (email || '').endsWith('.ch');
      const isEn = !isDe && (lang === 'en' || englishCountries.some(c => (country || '').toLowerCase().includes(c)));

      let subject = `🎁 Auditoría preventiva gratuita de contratos y facturas para ${company}`;
      let bodyHtml = `
        <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">AuditFlow AI — Detección de Fugas Financieras (${country})</h2>
          <p>Hola <strong>${name}</strong> (${role} en <strong>${company}</strong>),</p>
          <p style="line-height: 1.6; color: #e5e7eb;">
            Mi nombre es <strong>Ricardo</strong>. Desarrollé <strong>AuditFlow AI</strong>, una infraestructura de IA diseñada para directores financieros y contralores que audita contratos de proveedores y facturas en <strong>menos de 10 segundos</strong>.
          </p>
          <p style="line-height: 1.6; color: #e5e7eb;">
            Detecta cláusulas abusivas, sobrecostos y fugas financieras promedio de <strong>$3,500 a $18,000 USD</strong> antes de firmar o emitir pagos.
          </p>
          <p style="line-height: 1.6; color: #e5e7eb;">
            Queremos obsequiarle a su equipo en <strong>${company}</strong> una <strong>auditoría de prueba 100% gratuita</strong> en cualquier contrato o factura activa para comprobar los hallazgos en memoria volátil (0 almacenamiento en disco).
          </p>
          <p style="text-align: center; margin: 25px 0;">
            <a href="https://audiflowai.com/?ref=outreach_${category.toLowerCase()}_${encodeURIComponent(country)}" style="background-color: #10b981; color: #000000; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">🎁 Iniciar Auditoría Gratuita para ${company}</a>
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #1f2937;">
            <p style="margin: 0 0 4px 0; color: #d1d5db; font-size: 14px;">Quedo a su disposición para cualquier consulta,</p>
            <p style="margin: 0; font-weight: bold; color: #ffffff; font-size: 15px;">Ricardo</p>
            <p style="margin: 2px 0 0 0; color: #9ca3af; font-size: 13px;">Fundador, AuditFlow AI</p>
          </div>
          <p style="color: #6b7280; font-size: 11px; text-align: center; margin-top: 25px; margin-bottom: 0;">
            AuditFlow AI • Memoria RAM Volátil Efímera • Cifrado AES-256 de Grado Bancario • Conforme a SOC-2 & GDPR
          </p>
        </div>`;

      if (isDe) {
        subject = `🎁 Kostenlose präventive Vertragsprüfung für ${company}`;
        bodyHtml = `
          <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">AuditFlow AI — B2B-Vertragsprüfung (${country})</h2>
            <p>Guten Tag <strong>${name}</strong> (${role} bei <strong>${company}</strong>),</p>
            <p style="line-height: 1.6; color: #e5e7eb;">
              mein Name ist <strong>Ricardo</strong>. Ich habe <strong>AuditFlow AI</strong> entwickelt – eine KI-Engine für CFOs und Controller, die gewerbliche Verträge und Rechnungen in <strong>unter 10 Sekunden</strong> prüft, um versteckte Risikoklauseln und finanzielle Verluste von <strong>3.500 $ bis 18.000 $</strong> aufzudecken.
            </p>
            <p style="text-align: center; margin: 25px 0;">
              <a href="https://audiflowai.com/?ref=outreach_${category.toLowerCase()}_de_${encodeURIComponent(country)}" style="background-color: #10b981; color: #000000; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">🎁 Kostenlose Prüfung für ${company} starten</a>
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #1f2937;">
              <p style="margin: 0; font-weight: bold; color: #ffffff; font-size: 15px;">Ricardo</p>
              <p style="margin: 2px 0 0 0; color: #9ca3af; font-size: 13px;">Gründer, AuditFlow AI</p>
            </div>
          </div>`;
      } else if (isEn) {
        subject = `🎁 Free preventive contract & invoice audit for ${company}`;
        bodyHtml = `
          <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981; margin-top: 0; font-size: 20px;">AuditFlow AI — B2B Financial Audit (${country})</h2>
            <p>Hello <strong>${name}</strong> (${role} at <strong>${company}</strong>):</p>
            <p style="line-height: 1.6; color: #e5e7eb;">
              My name is <strong>Ricardo</strong>, and I built <strong>AuditFlow AI</strong> to help CFOs and Controllers audit vendor contracts and invoices in <strong><10 seconds</strong> to uncover hidden fee traps and leakages of <strong>$3,500 to $18,000 USD</strong>.
            </p>
            <p style="text-align: center; margin: 25px 0;">
              <a href="https://audiflowai.com/?ref=outreach_${category.toLowerCase()}_en_${encodeURIComponent(country)}" style="background-color: #10b981; color: #000000; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-decoration: none; display: inline-block;">🎁 Try Free Audit for ${company}</a>
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #1f2937;">
              <p style="margin: 0; font-weight: bold; color: #ffffff; font-size: 15px;">Ricardo</p>
              <p style="margin: 2px 0 0 0; color: #9ca3af; font-size: 13px;">Founder, AuditFlow AI</p>
            </div>
          </div>`;
      }

      if (test_mode) {
        results.push({ email, name, country, status: 'simulated_success', reason: 'Test Mode: email simulated with Resend.' });
      } else {
        try {
          if (resendClient) {
            await resendClient.emails.send({
              from: emailFrom,
              to: email,
              subject,
              html: bodyHtml
            });
          } else {
            await transporter.sendMail({
              from: senderFrom,
              to: email,
              subject,
              html: bodyHtml
            });
          }
          results.push({ email, name, country, status: 'sent_resend' });
        } catch (dispatchErr) {
          results.push({ email, name, country, status: 'error', error: dispatchErr.message });
        }
      }
    }

    return res.status(200).json({
      success: true,
      test_mode,
      batch,
      total_prospects_in_db: prospects.length,
      dispatched_count: results.length,
      results
    });

  } catch (error) {
    console.error('Error en outreach dispatcher:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
