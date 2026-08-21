import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// 1. DATASETS DE BASE
const firstNamesLatam = [
  'Carlos', 'Elena', 'Roberto', 'Mariana', 'Javier', 'Sofia', 'Mateo', 'Lucia', 'Alejandro', 'Valentina',
  'Diego', 'Camila', 'Fernando', 'Isabella', 'Gabriel', 'Victoria', 'Andrés', 'Valeria', 'Rodrigo', 'Daniela',
  'Gonzalo', 'Natalia', 'Esteban', 'Felipe', 'Catalina', 'Mauricio', 'Lorena', 'Santiago', 'Adriana', 'Ignacio',
  'Paula', 'Ricardo', 'Guillermo', 'Alfonso', 'Claudio', 'Beatriz', 'Raquel', 'Manuel', 'Pablo', 'Joaquín'
];

const lastNamesLatam = [
  'Mendoza', 'Gómez', 'Silva', 'Peralta', 'Vargas', 'Morales', 'Castillo', 'Navarro', 'Ríos', 'Alvarado',
  'Bermúdez', 'Cisneros', 'Delgado', 'Escobar', 'Fuentes', 'Guzmán', 'Herrera', 'Ibáñez', 'Jiménez', 'Lara',
  'Montero', 'Noriega', 'Orellana', 'Paredes', 'Quezada', 'Ramírez', 'Salazar', 'Trejo', 'Urrutia', 'Velasco',
  'Ortega', 'Santana', 'Castañeda', 'Palacios', 'Fuenzalida', 'Montenegro', 'Barrios', 'Carrasco', 'Valdés', 'Rojas'
];

const firstNamesGlobal = [
  'Alexander', 'Charlotte', 'William', 'Amelia', 'Oliver', 'Emma', 'Lucas', 'Sophia', 'Benjamin', 'Mia',
  'Henry', 'Evelyn', 'Sebastian', 'Harper', 'Arthur', 'Grace', 'Chloe', 'Liam', 'Zoe', 'Noah',
  'Lily', 'Mason', 'Hannah', 'Ethan', 'Ella', 'James', 'Aria', 'Thomas', 'Marcus', 'Stefan',
  'Lars', 'Astrid', 'Pierre', 'Isabelle', 'Jean', 'Hans', 'Katrin', 'Mikko', 'Juha', 'Bjørn'
];

const lastNamesGlobal = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor',
  'Moore', 'Jackson', 'Martin', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright',
  'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Carter', 'Mitchell', 'Perez', 'Roberts', 'Turner',
  'Schmidt', 'Mueller', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Hoffmann', 'Schäfer'
];

const companiesLatam = [
  'Alvarado Holdings', 'Bermúdez Capital', 'Cisneros Logistics', 'Delgado Group', 'Escobar Enterprise',
  'Fuentes Industries', 'Guzmán Partners', 'Herrera Trade', 'Mendoza Corp', 'Vargas Retail Group',
  'Constructora Central SV', 'Gómez Logistics MX', 'Castillo Inversiones', 'Navarro Trade Latam', 'Ríos Banking Group',
  'Peralta Builders', 'Morales Assets', 'Silva & Asociados', 'Central American Tech', 'Logística del Pacífico',
  'Grupo Industrial Mexicano', 'Inversiones del Valle', 'Servicios Corporativos GT', 'Agroindustrias del Sur', 'Distribuidora Global SA'
];

const companiesGlobal = [
  'Apex Global Holdings', 'Lombard Capital Partners', 'Vertex Trading Group', 'Nordic Logistics AS', 'Finanze Prova SA',
  'Cloudscale Systems', 'Benelux Ventures BV', 'Helsinki Fintech Group', 'Pacific Corporate Law', 'Summit Advisors Inc',
  'Manhattan Asset Management', 'London Tech Group Plc', 'Bavaria Software AG', 'Paris Innovate SAS', 'Zurich Enterprise AG',
  'Copenhagen SaaS A/S', 'Oslo Energy Partners', 'Vienna Capital Management', 'Geneva Global Trade', 'Frankfurt Holdings AG'
];

const domainsLatam = [
  'alvaradoholdings.sv', 'bermudezcapital.mx', 'cisneroslogistics.co', 'delgadogroup.cl', 'escobarenterprise.pe',
  'fuentesindustries.gt', 'guzmanpartners.cr', 'herreratrade.pa', 'mendozacorp.sv', 'vargasretail.co',
  'constructora.sv', 'gomezlogistics.mx', 'castilloinversiones.com', 'navarrotrade.cl', 'riosbanking.pe',
  'peraltabuilders.gt', 'moralesassets.cr', 'silvacorp.ar', 'centraltech.io', 'pacificlogistics.pa'
];

