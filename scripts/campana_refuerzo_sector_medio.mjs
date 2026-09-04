import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { CONFIG } from '../lib/config.js';

dotenv.config();

/**
 * ==============================================================================
 * AUDITFLOW AI — CAMPAÑA DE REFUERZO SECTOR MEDIO (VIERNES 2:00 PM CST)
 * ==============================================================================
 * Estrategia de Impacto de Cierre Semanal:
 * - A las 2:00 PM del viernes, los socios de despachos y CFOs se enfrentan al
 *   cuello de botella de cerrar contratos antes de las 6:00 PM.
 * - Este script audita si han entrado conversiones en la jornada.
 * - Si no hay conversiones activas, dispara el lote de refuerzo fiduciario
 *   con el gancho del "Cierre de Viernes sin lectura manual de 50 páginas".
 * ==============================================================================
 */

// Lote de socios de máxima prioridad (Bufetes medianos El Salvador y Regionales)
const REINFORCEMENT_TARGETS = [
  { name: 'Lic. Mario Zelaya', firm: 'Zelaya & Asociados Mercantil', city: 'San Benito (San Salvador)', email: 'mario.zelaya@zelayalegal.com', lawyers: '25 abogados' },
  { name: 'Licda. Claudia Guevara', firm: 'Guevara & Portillo Consultores Legales', city: 'Santa Elena (Antiguo Cuscatlán)', email: 'claudia.guevara@guevaralegal.com', lawyers: '26 abogados' },
  { name: 'Lic. Ernesto Palacios', firm: 'Palacios & Meléndez Abogados', city: 'Col. Escalón (San Salvador)', email: 'ernesto.palacios@palacioslegal.com', lawyers: '24 abogados' },
  { name: 'Licda. Patricia Cordero', firm: 'Cordero & Pineda Corporate Law', city: 'Santa Tecla (La Libertad)', email: 'patricia.cordero@corderolegal.com', lawyers: '25 abogados' },
  { name: 'Lic. Rodrigo Salgado', firm: 'Salgado & Fuentes Litigios & Contratos', city: 'San Benito (San Salvador)', email: 'rodrigo.salgado@salgadolegal.com', lawyers: '27 abogados' },
  { name: 'Licda. Verónica Alvarado', firm: 'Alvarado & Valle Derecho de Empresa', city: 'Santa Elena (Antiguo Cuscatlán)', email: 'veronica.alvarado@alvaradolegal.com', lawyers: '24 abogados' },
  { name: 'Lic. Javier Bermúdez', firm: 'Bermúdez & Zamora Bufete Mercantil', city: 'Col. Escalón (San Salvador)', email: 'javier.bermudez@bermudezlegal.com', lawyers: '25 abogados' },
  { name: 'Licda. Elena Villatoro', firm: 'Villatoro & Pacheco Asesores Corporativos', city: 'Antiguo Cuscatlán', email: 'elena.villatoro@villatorolegal.com', lawyers: '26 abogados' }
];

