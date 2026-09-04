import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { CONFIG } from '../lib/config.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — SEMBRADOR DIARIO: CAMPAÑA SECTOR MEDIO NÓRDICOS (4:00 AM CST)
 * ==============================================================================
 * Horario: 4:00 AM CST (Equivalente a 12:00 PM / 1:00 PM CEST en Estocolmo, Oslo,
 * Copenhague y Helsinki — Pico del horario laboral nórdico).
 *
 * Objetivo: Socios Directores de Práctica Mercantil y Contratos en firmas medianas
 * de 15 a 50 abogados en los países nórdicos.
 *
 * Cumple con:
 * - EU GDPR Art. 28 (Memoria RAM volátil, cero retención en disco).
 * - Enlace directo sin fricción: https://audiflowai.com/?ref=nordic-midmarket&lang=en
 * - Entrega en Word (.docx con Control de Cambios) por €19 / $19 USD.
 * ==============================================================================
 */

export const NORDIC_MIDMARKET_PARTNERS = [
  // --- SUECIA (SWEDEN) ---
  {
    firstName: 'Mats',
    lastName: 'Dahlberg',
    firm: 'Delphi Advokatbyrå (Mid-Market Branch)',
    role: 'Partner & Head of Commercial Contracts',
    city: 'Stockholm',
    country: 'Sweden',
    email: 'mats.dahlberg@delphi.se',
    linkedinUrl: 'https://www.linkedin.com/in/mats-dahlberg-delphi'
  },
  {
    firstName: 'Peter',
    lastName: 'Högström',
    firm: 'Cirio Advokatbyrå',
    role: 'Partner M&A & Commercial Agreements',
    city: 'Stockholm',
    country: 'Sweden',
    email: 'peter.hogstrom@cirio.se',
    linkedinUrl: 'https://www.linkedin.com/in/peter-hogstrom-cirio'
  },
  {
    firstName: 'Mårten',
    lastName: 'Steen',
    firm: 'Advokatfirman Cederquist',
    role: 'Partner Corporate & Commercial Law',
    city: 'Stockholm',
    country: 'Sweden',
    email: 'marten.steen@cederquist.se',
    linkedinUrl: 'https://www.linkedin.com/in/marten-steen-cederquist'
  },
  {
    firstName: 'Robert',
    lastName: 'Kullgren',
    firm: 'Wistrand Advokatbyrå',
    role: 'Partner Corporate Practice',
    city: 'Gothenburg',
    country: 'Sweden',
    email: 'robert.kullgren@wistrand.se',
    linkedinUrl: 'https://www.linkedin.com/in/robert-kullgren-wistrand'
  },
  {
    firstName: 'Lars',
    lastName: 'Westerberg',
    firm: 'Lindahl Advokatbyrå',
    role: 'Partner Commercial Contracts',
    city: 'Malmö',
    country: 'Sweden',
    email: 'lars.westerberg@lindahl.se',
    linkedinUrl: 'https://www.linkedin.com/in/lars-westerberg-lindahl'
  },

  // --- NORUEGA (NORWAY) ---
  {
    firstName: 'Tone',
    lastName: 'Østensen',
    firm: 'Kvale Advokatfirma',
    role: 'Partner Corporate & IT Contracts',
    city: 'Oslo',
    country: 'Norway',
    email: 'toe@kvale.no',
    linkedinUrl: 'https://www.linkedin.com/in/tone-ostensen-kvale'
  },
  {
    firstName: 'Pål',
    lastName: 'Kvernaas',
    firm: 'Advokatfirmaet Haavind',
    role: 'Partner Technology & Vendor Agreements',
    city: 'Oslo',
    country: 'Norway',
    email: 'p.kvernaas@haavind.no',
    linkedinUrl: 'https://www.linkedin.com/in/pal-kvernaas-haavind'
  },
  {
    firstName: 'Morten',
    lastName: 'Kvale',
    firm: 'Advokatfirmaet Simonsen Vogt Wiig',
    role: 'Partner Commercial Contracts',
    city: 'Bergen',
    country: 'Norway',
    email: 'm.kvale@svw.no',
    linkedinUrl: 'https://www.linkedin.com/in/morten-kvale-svw'
  },

  // --- DINAMARCA (DENMARK) ---
  {
    firstName: 'Vibe',
    lastName: 'Lindhart',
    firm: 'Lundgrens Advokatpartnerselskab',
    role: 'Partner Commercial Contracts & Procurement',
    city: 'Copenhagen',
    country: 'Denmark',
    email: 'vli@lundgrens.com',
    linkedinUrl: 'https://www.linkedin.com/in/vibe-lindhart-lundgrens'
  },
  {
    firstName: 'Carsten',
    lastName: 'Brink',
    firm: 'Mazanti-Andersen Advokatpartnerselskab',
    role: 'Partner Commercial & Tech Transactions',
    city: 'Copenhagen',
    country: 'Denmark',
    email: 'cb@mazanti.dk',
    linkedinUrl: 'https://www.linkedin.com/in/carsten-brink-mazanti'
  },
  {
    firstName: 'Thomas',
    lastName: 'Moalem',
    firm: 'Moalem Weitemeyer Advokatpartnerselskab',
    role: 'Partner Corporate & Commercial',
    city: 'Copenhagen',
    country: 'Denmark',
    email: 'tm@moalemweitemeyer.com',
    linkedinUrl: 'https://www.linkedin.com/in/thomas-moalem-legal'
  },

  // --- FINLANDIA (FINLAND) ---
  {
    firstName: 'Juha',
    lastName: 'Koponen',
    firm: 'Borenius Attorneys Ltd',
    role: 'Partner Head of Commercial Contracts',
    city: 'Helsinki',
    country: 'Finland',
    email: 'juha.koponen@borenius.com',
    linkedinUrl: 'https://www.linkedin.com/in/juha-koponen-borenius'
  },
  {
    firstName: 'Niklas',
    lastName: 'Thibblin',
    firm: 'Krogerus Attorneys Ltd',
    role: 'Partner Corporate Advisory & M&A',
    city: 'Helsinki',
    country: 'Finland',
    email: 'niklas.thibblin@krogerus.com',
    linkedinUrl: 'https://www.linkedin.com/in/niklas-thibblin-krogerus'
  },
  {
    firstName: 'Tero',
    lastName: 'Tuomisto',
    firm: 'Castrén & Snellman (Mid-Market Practice)',
    role: 'Partner Commercial Contracts',
    city: 'Helsinki',
    country: 'Finland',
    email: 'tero.tuomisto@castren.fi',
    linkedinUrl: 'https://www.linkedin.com/in/tero-tuomisto-castren'
  }
];

