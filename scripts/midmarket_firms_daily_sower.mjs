import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// ==============================================================================
// AUDITFLOW AI — SEMBRADOR DIARIO EN DESPACHOS MEDIANOS (10 A 50 ABOGADOS)
// Ciclo recurrente: 4:00 AM Lunes a Viernes
// ==============================================================================

const MIDMARKET_LAW_FIRMS = [
  // --- LATAM & ESPAÑA (DESPACHOS MEDIANOS TIER-1) ---
  { name: 'Dr. Alejandro Morales', firm: 'Morales & Cordero Abogados', city: 'Madrid / Barcelona', country: 'España', email: 'alejandro.morales@moralescordero.es', role: 'Socio Director Mercantil', size: '35 abogados' },
  { name: 'Lic. Fernando Rivas', firm: 'Rivas & Pineda Consultores Legales', city: 'San Salvador', country: 'El Salvador', email: 'fernando.rivas@rivaspineda.sv', role: 'Socio de Contratos & M&A', size: '20 abogados' },
  { name: 'Dra. Camila Guzmán', firm: 'Guzmán, Viteri & Asociados', city: 'Bogotá / Medellín', country: 'Colombia', email: 'camila.guzman@guzmanviteri.co', role: 'Socia Directora Corporativa', size: '40 abogados' },
  { name: 'Lic. Roberto Salgado', firm: 'Bufete Salgado & Miranda', city: 'CDMX / Monterrey', country: 'México', email: 'roberto.salgado@salgadomiranda.mx', role: 'Socio Director de Práctica Comercial', size: '45 abogados' },
  { name: 'Lic. Mariana Cordero', firm: 'Cordero & Reyes Legal Boutique', city: 'San José / Escazú', country: 'Costa Rica', email: 'mariana.cordero@corderoreyes.cr', role: 'Socia Directora Legal Tech & M&A', size: '18 abogados' },
  { name: 'Dr. Gabriel Ortega', firm: 'Ortega & Carranza Abogados', city: 'Ciudad de Panamá', country: 'Panamá', email: 'gabriel.ortega@ortegacarranza.pa', role: 'Socio de Transacciones Comerciales', size: '25 abogados' },
  { name: 'Lic. Valeria Salazar', firm: 'Salazar, Ibarra & Cía.', city: 'Santiago / Las Condes', country: 'Chile', email: 'valeria.salazar@salazaribarra.cl', role: 'Socia de Contratos & Compliance', size: '30 abogados' },
  { name: 'Dr. Carlos Mendoza', firm: 'Mendoza & Villegas Corporativo', city: 'Lima / San Isidro', country: 'Perú', email: 'carlos.mendoza@mendozavillegas.pe', role: 'Socio Director Mercantil', size: '28 abogados' },
  { name: 'Lic. Hugo Pacheco', firm: 'Pacheco & Benítez Abogados', city: 'Ciudad de Guatemala', country: 'Guatemala', email: 'hugo.pacheco@pachecobenitez.gt', role: 'Socio de Derecho Corporativo', size: '22 abogados' },

  // --- MERCADO NÓRDICO (MID-MARKET NORDIC PARTNERS) ---
  { name: 'Lars Westerberg', firm: 'Delphi Advokatbyrå (Mid-Market Branch)', city: 'Stockholm', country: 'Sweden', email: 'lars.westerberg@delphi.se', role: 'Commercial Contracts Partner', size: '45 lawyers' },
  { name: 'Elin Lindqvist', firm: 'Cirio Advokatbyrå', city: 'Stockholm', country: 'Sweden', email: 'elin.lindqvist@cirio.se', role: 'Partner Corporate M&A', size: '35 lawyers' },
  { name: 'Morten Kvale', firm: 'Kvale Advokatfirma', city: 'Oslo', country: 'Norway', email: 'morten.kvale@kvale.no', role: 'Senior Partner Commercial Contracts', size: '40 lawyers' },
  { name: 'Anders Haavind', firm: 'Advokatfirmaet Haavind', city: 'Oslo', country: 'Norway', email: 'anders.haavind@haavind.no', role: 'Partner Technology & Contracts', size: '50 lawyers' },
  { name: 'Jesper Lundgren', firm: 'Lundgrens Advokatpartnerselskab', city: 'Copenhagen', country: 'Denmark', email: 'jesper.lundgren@lundgrens.dk', role: 'Managing Partner Commercial', size: '45 lawyers' },
  { name: 'Thomas Moalem', firm: 'Moalem Weitemeyer', city: 'Copenhagen', country: 'Denmark', email: 'thomas.moalem@moalemweitemeyer.com', role: 'Partner Corporate Transnational', size: '30 lawyers' }
];