const domainsGlobal = [
  'apexglobal.co.uk', 'lombardcapital.ch', 'vertextrading.de', 'nordiclogistics.se', 'finanzeprova.it',
  'cloudscale.fr', 'beneluxventures.nl', 'helsinkifintech.fi', 'pacificlawcorp.us', 'summitadvisors.us',
  'manhattanassets.us', 'londontechgroup.co.uk', 'bavariasoftware.de', 'parisinnovate.fr', 'zurichenterprise.ch',
  'copenhagensaas.dk', 'osloenergy.no', 'viennacapital.at', 'genevaglobal.ch', 'frankfurtholdings.de'
];

const countriesLatam = ['El Salvador', 'México', 'Colombia', 'Chile', 'Perú', 'Guatemala', 'Costa Rica', 'Panamá', 'España'];
const countriesGlobal = ['Estados Unidos', 'Inglaterra', 'Alemania', 'Suiza', 'Francia', 'Luxemburgo', 'Dinamarca', 'Noruega', 'Finlandia', 'Austria'];

// 2. GENERADOR 500 DIRECTORES FINANCIEROS (CFOs)
export function generateCfos(count = 500) {
  const list = [];
  for (let i = 1; i <= count; i++) {
    const isLatam = i % 2 === 1;
    const fnList = isLatam ? firstNamesLatam : firstNamesGlobal;
    const lnList = isLatam ? lastNamesLatam : lastNamesGlobal;
    const compList = isLatam ? companiesLatam : companiesGlobal;
    const domList = isLatam ? domainsLatam : domainsGlobal;
    const countryList = isLatam ? countriesLatam : countriesGlobal;

    const fn = fnList[(i * 3) % fnList.length];
    const ln = lnList[(i * 7) % lnList.length];
    const comp = compList[(i * 5) % compList.length];
    const dom = domList[(i * 11) % domList.length];
    const country = countryList[(i * 13) % countryList.length];

    const roleVariants = [
      'Chief Financial Officer (CFO)',
      'VP of Finance & Operations',
      'Director Financiero Corporativo',
      'Head of Corporate Finance',
      'Director de Finanzas y Tesorería'
    ];
    const role = roleVariants[i % roleVariants.length];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@${dom}`;

    list.push({
      email,
      name: `${fn} ${ln}`,
      company: comp,
      role,
      country,
      category: 'CFO',
      tag: '👑 CFO_FINANCE',
      batch: 'cfos_500',
      campaign: 'outreach_cfo_audit_gift'
    });
  }
  return list;
}

// 3. GENERADOR 500 FINANCIAL CONTROLLERS
export function generateControllers(count = 500) {
  const list = [];
  for (let i = 1; i <= count; i++) {
    const isLatam = i % 2 === 0;
    const fnList = isLatam ? firstNamesLatam : firstNamesGlobal;
    const lnList = isLatam ? lastNamesLatam : lastNamesGlobal;
    const compList = isLatam ? companiesLatam : companiesGlobal;
    const domList = isLatam ? domainsLatam : domainsGlobal;
    const countryList = isLatam ? countriesLatam : countriesGlobal;

    const fn = fnList[(i * 2) % fnList.length];
    const ln = lnList[(i * 5) % lnList.length];
    const comp = compList[(i * 4) % compList.length];
    const dom = domList[(i * 9) % domList.length];
    const country = countryList[(i * 17) % countryList.length];

    const roleVariants = [
      'Senior Financial Controller',
      'Contralor Financiero Corporativo',
      'Corporate Controller & Auditor',
      'Gerente de Contraloría y Auditoría Interna',
      'Financial Controlling Manager'
    ];
    const role = roleVariants[i % roleVariants.length];
    const email = `controller.${fn.toLowerCase()}.${ln.toLowerCase()}${i}@${dom}`;

    list.push({
      email,
      name: `${fn} ${ln}`,
      company: comp,
      role,
      country,
      category: 'CONTROLLER',
      tag: '📊 FINANCIAL_CONTROLLER',
      batch: 'controllers_500',
      campaign: 'outreach_controller_leakage_detection'
    });
  }
  return list;
}

// 4. GENERADOR COMPATIBLE CON LOTES
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

// 5. SERVERLESS DISPATCHER HANDLER
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

    // Limitar envío en tiempo real a 20 por lote para respetar límites de SMTP y alta entregabilidad
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
              <p style="margin: 0 0 4px 0; color: #d1d5db; font-size: 14px;">Feel free to reach out directly if you have any questions,</p>
              <p style="margin: 0; font-weight: bold; color: #ffffff; font-size: 15px;">Ricardo</p>
              <p style="margin: 2px 0 0 0; color: #9ca3af; font-size: 13px;">Founder, AuditFlow AI</p>
            </div>
          </div>`;
      }

      if (test_mode) {
        results.push({ email, name, status: 'simulated_success', reason: 'Test Mode: email simulated.' });
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
          results.push({ email, name, status: 'sent' });
        } catch (dispatchErr) {
          results.push({ email, name, status: 'error', error: dispatchErr.message });
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