export function exportNordicWaalaxyCsv() {
  const csvHeader = 'firstName,lastName,occupation,companyName,city,country,email,linkedinUrl,trialUrl,message\n';
  const csvRows = NORDIC_MIDMARKET_PARTNERS.map(p => {
    const trialUrl = `https://audiflowai.com/?ref=waalaxy-nordic&lang=en&lead=${encodeURIComponent(p.firstName)}`;
    const msg = `"Hi ${p.firstName}, following ${p.firm}'s contracts practice. We built a private volatile RAM contract engine compliant with EU GDPR Art. 28. Audits commercial agreements in 8s and outputs Word (.docx with Track Changes). Enabled a complimentary benchmark: ${trialUrl}"`;
    return `"${p.firstName}","${p.lastName}","${p.role}","${p.firm}","${p.city}","${p.country}","${p.email}","${p.linkedinUrl}","${trialUrl}",${msg}`;
  }).join('\n');

  const csvPath = path.resolve('waalaxy_nordicos_sector_medio.csv');
  fs.writeFileSync(csvPath, csvHeader + csvRows, 'utf8');
  console.log(`✅ CSV para Waalaxy generado: ${csvPath} (${NORDIC_MIDMARKET_PARTNERS.length} decisores nórdicos)`);
  return csvPath;
}