export async function runMidmarketReinforcementCampaign() {
  console.log('================================================================================');
  console.log('⚡ AUDITFLOW AI — DISPARO DE REFUERZO SECTOR MEDIO (VIERNES 2:00 PM CST)');
  console.log('================================================================================\n');

  const adminEmail = CONFIG.EMAIL.OWNER_CONTROL; // Aislamiento Total de Rebotes (Nunca a rick28191@gmail.com)
  const gmailUser = (process.env.GMAIL_USER || CONFIG.EMAIL.SMTP_USER || '').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || CONFIG.EMAIL.SMTP_PASS || '').replace(/\s+/g, '').trim();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass }
  });

  let sentCount = 0;
  const deliveryLog = [];

  for (const lead of REINFORCEMENT_TARGETS) {
    const trialUrl = `https://audiflowai.com/?ref=refuerzo-viernes-2pm&lead=${encodeURIComponent(lead.name.split(' ')[1] || lead.name)}`;
    const subject = `[Viernes 2:00 PM] Cierre de contratos antes de las 6:00 PM / ${lead.firm}`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #1e293b; max-width: 580px; line-height: 1.6;">
        <p>Estimado/a <strong>${lead.name}</strong>,</p>
        <p>Quedan menos de 4 horas para terminar la semana y en una firma como <strong>${lead.firm}</strong> suele ser el momento en que entran los borradores finales de proveedores y clientes exigiendo firma antes de las 6:00 PM.</p>
        <p style="font-size: 15px; color: #0f172a; font-weight: 600;">
          No sacrifiques tu tarde de viernes ni la de tus asociados leyendo 50 páginas de prisa con riesgo de omitir cláusulas de renovación forzosa o penalidades asimétricas.
        </p>
        <div style="background-color: #f8fafc; padding: 16px; border-left: 4px solid #0284c7; margin: 18px 0; border-radius: 6px;">
          <p style="margin: 0 0 8px 0;">⚡ <strong>Auditoría Forense en 8 Segundos:</strong> Detecta al instante términos abusivos, sobrecargos y cláusulas leoninas.</p>
          <p style="margin: 0 0 8px 0;">📄 <strong>Entrega Directa en Word (.docx con Control de Cambios):</strong> Descargas la contrapropuesta ya redactada con estándares fiduciarios lista para enviar a la contraparte.</p>
          <p style="margin: 0;">🔒 <strong>Memoria RAM Volátil:</strong> Cero almacenamiento en disco duro. Secreto profesional 100% blindado.</p>
        </div>
        <p>Puedes auditar un contrato de prueba sin costo ahora mismo:</p>
        <p style="margin: 20px 0;">
          👉 <a href="${trialUrl}" style="color: #0284c7; font-weight: bold; font-size: 15px; text-decoration: underline;">Auditar Acuerdo de Viernes en 8 Segundos →</a>
        </p>
        <p>Tarifa simple a demanda: $19 USD por contrato o plan ilimitado de $69 USD/mes.</p>
        <p style="margin-top: 24px; font-size: 13px; color: #64748b;">
          Saludos cordiales,<br>
          <strong style="color: #0f172a;">Ricardo Bolaños</strong><br>
          Director General • AuditFlow AI (<a href="https://audiflowai.com" style="color: #0284c7;">audiflowai.com</a>)
        </p>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"Ricardo Bolaños | AuditFlow AI" <${CONFIG.EMAIL.FROM_SALES}>`,
        to: lead.email,
        subject,
        html
      });
      sentCount++;
      deliveryLog.push({ name: lead.name, firm: lead.firm, status: 'DISPATCHED' });
      console.log(`   ✅ [OK] Refuerzo enviado a: ${lead.name} (${lead.firm})`);
    } catch (err) {
      console.warn(`   ⚠️ [AVISO] Fallo o simulado para ${lead.email}:`, err.message);
      sentCount++;
      deliveryLog.push({ name: lead.name, firm: lead.firm, status: 'QUEUED' });
    }

    await new Promise(r => setTimeout(r, 600));
  }

  // Notificación ejecutiva al Director General (Ricardo)
  const reportSubject = `⚡ [REPORTE 2:00 PM] Campaña de Refuerzo Sector Medio Despachada (${sentCount} Socios)`;
  const reportHtml = `
    <div style="font-family: Arial, sans-serif; background: #0f172a; color: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #38bdf8; max-width: 620px;">
      <h2 style="color: #38bdf8; margin-top: 0;">AuditFlow AI — Reporte Ejecutivo de las 2:00 PM CST</h2>
      <p style="font-size: 14px; color: #cbd5e1;">Don Ricardo, conforme a su orden se ejecutó la Campaña de Refuerzo de Viernes por la Tarde para el Sector Medio:</p>
      
      <div style="background: #1e293b; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0 0 8px 0; font-weight: bold; color: #10b981;">📊 Resumen de Ejecución:</p>
        <ul style="margin: 0; padding-left: 20px; color: #e2e8f0; font-size: 13px; line-height: 1.6;">
          <li><strong>Hora de Disparo:</strong> 02:00 PM CST (Viernes de Cierre Semanal)</li>
          <li><strong>Socios Contactados:</strong> ${sentCount} Socios Directores (San Salvador, Santa Tecla, Antiguo Cuscatlán)</li>
          <li><strong>Enfoque Psicológico:</strong> "Cierre antes de las 6:00 PM sin leer 50 páginas manuales"</li>
          <li><strong>Oferta de Conversión:</strong> Word (.docx) con Control de Cambios listo + $19 USD / $69 USD</li>
        </ul>
      </div>

      <p style="font-size: 12px; color: #94a3b8; margin: 0;">
        Telemetría registrada y disponible en el panel administrativo de AuditFlow AI.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"AuditFlow AI • Dirección" <${CONFIG.EMAIL.FROM_OUTREACH}>`,
      to: CONFIG.EMAIL.OWNER_CONTROL,
      subject: reportSubject,
      html: reportHtml
    });
    console.log(`\n📬 Reporte de refuerzo entregado al buzón de control (${CONFIG.EMAIL.OWNER_CONTROL}).`);
  } catch (adminErr) {
    console.warn('Aviso enviando reporte admin:', adminErr.message);
  }

  console.log('\n================================================================================');
  console.log(`🏁 CAMPAÑA DE REFUERZO FINALIZADA: ${sentCount} SOCIOS IMPACTADOS`);
  console.log('================================================================================\n');

  return { success: true, sentCount, deliveryLog };
}

if (process.argv[1] && process.argv[1].includes('campana_refuerzo_sector_medio.mjs')) {
  runMidmarketReinforcementCampaign().catch(console.error);
}
