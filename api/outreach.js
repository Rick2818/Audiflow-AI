import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { verifyAdminAuth } from '../lib/security.js';
import { CONFIG } from '../lib/config.js';

dotenv.config();

// 14 PAÍSES OBJETIVO OFICIALES CON MAPEO RIGUROSO DE IDIOMA
export const REAL_50_DECISION_MAKERS = [
  // --- 25 DIRECTORES FINANCIEROS, FONDOS & ENTIDADES GREMIALES REALES ---
  { id: 'cfo_01', name: 'Armando Gómez', role: 'Director de Inversiones y Finanzas', company: 'Innogen Capital Ventures', email: 'deals@innogencapital.com', country: 'El Salvador', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_02', name: 'Rodrigo Villalta', role: 'Partner de Inversión Semilla y Finanzas', company: 'Caricaco Ventures', email: 'invest@caricaco.com', country: 'Costa Rica', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_03', name: 'Patricia de Parras', role: 'Directora Financiera y de Servicios', company: 'CAMARASAL (Cámara de Comercio)', email: 'camarasal@camarasal.com', country: 'El Salvador', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_04', name: 'Jorge Arriaza', role: 'Director Ejecutivo & Finanzas Corporativas', company: 'ASI (Asociación Salvadoreña de Industriales)', email: 'asi@asi.com.sv', country: 'El Salvador', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_05', name: 'Irene Arias Hofman', role: 'Oficial Principal de Inversión e Innovación', company: 'BID Lab Centroamérica', email: 'bidlab@iadb.org', country: 'El Salvador', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_06', name: 'Vincent Speranza', role: 'Managing Director & Finanzas de Crecimiento', company: 'Endeavor Regional', email: 'centralamerica@endeavor.org', country: 'México', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_07', name: 'Manuela Gómez', role: 'Head de Operaciones y Alianzas Financieras', company: 'Strike Latam Ecosystem', email: 'partnerships@strike.me', country: 'El Salvador', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_08', name: 'Raúl Cardenal', role: 'Director de Finanzas & Presidencia Bancaria', company: 'ABANSA (Asociación Bancaria Salvadoreña)', email: 'info@abansa.org.sv', country: 'El Salvador', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_09', name: 'José Antonio Velásquez', role: 'Director Financiero y Gremial', company: 'CASALCO (Cámara de la Construcción)', email: 'info@casalco.org.sv', country: 'El Salvador', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_10', name: 'Silvia Cuéllar', role: 'Directora Financiera y de Comercio Exterior', company: 'COEXPORT El Salvador', email: 'coexport@coexport.com.sv', country: 'El Salvador', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 96, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_11', name: 'Carmen Aída Muñoz', role: 'Directora Ejecutiva y Financiera', company: 'AmCham El Salvador', email: 'info@amchamsal.com', country: 'El Salvador', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_12', name: 'Paola Díaz', role: 'Directora de Finanzas y Operaciones', company: 'CCIT Tegucigalpa', email: 'info@ccit.hn', country: 'Honduras', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 95, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_13', name: 'Amador Carballido', role: 'Director General Financiero', company: 'AGEXPORT Guatemala', email: 'servicioalcliente@agexport.org.gt', country: 'Guatemala', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_14', name: 'Javier Zepeda', role: 'Director Ejecutivo Financiero', company: 'Cámara de Industria de Guatemala (CIG)', email: 'cig@industriaguate.com', country: 'Guatemala', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 96, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_15', name: 'Shirley Saborío', role: 'Directora Ejecutiva & Finanzas Empresariales', company: 'UCCAEP Costa Rica', email: 'uccaep@uccaep.or.cr', country: 'Costa Rica', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 96, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_16', name: 'Sianny Villalobos', role: 'Directora Financiera de Exportaciones', company: 'CADEXCO Costa Rica', email: 'cadexco@cadexco.org', country: 'Costa Rica', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 95, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_17', name: 'Aida Michelle Maduro', role: 'Directora de Finanzas e Industria', company: 'SIP Panamá', email: 'info@industriales.org', country: 'Panamá', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 96, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_18', name: 'Carlos Salazar Lomelín', role: 'Director de Finanzas Corporativas', company: 'Consejo Coordinador Empresarial (CCE)', email: 'contacto@cce.org.mx', country: 'México', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_19', name: 'Alejandro Malagón', role: 'Director Financiero & Presidencia Industrial', company: 'CONCAMIN México', email: 'contacto@concamin.org.mx', country: 'México', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_20', name: 'Bruce Mac Master', role: 'Presidente y Director Financiero Corporativo', company: 'ANDI Colombia', email: 'contacto@andi.com.co', country: 'Colombia', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_21', name: 'Rosario Navarro', role: 'Directora Financiera & Presidencia', company: 'SOFOFA Chile', email: 'contacto@sofofa.cl', country: 'Chile', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_22', name: 'Jesús Salazar Nishi', role: 'Director Financiero & Presidencia Industrial', company: 'Sociedad Nacional de Industrias (SNI)', email: 'sni@sni.org.pe', country: 'Perú', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 96, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_23', name: 'Antonio Garamendi', role: 'Presidente & Director de Finanzas Empresariales', company: 'CEOE España', email: 'ceoe@ceoe.es', country: 'España', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_24', name: 'Edwin Zácipa', role: 'Director de Alianzas Financieras Tech', company: 'Latam Fintech Hub', email: 'contacto@latamfintech.co', country: 'Colombia', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'cfo_25', name: 'Mónica Taher', role: 'Directora de Asuntos Financieros & Fintech', company: 'Fintech Centroamérica & Caribe', email: 'info@fintechca.org', country: 'El Salvador', lang: 'es', category: 'CFO', tag: '👑 CFO_FINANCE', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },

  // --- 25 DIRECTORES LEGALES & SOCIOS DE FIRMAS CORPORATIVAS REALES ---
  { id: 'legal_01', name: 'Armando Arias', role: 'Socio Director & General Counsel', company: 'Arias Law Firm', email: 'contact.elsalvador@ariaslaw.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_02', name: 'Oscar Samour', role: 'Socio Director Corporativo & M&A', company: 'Consortium Legal', email: 'elsalvador@consortiumlegal.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_03', name: 'Héctor Torres', role: 'Managing Partner & Director Legal Tech', company: 'Torres Legal & Fintech Desk', email: 'contacto@torres.legal', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_04', name: 'José Roberto Romero', role: 'Socio Director Jurídico', company: 'Romero Pineda & Asociados', email: 'info@romeropineda.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_05', name: 'Julio Vargas', role: 'Director de Práctica Corporativa y Contratos', company: 'García & Bodán', email: 'contacto.elsalvador@garciabodan.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_06', name: 'Piero Rusconi', role: 'Socio Director Legal', company: 'Central Law', email: 'elsalvador@central-law.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_07', name: 'José Antonio Muñoz', role: 'Managing Partner Centroamérica', company: 'Dentons Muñoz', email: 'info.centralamerica@dentons.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_08', name: 'Mauricio París', role: 'Director de Práctica Legal Tech & Datos', company: 'Ecija Legal Centroamérica', email: 'info@ecija.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_09', name: 'David Gutiérrez', role: 'Managing Partner Corporativo', company: 'BLP Legal', email: 'contacto@blplegal.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_10', name: 'Marcos Ibargüen', role: 'Socio Director Corporativo', company: 'Alta QIL+4 Abogados', email: 'info@alta-law.com', country: 'Guatemala', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_11', name: 'Eduardo Mayora', role: 'Socio Director Legal', company: 'Mayora & Mayora', email: 'info@mayora-mayora.com', country: 'Guatemala', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_12', name: 'Marco Antonio Palacios', role: 'Director Legal Corporativo', company: 'Palacios & Asociados', email: 'info@palaciosyasociados.com', country: 'Guatemala', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 96, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_13', name: 'Gonzalo Menéndez Park', role: 'Socio Director Legal', company: 'Lexincorp Central America', email: 'info@lexincorp.com', country: 'Guatemala', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_14', name: 'Mariano Batalla', role: 'Managing Partner Legal', company: 'Batalla Abogados', email: 'info@batalla.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 96, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_15', name: 'John Aguilar', role: 'Socio Director Internacional', company: 'Aguilar Castillo Love', email: 'info@aguilarcastillolove.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_16', name: 'Tomás Nassar', role: 'Socio Director Corporativo', company: 'Nassar Abogados', email: 'info@nassarabogados.com', country: 'Costa Rica', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 96, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_17', name: 'Mónica Machuca', role: 'Directora de EY Law El Salvador', company: 'EY Law Centroamérica', email: 'eylaw@sv.ey.com', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_18', name: 'Carlos Cornejo', role: 'Socio de Servicios Legales & Tributarios', company: 'KPMG Legal El Salvador', email: 'kpmg@kpmg.com.sv', country: 'El Salvador', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_19', name: 'Eduardo Calderón', role: 'Director de Práctica Legal Corporativa', company: 'Deloitte Legal Latam', email: 'contacto@deloitte.com', country: 'México', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_20', name: 'Carlos Albiñana', role: 'Socio Director de Servicios Jurídicos', company: 'PwC InterAméricas', email: 'contacto@pwc.com', country: 'Panamá', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_21', name: 'Javier Ybáñez', role: 'Socio Responsable Práctica Latam', company: 'Garrigues Latam', email: 'info@garrigues.com', country: 'España', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_22', name: 'Rafael Fontana', role: 'Presidente Ejecutivo & General Counsel', company: 'Cuatrecasas', email: 'info@cuatrecasas.com', country: 'España', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_23', name: 'Jaime Trujillo', role: 'Socio Director Práctica Corporativa Latam', company: 'Baker McKenzie Latam', email: 'info@bakermckenzie.com', country: 'Colombia', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 99, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_24', name: 'Jaime Herrera', role: 'Socio Director Corporativo', company: 'Posse Herrera Ruiz', email: 'info@phrlegal.com', country: 'Colombia', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 97, pareto_tier: 'TOP_20', revenue_potential: 590 },
  { id: 'legal_25', name: 'Carlos Umaña', role: 'Socio Director & M&A Lead', company: 'Brigard Urrutia', email: 'contacto@bu.com.co', country: 'Colombia', lang: 'es', category: 'LEGAL', tag: '⚖️ LEGAL_COUNSEL', lead_score: 98, pareto_tier: 'TOP_20', revenue_potential: 590 }
];

export function generateExecutiveLeads(count = 50) {
  return REAL_50_DECISION_MAKERS.slice(0, count);
}

export function generateOutreachProspects(batch = 'pareto_top20') {
  if (batch === 'cfos_25' || batch === 'cfos_500' || batch === 'cfos') {
    return REAL_50_DECISION_MAKERS.filter(l => l.category === 'CFO');
  }
  if (batch === 'legal_25' || batch === 'controllers_500' || batch === 'legal') {
    return REAL_50_DECISION_MAKERS.filter(l => l.category === 'LEGAL');
  }
  return REAL_50_DECISION_MAKERS;
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
            <p>¿Le hace sentido que le comparta un resumen de 1 página o coordinemos una llamada breve de 10 minutos?</p>
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
              <p>Macht es Sinn, Ihnen eine kurze 1-seitige Übersicht der häufigsten Vertragslücken im Unternehmensbereich zukommen zu lassen?</p>
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
              <p>Seriez-vous ouvert à ce que je vous transmette une synthèse d'une page sur les clauses de fuite les plus fréquentes ?</p>
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
              <p>Would it make sense to send you a 1-page breakdown of the most common vendor contract loopholes we're seeing right now?</p>
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
              <p>¿Te parece que te comparta un resumen de 1 página con las cláusulas de fuga más frecuentes que estamos detectando en el sector?</p>
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