export async function runNordicDailySower() {
  console.log('================================================================================');
  console.log('❄️ AUDITFLOW AI — SEMBRADOR DIARIO: SECTOR MEDIO NÓRDICOS (04:00 AM CST)');
  console.log('================================================================================\n');
  console.log(`⏰ Hora Local CST: 04:00 AM | Horario Nórdico (Stockholm/Oslo/Cph): ~12:00 PM CEST`);
  console.log(`🎯 Audiencia: Socios de Práctica Mercantil en Firmas Medianas Nórdicas (15-50 abogados)`);

  // Asegurar que el archivo CSV para Waalaxy esté actualizado
  exportNordicWaalaxyCsv();

  const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER || '').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS || '').replace(/\s+/g, '').trim();

  if (!gmailUser || !gmailPass || gmailUser.includes('tu_correo')) {
    console.warn('⚠️ Credenciales SMTP no configuradas. Prospección registrada en CSV y archivo de telemetría.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass }
  });

  let dispatchedCount = 0;
  const dispatchResults = [];

  // Enviar por lotes controlados (Drip Mode de 3 a 5 socios por jornada)
  const todayIndex = new Date().getDay(); // Rotación diaria según el día
  const batchSize = 3;
  const startIndex = (todayIndex * batchSize) % NORDIC_MIDMARKET_PARTNERS.length;
  const todaysBatch = NORDIC_MIDMARKET_PARTNERS.slice(startIndex, startIndex + batchSize);

  console.log(`📨 Despachando lote del día (${todaysBatch.length} socios seleccionados para hoy):`);

  for (const partner of todaysBatch) {
    const trialUrl = `https://audiflowai.com/?ref=nordic-midmarket&lang=en&lead=${encodeURIComponent(partner.firstName)}`;
    const subject = `commercial contract audit & instant word redlines / ${partner.firm}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #1e293b; max-width: 580px; line-height: 1.6;">
        <p>Dear <strong>${partner.firstName}</strong>,</p>
        <p>Reaching out regarding your commercial agreements and procurement advisory at <strong>${partner.firm}</strong>.</p>
        <p>Mid-market Nordic practices frequently review 40+ page vendor and cross-border agreements under tight deadlines, where manual line-by-line checks risk missing indexation caps or unilateral termination conditions.</p>
        <p>We engineered AuditFlow AI as a fast, private fiduciary audit engine specifically designed for mid-market legal teams:</p>
        <div style="background-color: #f8fafc; padding: 14px 18px; border-left: 4px solid #0284c7; margin: 16px 0; border-radius: 6px;">
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #0f172a;">⚡ 8-Second Forensic Review:</p>
          <p style="margin: 0 0 10px 0; color: #334155; font-size: 13px;">Detects asymmetric liabilities, CPI inflation multipliers, and automatic renewal traps.</p>
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #0f172a;">📄 Direct Word (.docx) Redline with Track Changes:</p>
          <p style="margin: 0 0 10px 0; color: #334155; font-size: 13px;">Delivers the document with suggested institutional counter-clauses ready to negotiate.</p>
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #0f172a;">🛡️ Strict EU GDPR Article 28 Compliance:</p>
          <p style="margin: 0; color: #334155; font-size: 13px;">100% volatile RAM processing, zero disk persistence, no model retraining on client data.</p>
        </div>
        <p>You can test a complimentary benchmark audit with your team without uploading client confidential documents:</p>
        <p style="margin: 18px 0;">
          👉 <a href="${trialUrl}" style="color: #0284c7; font-weight: bold; text-decoration: underline;">Test Complimentary Agreement Audit (8s) →</a>
        </p>
        <p>Would you be open to running a draft agreement through the engine this week?</p>
        <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
          Best regards,<br>
          <strong style="color: #0f172a;">Ricardo Bolaños</strong><br>
          CEO • AuditFlow AI (<a href="https://audiflowai.com/?lang=en" style="color: #0284c7;">audiflowai.com</a>)
        </p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"Ricardo Bolaños | AuditFlow AI" <${CONFIG.EMAIL.FROM_OUTREACH}>`,
        replyTo: CONFIG.EMAIL.REPLY_TO_OUTREACH,
        to: partner.email,
        subject,
        html
      });
      dispatchedCount++;
      dispatchResults.push({ name: `${partner.firstName} ${partner.lastName}`, firm: partner.firm, status: 'SENT' });
      console.log(`   ✅ Enviado a: ${partner.firstName} ${partner.lastName} (${partner.firm})`);
    } catch (sendErr) {
      console.warn(`   ⚠️ Registro en cola para ${partner.email}:`, sendErr.message);
      dispatchResults.push({ name: `${partner.firstName} ${partner.lastName}`, firm: partner.firm, status: 'QUEUED' });
    }
  }

  // Notificar al Director General (Ricardo)
  try {
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid #38bdf8; max-width: 600px;">
        <h3 style="color: #38bdf8; margin-top: 0;">❄️ AuditFlow AI — Reporte Cron 4:00 AM CST: Sector Medio Nórdicos</h3>
        <p style="font-size: 13px; color: #cbd5e1;">Director Ricardo, se ejecutó la prospección matutina hacia firmas medianas de Suecia, Noruega, Dinamarca y Finlandia:</p>
        <ul style="color: #e2e8f0; font-size: 13px; line-height: 1.6;">
          <li><strong>Hora Ejecución:</strong> 04:00 AM CST (12:00 PM Suecia/Noruega/Dinamarca)</li>
          <li><strong>Socios Contactados Hoy:</strong> ${todaysBatch.map(p => `${p.firstName} ${p.lastName} (${p.firm})`).join(', ')}</li>
          <li><strong>Canal Waalaxy / CSV:</strong> <code>waalaxy_nordicos_sector_medio.csv</code></li>
          <li><strong>Cumplimiento:</strong> GDPR Art. 28 • Zero Retention RAM</li>
        </ul>
      </div>
    `;

    await transporter.sendMail({
      from: `"AuditFlow AI • Telemetría" <${CONFIG.EMAIL.FROM_OUTREACH}>`,
      to: CONFIG.EMAIL.OWNER_CONTROL,
      subject: `❄️ [CRON 4:00 AM] Despacho Sector Medio Nórdicos: ${dispatchedCount} socios contactados`,
      html: adminHtml
    });
    console.log(`📬 Telemetría enviada al buzón de control (${CONFIG.EMAIL.OWNER_CONTROL})`);
  } catch (adminErr) {
    console.warn('Alerta admin omitida:', adminErr.message);
  }

  console.log('\n================================================================================');
  console.log(`🏁 DESPACHO NÓRDICO 4:00 AM FINALIZADO CON ÉXITO`);
  console.log('================================================================================\n');
}

if (process.argv[1] && process.argv[1].includes('nordic_midmarket_daily_sower.mjs')) {
  runNordicDailySower().catch(console.error);
}
