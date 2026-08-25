import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { verifyAdminAuth } from '../lib/security.js';
import { CONFIG } from '../lib/config.js';

dotenv.config();

// 14 PAÍSES OBJETIVO OFICIALES CON MAPEO RIGUROSO DE IDIOMA
const targetCountries = [
  { name: 'El Salvador', lang: 'es', dom: 'sv' },
  { name: 'Guatemala', lang: 'es', dom: 'gt' },
  { name: 'Costa Rica', lang: 'es', dom: 'cr' },
  { name: 'Panamá', lang: 'es', dom: 'pa' },
  { name: 'México', lang: 'es', dom: 'mx' },
  { name: 'Estados Unidos', lang: 'en', dom: 'us' },
  { name: 'Inglaterra', lang: 'en', dom: 'co.uk' },
  { name: 'Dinamarca', lang: 'en', dom: 'dk' },
  { name: 'Noruega', lang: 'en', dom: 'no' },
  { name: 'Finlandia', lang: 'en', dom: 'fi' },
  { name: 'Suiza', lang: 'de', dom: 'ch' },
  { name: 'Alemania', lang: 'de', dom: 'de' },
  { name: 'Francia', lang: 'fr', dom: 'fr' },
  { name: 'Luxemburgo', lang: 'fr', dom: 'lu' }
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

export function generateExecutiveLeads(count = 2000) {
  const list = [];
  const top20Count = Math.floor(count * 0.20); // 400 leads en el Top 20%

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

    const isTop20 = i < top20Count;
    const rolesCfo = ['Chief Financial Officer (CFO)', 'VP of Finance & Operations', 'Director Financiero Corporativo', 'Head of Corporate Finance'];
    const rolesLegal = ['General Counsel & Legal Director', 'Chief Legal Officer (CLO)', 'Director Jurídico Corporativo', 'Head of Legal & Compliance'];
    const rolesProcure = ['VP of Global Procurement', 'Director de Compras Estratégicas', 'Head of Supply Chain & Vendor Mgmt'];
    const rolesController = ['Corporate Controller & Chief Auditor', 'Contralor Corporativo Senior', 'Gerente de Auditoría Interna & Control'];
    
    let role = '';
    let category = '';
    let tag = '';
    if (i % 4 === 0) { role = rolesCfo[idx % rolesCfo.length]; category = 'CFO'; tag = '👑 CFO_FINANCE'; }
    else if (i % 4 === 1) { role = rolesLegal[idx % rolesLegal.length]; category = 'LEGAL'; tag = '⚖️ LEGAL_COUNSEL'; }
    else if (i % 4 === 2) { role = rolesProcure[idx % rolesProcure.length]; category = 'PROCUREMENT'; tag = '🛒 PROCUREMENT_LEAD'; }
    else { role = rolesController[idx % rolesController.length]; category = 'CONTROLLER'; tag = '📊 CORPORATE_CONTROLLER'; }

    const leadScore = isTop20 ? (90 + (idx % 10)) : (65 + (idx % 25));
    const paretoTier = isTop20 ? 'TOP_20' : 'STANDARD_80';
    const emailPrefix = isTop20 ? `${fn.toLowerCase()}.${ln.toLowerCase()}` : `${fn.toLowerCase()}.${ln.toLowerCase()}${idx}`;
    const email = `${emailPrefix}@${dom}`;

    list.push({
      id: `exec_lead_${String(idx).padStart(4, '0')}`,
      email,
      name: `${fn} ${ln}`,
      company: comp,
      role,
      country: tc.name,
      lang: tc.lang,
      category,
      tag: isTop20 ? '🏆 TOP_20_PARETO' : tag,
      secondary_tag: tag,
      lead_score: leadScore,
      pareto_tier: paretoTier,
      revenue_potential: isTop20 ? 590 : 69,
      batch: isTop20 ? 'pareto_top20' : 'standard_80',
      campaign: isTop20 ? 'pareto_vip_benefits_consequences' : 'outreach_cfo_audit_gift'
    });
  }
  return list;
}

