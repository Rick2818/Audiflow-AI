import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const gmailUser = (process.env.GMAIL_USER || '').trim();
const gmailPass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '').trim();
const adminNotifyEmail = process.env.PERSONAL_NOTIFICATION_EMAIL || process.env.OWNER_CORPORATE_EMAIL || 'rick28191@gmail.com';

if (!gmailUser || !gmailPass) {
  console.error('❌ Error: Credenciales de Gmail no configuradas en .env');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass
  }
});

const leads = [
  { name: 'Armando Arias', email: 'contact.elsalvador@ariaslaw.com', company: 'Arias Law Firm', leadId: 'Armando', role: 'Socio Director & General Counsel' },
  { name: 'Oscar Samour', email: 'elsalvador@consortiumlegal.com', company: 'Consortium Legal', leadId: 'Oscar', role: 'Socio Director Corporativo & M&A' },
  { name: 'Héctor Torres', email: 'contacto@torres.legal', company: 'Torres Legal & Fintech Desk', leadId: 'Hector', role: 'Managing Partner' },
  { name: 'José Antonio Muñoz', email: 'info.centralamerica@dentons.com', company: 'Dentons Muñoz', leadId: 'JoseAntonio', role: 'Managing Partner Centroamérica' },
  { name: 'Rafael Fontana', email: 'info@cuatrecasas.com', company: 'Cuatrecasas', leadId: 'Rafael', role: 'Presidente Ejecutivo' },
  { name: 'Sofia Ramírez', email: 'sofia.ramirez15@alvarado.sv', company: 'Alvarado Holdings SV', leadId: 'Sofia', role: 'CFO' },
  { name: 'Diego Bermúdez', email: 'diego.bermudez30@serviciosgt.com', company: 'Servicios Corporativos GT', leadId: 'Diego', role: 'CFO' },
  { name: 'Mariana Navarro', email: 'mariana.navarro1@constructora.sv', company: 'Constructora Central SV', leadId: 'Mariana', role: 'Directora Financiera' },
  { name: 'Gonzalo Montero', email: 'gonzalo.montero60@panamalogistics.pa', company: 'Panamá Logistics & Services', leadId: 'Gonzalo', role: 'CFO' },
  { name: 'Mauricio Morales', email: 'mauricio.morales75@grupomx.com.mx', company: 'Grupo México Retail', leadId: 'Mauricio', role: 'Director Financiero' }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

console.log('======================================================================');
console.log(`🚀 AUDITFLOW AI — DESPACHO DE OUTREACH FIDUCIARIO EN VIVO`);
console.log(`Remitente Oficial: ${gmailUser}`);
console.log(`Notificación de Copia al CEO: ${adminNotifyEmail}`);
console.log(`Total de Prospectos: ${leads.length}`);
console.log('======================================================================\n');

async function dispatchAll() {
  let successCount = 0;
  let failCount = 0;
  const dispatchLogs = [];

  for (const lead of leads) {
    const subject = `Acceso de Cortesía Institucional: Auditoría de Contratos con IA en RAM — AuditFlow AI / ${lead.company}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #38bdf8; max-width: 620px; margin: 0 auto;">
        <div style="margin-bottom: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 15px;">
          <span style="font-size: 18px; font-weight: bold; color: #38bdf8; letter-spacing: 0.5px;">AUDITFLOW AI</span>
          <span style="font-size: 12px; color: #94a3b8; margin-left: 10px;">| División de Auditoría Fiduciaria</span>
        </div>

        <h2 style="color: #ffffff; font-size: 20px; margin-top: 0; line-height: 1.4;">Estimado/a ${lead.name},</h2>
        
        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          En la gestión jurídica y financiera corporativa de <strong>${lead.company}</strong>, lo más costoso de un contrato no es lo que dice el documento, sino las penalizaciones ocultas, indemnizaciones sin tope y asimetrías que no se detectan antes de firmar.
        </p>

        <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
          Hemos habilitado para su dirección un <strong>Diagnóstico de Riesgo de Cortesía (100% Gratuito y sin tarjeta de crédito)</strong> para que su equipo pueda auditar cualquier contrato complejo en menos de 30 segundos:
        </p>

        <div style="background-color: #111c2e; padding: 18px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
          <p style="margin: 0 0 10px 0; color: #ffffff; font-size: 13px;">⚡ <strong>Detección Forense Instantánea:</strong> Identifica cláusulas abusivas, límites de responsabilidad y contingencias de indemnización.</p>
          <p style="margin: 0; color: #ffffff; font-size: 13px;">🔒 <strong>Privacidad Absoluta (Zero-Retention):</strong> Procesamiento en memoria RAM volátil, sin persistencia en disco ni reentrenamiento de modelos públicos.</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://audiflowai.com/?ref=direct-outreach&lead=${encodeURIComponent(lead.leadId)}" style="background-color: #10b981; color: #022c22; padding: 14px 32px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; display: inline-block; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);">
            Auditar Mi Primer Contrato sin Costo (30s) →
          </a>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.5; border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 25px;">
          Este acceso de cortesía forma parte del programa de vinculación de AuditFlow AI para directores y socios corporativos.<br>
          Saludos cordiales,<br>
          <strong style="color: #e2e8f0;">Ricardo Bolaños</strong><br>
          <span style="color: #94a3b8;">Director General • AuditFlow AI</span><br>
          <a href="https://audiflowai.com" style="color: #38bdf8; text-decoration: none;">audiflowai.com</a>
        </p>
      </div>
    `;

    try {
      console.log(`📤 Despachando a: ${lead.name} (${lead.email}) [${lead.company}]...`);
      const info = await transporter.sendMail({
        from: `"Ricardo Bolaños | AuditFlow AI" <${gmailUser}>`,
        to: lead.email,
        replyTo: adminNotifyEmail,
        subject,
        html
      });
      console.log(`   ✅ Enviado exitosamente (MessageId: ${info.messageId})`);
      successCount++;
      dispatchLogs.push({ lead: lead.name, email: lead.email, status: 'SENT', messageId: info.messageId });
    } catch (err) {
      console.warn(`   ⚠️ Fallo al enviar a ${lead.email}: ${err.message}`);
      failCount++;
      dispatchLogs.push({ lead: lead.name, email: lead.email, status: 'FAILED', error: err.message });
    }

    // Espera preventiva de 1.5 segundos entre despachos para cadencia fiduciaria
    await sleep(1500);
  }

  // Notificar al CEO con el resumen del lote despachado
  try {
    console.log(`\n📬 Enviando confirmación de lote a la bandeja del CEO (${adminNotifyEmail})...`);
    await transporter.sendMail({
      from: `"AuditFlow AI • Sistema de Despacho" <${gmailUser}>`,
      to: adminNotifyEmail,
      subject: `🏁 Reporte de Despacho: ${successCount} correos de outreach enviados hoy`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0f172a; color: #fff; padding: 20px; border-radius: 8px;">
          <h2 style="color: #10b981;">🏁 Campaña de Outreach Despachada con Éxito</h2>
          <p>Se han enviado <strong>${successCount}</strong> correos de cortesía con el escaneo gratuito a Directores Legales y CFOs.</p>
          <ul>
            ${dispatchLogs.map(l => `<li><strong>${l.lead}</strong> (${l.email}): ${l.status}</li>`).join('')}
          </ul>
          <p>Tan pronto alguno abra su acceso en <a href="https://audiflowai.com" style="color: #38bdf8;">audiflowai.com</a> recibirás la alerta de interacción.</p>
        </div>
      `
    });
    console.log('✅ Notificación al CEO entregada.');
  } catch (e) {
    console.warn('⚠️ No se pudo enviar el reporte consolidado al CEO:', e.message);
  }

  console.log('\n======================================================================');
  console.log(`🏁 FIN DE JORNADA: ${successCount} enviados con éxito, ${failCount} fallidos.`);
  console.log('======================================================================');
}

dispatchAll();