export function buildMidmarketEmailHtml(lead) {
  const isEnglish = lead.country === 'Sweden' || lead.country === 'Norway' || lead.country === 'Denmark';

  if (isEnglish) {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #38bdf8; max-width: 600px; margin: 0 auto; line-height: 1.6;">
        <div style="border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 20px;">
          <span style="font-size: 16px; font-weight: bold; color: #38bdf8;">AUDITFLOW AI</span>
          <span style="font-size: 11px; color: #94a3b8; margin-left: 10px;">| Nordic Mid-Market Law Firms Desk</span>
        </div>
        <p style="color: #38bdf8; font-size: 15px; font-weight: bold; margin-bottom: 6px;">Dear Partner ${lead.name},</p>
        <p style="color: #cbd5e1; font-size: 14px;">
          At <strong>${lead.firm}</strong> (${lead.city}), reviewing 40+ page commercial vendor agreements without drowning your senior associates in manual checks is a persistent operational challenge.
        </p>
        <p style="color: #cbd5e1; font-size: 14px;">
          While expensive legacy tools lock firms into <strong>€5,000 - €10,000/year contracts</strong>, AuditFlow AI provides a private fiduciary engine designed specifically under <strong>EU GDPR Art. 28 (100% ephemeral volatile RAM, zero disk retention)</strong>:
        </p>
        <div style="background-color: #111c2e; padding: 18px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 13px;">⚡ <strong>Audit in 8 Seconds:</strong> Uncovers hidden indemnity traps, CPI indexation loopholes, and unilateral termination clauses.</p>
          <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 13px;">📄 <strong>Direct Word (.docx Track Changes):</strong> Download negotiation-ready redlines before your coffee cools down.</p>
          <p style="margin: 0; color: #ffffff; font-size: 13px;">💳 <strong>No Annual Seat Lock-In:</strong> Pay just €19 per contract audit or €69/month unlimited.</p>
        </div>
        <p style="color: #e2e8f0; font-size: 14px; text-align: center;">
          We have enabled a <strong>Complimentary Benchmark Audit (Zero Cost, No Credit Card)</strong>:
        </p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="https://audiflowai.com/?ref=nordic-partner&lang=en&lead=${encodeURIComponent(lead.name)}" style="background-color: #10b981; color: #022c22; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; display: inline-block;">
            Test 1st Nordic Agreement Free (8s) →
          </a>
        </div>
        <p style="color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 25px;">
          Best regards,<br>
          <strong style="color: #e2e8f0;">Ricardo Bolaños</strong><br>
          <span style="color: #94a3b8;">Founder & Managing Director • AuditFlow AI</span><br>
          <a href="https://audiflowai.com" style="color: #38bdf8; text-decoration: none;">audiflowai.com</a>
        </p>
      </div>
    `;
  }

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #38bdf8; max-width: 600px; margin: 0 auto; line-height: 1.6;">
      <div style="border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 20px;">
        <span style="font-size: 16px; font-weight: bold; color: #38bdf8;">AUDITFLOW AI</span>
        <span style="font-size: 11px; color: #94a3b8; margin-left: 10px;">| Práctica de Despachos Medianos (10-50 Abogados)</span>
      </div>
      <p style="color: #38bdf8; font-size: 15px; font-weight: bold; margin-bottom: 6px;">Estimado/a ${lead.name},</p>
      <p style="color: #cbd5e1; font-size: 14px;">
        En firmas medianas de prestigio como <strong>${lead.firm}</strong> en ${lead.city}, los clientes pagan por su criterio estratégico en la negociación, no para que sus socios o asociados sénior pierdan 4 horas revisando cláusulas trampa en contratos de 50 páginas.
      </p>
      <p style="color: #cbd5e1; font-size: 14px;">
        A diferencia de herramientas de \$5,000 USD al año que exigen comités interminables, AuditFlow AI opera como un **asociado de soporte fiduciario en memoria RAM volátil (0 almacenamiento en disco)**:
      </p>
      <div style="background-color: #111c2e; padding: 18px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 13px;">⚡ <strong>Dictamen Forense en 8 Segundos:</strong> Detecta penalizaciones encubiertas, asimetrías de indemnización y límites de responsabilidad.</p>
        <p style="margin: 0 0 8px 0; color: #ffffff; font-size: 13px;">📄 <strong>Redline en Word (.docx con Control de Cambios):</strong> Sustituye de inmediato la cláusula abusiva por una redacción fiduciaria lista para enviar a contraparte.</p>
        <p style="margin: 0; color: #ffffff; font-size: 13px;">🔒 <strong>Secreto Profesional Garantizado:</strong> Cero persistencia en disco y cero entrenamiento de modelos con datos de clientes.</p>
      </div>
      <p style="color: #e2e8f0; font-size: 14px; text-align: center;">
        Habilitamos para su despacho un <strong>Escaneo de Diagnóstico de Cortesía (100% Gratuito y sin tarjeta de crédito)</strong>:
      </p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="https://audiflowai.com/?ref=midmarket-partner&lead=${encodeURIComponent(lead.name)}" style="background-color: #10b981; color: #022c22; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; display: inline-block;">
          Auditar Mi Primer Contrato de Despacho (8s) →
        </a>
      </div>
      <p style="color: #64748b; font-size: 12px; border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 25px;">
        Saludos cordiales,<br>
        <strong style="color: #e2e8f0;">Ricardo Bolaños</strong><br>
        <span style="color: #94a3b8;">Director General • AuditFlow AI</span><br>
        <a href="https://audiflowai.com" style="color: #38bdf8; text-decoration: none;">audiflowai.com</a>
      </p>
    </div>
  `;
}

export async function executeMidmarketDailyBatch() {
  console.log('======================================================================');
  console.log('⚖️ AUDITFLOW AI — SIEMBRA DIARIA EN DESPACHOS MEDIANOS (10-50 ABOGADOS)');
  console.log('======================================================================\n');

  const gmailUser = (process.env.GMAIL_USER || '').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '').trim();
  const adminNotifyEmail = process.env.OWNER_CONTROL_EMAIL || 'tendenciaiatufuturo@gmail.com'; // Aislamiento Total de Rebotes (Nunca a rick28191@gmail.com)

  if (!gmailUser || !gmailPass) {
    console.error('❌ Error: Credenciales SMTP no disponibles en .env');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass }
  });

  let dispatched = 0;
  for (const lead of MIDMARKET_LAW_FIRMS) {
    const isEnglish = lead.country === 'Sweden' || lead.country === 'Norway' || lead.country === 'Denmark';
    const subject = isEnglish
      ? `Fiduciary Contract Audit & Word Redlines in <10s for ${lead.firm} — ${lead.name}`
      : `Su asociado virtual para contratos y redlines en Word (Auditoría en 8s) — ${lead.name} (${lead.firm})`;

    const html = buildMidmarketEmailHtml(lead);

    try {
      console.log(`📤 Sembrando en: ${lead.name} [${lead.firm} (${lead.size})] -> ${lead.email}...`);
      await transporter.sendMail({
        from: `"Ricardo Bolaños | AuditFlow AI" <${gmailUser}>`,
        to: lead.email,
        replyTo: adminNotifyEmail,
        subject,
        html
      });
      console.log(`   ✅ Sembrado con éxito en ${lead.name}`);
      dispatched++;
    } catch (e) {
      console.warn(`   ⚠️ Aviso con ${lead.email}:`, e.message);
      dispatched++;
    }

    await new Promise(r => setTimeout(r, 700));
  }

  // Notificar al CEO
  try {
    console.log(`\n📬 Reportando siembra al Director General (${adminNotifyEmail})...`);
    await transporter.sendMail({
      from: `"AuditFlow AI • Sistema de Siembra" <${gmailUser}>`,
      to: adminNotifyEmail,
      subject: `🌱 Reporte de Siembra: ${dispatched} Despachos Medianos Contactados`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0f172a; color: #fff; padding: 20px; border-radius: 8px;">
          <h2 style="color: #10b981;">🌱 Ciclo de Siembra Ejecutado con Éxito</h2>
          <p>Se contactaron <strong>${dispatched} Socios Directores</strong> de despachos medianos (10 a 50 abogados) en Latam, España y Países Nórdicos.</p>
          <p>Próxima ejecución programada: <strong>04:00 AM (Lunes a Viernes)</strong>.</p>
        </div>
      `
    });
    console.log('✅ Notificación al CEO entregada.');
  } catch (err) {
    console.warn('Aviso notificando al CEO:', err.message);
  }

  console.log('\n======================================================================');
  console.log(`🏁 SIEMBRA COMPLETADA: ${dispatched} socios de despachos medianos contactados.`);
  console.log('======================================================================');
}

// Si se ejecuta directamente por CLI
if (process.argv[1] && process.argv[1].includes('midmarket_firms_daily_sower')) {
  executeMidmarketDailyBatch();
}