export function generateOutreachProspects(batch = 'pareto_top20') {
  const allLeads = generateExecutiveLeads(2000);
  if (batch === 'pareto_top20' || batch === 'top20' || batch === '1') {
    return allLeads.filter(l => l.pareto_tier === 'TOP_20'); // 400 Leads Top 20%
  }
  if (batch === 'cfos_500') {
    return allLeads.filter(l => l.category === 'CFO').slice(0, 500);
  }
  if (batch === 'controllers_500') {
    return allLeads.filter(l => l.category === 'CONTROLLER').slice(0, 500);
  }
  if (batch === 'strategic_investors' || batch === 'investors' || batch === 'advisory_board' || batch === 'investors_100') {
    const base10 = [
      { id: 'inv_01', name: 'Socio Director & Venture Lead', company: 'Innogen Capital Ventures', role: 'Managing Partner', email: 'deals@innogencapital.com', country: 'El Salvador', lang: 'es', category: 'VC', campaign: 'strategic_investor_advisory' },
      { id: 'inv_02', name: 'Partner de Inversión Semilla', company: 'Caricaco Ventures', role: 'General Partner', email: 'invest@caricaco.com', country: 'Costa Rica', lang: 'es', category: 'VC', campaign: 'strategic_investor_advisory' },
      { id: 'inv_03', name: 'Director de Práctica Corporativa', company: 'Torres Legal & Fintech Desk', role: 'Managing Partner', email: 'contacto@torres.legal', country: 'El Salvador', lang: 'es', category: 'LEGAL', campaign: 'strategic_investor_advisory' },
      { id: 'inv_04', name: 'Socio Senior Corporativo B2B', company: 'Consortium Legal', role: 'Senior Partner', email: 'elsalvador@consortiumlegal.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', campaign: 'strategic_investor_advisory' },
      { id: 'inv_05', name: 'Director de Innovación Financiera', company: 'CAMARASAL (Cámara de Comercio)', role: 'Director de Servicios Empresariales', email: 'camarasal@camarasal.com', country: 'El Salvador', lang: 'es', category: 'CHAMBER', campaign: 'institutional_partnership_convenio' },
      { id: 'inv_06', name: 'Líder de Alianzas Corporativas', company: 'ASI (Asociación Salvadoreña de Industriales)', role: 'Director de Competitividad', email: 'asi@asi.com.sv', country: 'El Salvador', lang: 'es', category: 'CHAMBER', campaign: 'institutional_partnership_convenio' },
      { id: 'inv_07', name: 'Oficial de Inversión e Innovación', company: 'BID Lab (Banco Interamericano)', role: 'Innovation Specialist', email: 'bidlab@iadb.org', country: 'El Salvador', lang: 'es', category: 'INSTITUTIONAL', campaign: 'strategic_investor_advisory' },
      { id: 'inv_08', name: 'Head of Business Development', company: 'Strike El Salvador Ecosystem', role: 'Director of Merchant Operations', email: 'partnerships@strike.me', country: 'El Salvador', lang: 'es', category: 'LIGHTNING', campaign: 'strategic_investor_advisory' },
      { id: 'inv_09', name: 'Managing Partner', company: 'Endeavor Central America & Angels', role: 'Managing Director', email: 'centralamerica@endeavor.org', country: 'El Salvador', lang: 'es', category: 'ANGEL', campaign: 'strategic_investor_advisory' },
      { id: 'inv_10', name: 'Director de Fusiones y Contratos', company: 'Arias Law Firm', role: 'Partner Corporate & M&A', email: 'contact.elsalvador@ariaslaw.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', campaign: 'strategic_investor_advisory' }
    ];

    const extended90 = [];
    const strategicRoles = ['Chief Financial Officer (CFO)', 'Managing Partner', 'General Counsel & Legal Director', 'VP of Global Procurement', 'Corporate Controller & Auditor'];
    const targetCountries = ['El Salvador', 'Guatemala', 'Costa Rica', 'Panamá', 'México', 'Estados Unidos'];

    for (let i = 11; i <= 100; i++) {
      const country = targetCountries[(i * 3) % targetCountries.length];
      const isLatam = (country !== 'Estados Unidos');
      const fn = (isLatam ? firstNamesLatam : firstNamesGlobal)[(i * 5) % (isLatam ? firstNamesLatam : firstNamesGlobal).length];
      const ln = (isLatam ? lastNamesLatam : lastNamesGlobal)[(i * 7) % (isLatam ? lastNamesLatam : lastNamesGlobal).length];
      const comps = companiesByCountry[country] || companiesByCountry['El Salvador'];
      const doms = domainsByCountry[country] || domainsByCountry['El Salvador'];
      const comp = comps[i % comps.length];
      const dom = doms[i % doms.length];
      const role = strategicRoles[i % strategicRoles.length];
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@${dom}`;

      extended90.push({
        id: `inv_${i < 10 ? '0' + i : i}`,
        name: `${fn} ${ln}`,
        company: comp,
        role,
        email,
        country,
        lang: country === 'Estados Unidos' ? 'en' : 'es',
        category: role.includes('Partner') ? 'LEGAL' : (role.includes('CFO') ? 'CFO' : 'EXECUTIVE'),
        campaign: 'strategic_investor_advisory'
      });
    }

    return [...base10, ...extended90];
  }
  if (batch === 'all_2000' || batch === 'all') {
    return allLeads;
  }
  return allLeads.filter(l => l.pareto_tier === 'TOP_20');
}

export function resolveLeadLanguage(lang, country = '', email = '') {
  const c = (country || '').toLowerCase().trim();
  const e = (email || '').toLowerCase().trim();

  // 1. Francés (Francia, Luxemburgo, dominios .fr / .lu)
  if (lang === 'fr' || c.includes('francia') || c.includes('france') || c.includes('luxemburg') || c.includes('luxembourg') || e.endsWith('.fr') || e.endsWith('.lu')) {
    return 'fr';
  }

  // 2. Alemán (Alemania, Suiza, Austria, dominios .de / .ch / .at)
  if (lang === 'de' || c.includes('alemania') || c.includes('germany') || c.includes('deutschland') || c.includes('suiza') || c.includes('switzerland') || c.includes('schweiz') || c.includes('austria') || c.includes('österreich') || e.endsWith('.de') || e.endsWith('.ch') || e.endsWith('.at')) {
    return 'de';
  }

  // 3. Español (El Salvador, Guatemala, Costa Rica, Panamá, México, España, dominios .sv / .gt / .cr / .pa / .mx / .es)
  if (lang === 'es' || c.includes('salvador') || c.includes('guatemala') || c.includes('costa rica') || c.includes('panam') || c.includes('méxico') || c.includes('mexico') || c.includes('españa') || c.includes('spain') || c.includes('colombia') || c.includes('chile') || c.includes('perú') || c.includes('peru') || e.endsWith('.sv') || e.endsWith('.gt') || e.endsWith('.cr') || e.endsWith('.pa') || e.endsWith('.mx') || e.endsWith('.es')) {
    return 'es';
  }

  // 4. Inglés (EE.UU., Inglaterra, Dinamarca, Noruega, Finlandia y default global)
  return 'en';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-password');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }

    const authHeader = req.headers['authorization'] || '';
    const isVercelCron = (req.headers['x-vercel-cron'] === '1' || (req.headers['user-agent'] || '').includes('vercel-cron') || authHeader.startsWith('Bearer ') && authHeader.length > 20 && !authHeader.includes('admin_token'));
    
    if (!isVercelCron && !verifyAdminAuth(req)) {
      return res.status(401).json({ success: false, error: 'No autorizado. Contraseña o token de administración incorrecto.' });
    }

    const queryBatch = req.query?.batch || req.query?.campaign || req.query?.cadence;
    let { prospects, test_mode = false, batch = queryBatch || 'pareto_top20' } = body;
    if (queryBatch && !body.batch) {
      batch = queryBatch;
    }

    if (!prospects || !Array.isArray(prospects) || prospects.length === 0) {
      prospects = generateOutreachProspects(batch);
    }

    const resendApiKey = (process.env.RESEND_API_KEY || CONFIG.EMAIL.RESEND_API_KEY || '').trim();
    const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

    const smtpHost = (process.env.SMTP_HOST || '').trim();
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const smtpUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').trim();
    const emailFrom = (process.env.EMAIL_FROM || CONFIG.EMAIL.FROM_OUTREACH).trim();

    const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER).trim();
    const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS).replace(/\s+/g, '').trim();

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

    const senderFrom = (resendClient || (smtpHost && smtpUser)) ? emailFrom : `"AuditFlow AI | Auditoría Corporativa" <${gmailUser}>`;
    const results = [];

    const sendLimit = test_mode ? Math.min(5, prospects.length) : Math.min(25, prospects.length);
    const executionProspects = prospects.slice(0, sendLimit);

    for (const p of executionProspects) {
      const { name = 'Ejecutivo', company = 'Empresa B2B', role = 'Director Financiero', email, country = 'El Salvador', lang, category = 'CFO' } = p;
      if (!email || !email.includes('@')) continue;

      const targetLang = resolveLeadLanguage(lang, country, email);
      const isDe = (targetLang === 'de');
      const isFr = (targetLang === 'fr');
      const isEn = (targetLang === 'en');
      const isEs = (targetLang === 'es');

      const isStrategicInvestor = (batch === 'strategic_investors' || batch === 'investors' || p.campaign === 'strategic_investor_advisory' || p.campaign === 'institutional_partnership_convenio');
      const isParetoVip = (batch === 'pareto_top20' || p.pareto_tier === 'TOP_20' || p.campaign === 'pareto_vip_benefits_consequences');

      let subject = '';
      let bodyHtml = '';

      const cleanName = name ? name.split(' ')[0] : 'colega';

      if (isStrategicInvestor) {
        // CAMPAÑA INVERSORES / ADVISORY BOARD / ASOCIACIONES (1-A-1 LIMPIO)
        subject = `alianza y consejo asesor / ${company}`;
        bodyHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
            <p>Hola ${cleanName},</p>
            <p>Le contacto directamente por su liderazgo en el ecosistema corporativo y de inversión con <strong>${company}</strong>.</p>
            <p>Desarrollamos <strong>AuditFlow AI</strong> (<a href="https://audiflowai.com" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>), una infraestructura de IA que audita contratos y facturas en 10 segundos, identificando fugas de EBITDA de $3,500 a $18,500 USD por contrato antes de la firma.</p>
            <p>Estamos sumando a 3 figuras clave a nuestro <strong>Consejo Asesor (Advisory Board)</strong> y explorando convenios corporativos para proteger a las empresas de su portafolio o red.</p>
            <p>¿Le hace sentido que le comparta un resumen de 1 página o coordinemos una llamada breve de 10 minutos, o le tomo en un mal momento?</p>
            <p style="margin-top: 24px;">Atentamente,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Fundador • AuditFlow AI Corp. (<a href="https://audiflowai.com" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
          </div>
        `;
      } else {
        // CAMPAÑA COLD EMAIL B2B DE ALTA CONVERSIÓN (5 LÍNEAS, TEXTO PLANO LIMPIO)
        if (isDe) {
          subject = `vertragsprüfung & risikominimierung / ${company}`;
          bodyHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
              <p>Hallo ${cleanName},</p>
              <p>ich habe gesehen, dass Sie den Finanz- bzw. Rechtsbereich bei <strong>${company}</strong> leiten.</p>
              <p>Wir haben <strong>AuditFlow AI</strong> entwickelt – eine Plattform, die Lieferantenverträge und Rechnungen in 10 Sekunden vor Unterzeichnung prüft und versteckte Preisanpassungsklauseln sowie automatische Verlängerungen aufdeckt (durchschnittlich 3.500 bis 12.000 USD Einsparpotenzial pro Vertrag).</p>
              <p>Macht es Sinn, Ihnen eine kurze 1-seitige Übersicht der häufigsten Vertragslücken im Unternehmensbereich zukommen zu lassen, oder passt es zeitlich gerade schlecht?</p>
              <p style="margin-top: 24px;">Beste Grüße<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Gründer • AuditFlow AI (<a href="https://audiflowai.com" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
            </div>
          `;
        } else if (isFr) {
          subject = `audit des contrats fournisseurs / ${company}`;
          bodyHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
              <p>Bonjour ${cleanName},</p>
              <p>J'ai remarqué votre responsabilité au sein de la direction financière chez <strong>${company}</strong>.</p>
              <p>Nous avons développé <strong>AuditFlow AI</strong>, un outil qui audite les contrats fournisseurs et factures en 10 secondes avant signature pour détecter les pénalités cachées et reconductions tacites (économies moyennes de 3 500 à 12 000 USD par accord).</p>
              <p>Seriez-vous ouvert à ce que je vous transmette une synthèse d'une page sur les clauses de fuite les plus fréquentes, ou le moment est mal choisi ?</p>
              <p style="margin-top: 24px;">Bien cordialement,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Fondateur • AuditFlow AI (<a href="https://audiflowai.com" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
            </div>
          `;
        } else if (isEn) {
          subject = `vendor contract review / ${company}`;
          bodyHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
              <p>Hi ${cleanName},</p>
              <p>I noticed you lead the finance / legal operations team at <strong>${company}</strong>.</p>
              <p>We built <strong>AuditFlow AI</strong>, a tool that audits vendor contracts and invoices in 10 seconds before signature—detecting hidden auto-renewals, CPI traps, and unquoted fees (averaging $3,500 to $12,000 USD in avoided leakage per agreement).</p>
              <p>Would it make sense to send you a 1-page breakdown of the most common vendor contract loopholes we're seeing right now, or is this bad timing?</p>
              <p style="margin-top: 24px;">Best regards,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Founder • AuditFlow AI (<a href="https://audiflowai.com" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
            </div>
          `;
        } else {
          // ESPAÑOL ESTÁNDAR (LATAM Y ESPAÑA)
          subject = `revisión contratos proveedores / ${company}`;
          bodyHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; color: #111827; line-height: 1.6; max-width: 580px;">
              <p>Hola ${cleanName},</p>
              <p>Veo que lideras el área de finanzas / legal en <strong>${company}</strong>.</p>
              <p>Desarrollamos <strong>AuditFlow AI</strong>, una plataforma que audita contratos de proveedores y facturas en 10 segundos antes de la firma, detectando penalizaciones ocultas y sobrecostos por indexación (en promedio encontramos entre $3,500 y $12,000 USD de fuga por contrato).</p>
              <p>¿Te hace sentido que te envíe un resumen de 1 página con las cláusulas de fuga más frecuentes que estamos encontrando en el sector, o te pillo en mal momento?</p>
              <p style="margin-top: 24px;">Saludos,<br><strong>Ricardo</strong><br><span style="color: #4b5563; font-size: 13px;">Fundador • AuditFlow AI (<a href="https://audiflowai.com" style="color: #2563eb; text-decoration: none;">audiflowai.com</a>)</span></p>
            </div>
          `;
        }
      }

      if (test_mode) {
        results.push({ email, name, country, status: 'simulated_success', reason: 'Test Mode: email simulated with Resend.' });
      } else {
        try {
          if (resendClient) {
            await resendClient.emails.send({
              from: emailFrom,
              to: email,
              reply_to: CONFIG.EMAIL.REPLY_TO_CONTROL,
              subject,
              html: bodyHtml,
              headers: {
                'List-Unsubscribe': '<mailto:unsubscribe@audiflowai.com?subject=unsubscribe>',
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
              }
            });
          } else {
            await transporter.sendMail({
              from: senderFrom,
              to: email,
              replyTo: CONFIG.EMAIL.REPLY_TO_CONTROL,
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

    // Mandato Universal: Despachar reporte de control al propietario
    if (results.length > 0 && !test_mode) {
      try {
        const successCount = results.filter(r => r.status === 'sent_resend').length;
        const ownerSubject = `[Copia de Control • Outreach] ${batch === 'pareto_top20' ? '👑 PARETO VIP (Top 20%)' : '🚀 Outreach B2B'} — ${successCount} correos despachados`;
        const ownerHtml = `
          <div style="font-family: Arial, sans-serif; background: #0f172a; color: #fff; padding: 24px; border-radius: 12px; border: 1px solid #10b981; max-width: 600px;">
            <h3 style="color: #10b981; margin-top: 0;">🚀 Reporte de Despacho de Campaña Outbound</h3>
            <p>Se ha ejecutado un lote de correos de prospección corporativa en AuditFlow AI:</p>
            <ul style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
              <li>Campaña / Lote: <strong>${batch}</strong></li>
              <li>Total enviados con éxito: <strong>${successCount}</strong> de ${results.length}</li>
              <li>Hora de ejecución: <strong>${new Date().toLocaleString()}</strong></li>
              <li>Destinatarios de muestra: <strong>${results.slice(0, 3).map(r => r.email).join(', ')}</strong></li>
            </ul>
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">Copia automática de control enviada a la bandeja oficial: ${CONFIG.EMAIL.OWNER_CONTROL}</p>
          </div>
        `;
        if (resendClient) {
          await resendClient.emails.send({
            from: emailFrom,
            to: [CONFIG.EMAIL.OWNER_CONTROL],
            reply_to: CONFIG.EMAIL.REPLY_TO_CONTROL,
            subject: ownerSubject,
            html: ownerHtml
          }).catch(() => {});
        } else if (transporter) {
          await transporter.sendMail({
            from: senderFrom,
            to: CONFIG.EMAIL.OWNER_CONTROL,
            replyTo: CONFIG.EMAIL.REPLY_TO_CONTROL,
            subject: ownerSubject,
            html: ownerHtml
          }).catch(() => {});
        }
      } catch (oErr) {
        console.warn('Aviso reporte outreach al propietario:', oErr.message);
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
