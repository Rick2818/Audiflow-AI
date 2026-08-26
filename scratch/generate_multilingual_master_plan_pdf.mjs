import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

console.log('📄 Generando Documento PDF: AuditFlow AI Operational Master Plan (Multilingüe: ES / EN / FR)...');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 35, bottom: 35, left: 40, right: 40 },
  info: {
    Title: 'AuditFlow AI Corp. — Operational Master Plan (ES/EN/FR)',
    Author: 'Ricardo • Fundador & CEO, AuditFlow AI Corp.',
    Subject: 'Blueprint Operativo de Backend, Campaña LinkedIn 3 Idiomas e Interoperabilidad entre IAs',
    Keywords: 'AuditFlow AI, Master Plan, Backend, LinkedIn Carousel, Trilingual'
  }
});

const outputPath = path.join(process.cwd(), 'frontend', 'AuditFlow_AI_Operational_Master_Plan.pdf');
const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// --- COLORES ---
const C_DARK = '#0f172a';
const C_NAVY = '#1e3a8a';
const C_BLUE = '#2563eb';
const C_EMERALD = '#059669';
const C_PURPLE = '#6b21a8';
const C_GRAY_TEXT = '#334155';

// ==========================================
// PÁGINA 1: PORTADA & MATRIZ DE BACKEND
// ==========================================
doc.rect(35, 30, 525, 75).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(20).font('Helvetica-Bold').text('AUDITFLOW AI CORP.', 50, 42);
doc.fillColor('#ffffff').fontSize(10).font('Helvetica').text('BLUEPRINT OPERATIVO DE BACKEND & CAMPAÑA MULTILINGÜE (ES / EN / FR)', 50, 65);
doc.fillColor('#94a3b8').fontSize(8.5).font('Helvetica').text('Destinatario: Agentes Especialistas de IA & Marketing • URL: audiflowai.com', 50, 79);

doc.moveDown(3.2);

// REGLA DE ORO ANTI-QUIEBRA
doc.rect(40, doc.y, 515, 42).fill('#fef2f2');
doc.rect(40, doc.y, 4, 42).fill('#ef4444');
doc.fillColor('#991b1b').fontSize(10).font('Helvetica-Bold').text('🛡️ REGLA DE ORO ANTI-QUIEBRA (Vigente 2026):', 50, doc.y + 6);
doc.fillColor('#7f1d1d').fontSize(8).font('Helvetica').lineGap(2).text(
  'Queda estrictamente prohibido depender de anuncios pagados (Paid Ads) o tráfico pasivo. Toda la arquitectura está optimizada para generar flujo de caja diario ($19, $69, $599 USD) mediante automatización serverless 24/7, respuesta en <3 segundos y bucles virales PLG.',
  50,
  doc.y + 3,
  { width: 495 }
);

doc.moveDown(1.5);

// 1. MATRIZ DE ENDPOINTS
doc.fillColor(C_NAVY).fontSize(12).font('Helvetica-Bold').text('1. MATRIZ DE ENDPOINTS Y TAREAS AUTÓNOMAS DE BACKEND');
doc.rect(40, doc.y + 2, 515, 1.5).fill(C_BLUE);
doc.moveDown(0.5);

doc.fillColor(C_GRAY_TEXT).fontSize(8.5).font('Helvetica').lineGap(2.5);
doc.text(
  '• POST /api/waalaxy-sync (Webhook LinkedIn): Recibe el payload del lead, genera el token fiduciario y despacha el diagnóstico gratuito en 10s y el archivo Word (.docx) de prueba. SLA: < 3 segundos.\n' +
  '• CRON /api/lead-recovery (Worker 24/7 cada 15m): Identifica contratos auditados en memoria RAM que abandonaron sin descargar el Redline de $19 USD; despacha email con reporte de riesgos.\n' +
  '• POST /api/invite-colleague (PLG Engine): Genera link de referencia otorgando 1 crédito mutuo al usuario y a su abogado/colega invitado.\n' +
  '• POST /api/indexnow (SEO Pinger): Notifica a Bing y Yandex las URLs canónicas B2B en < 5 segundos.'
);

doc.moveDown(0.8);

// 2. PROTOCOLO WAALAXY
doc.fillColor(C_NAVY).fontSize(12).font('Helvetica-Bold').text('2. PROTOCOLO DE AUTOMATIZACIÓN LINKEDIN / WAALAXY');
doc.rect(40, doc.y + 2, 515, 1.5).fill(C_BLUE);
doc.moveDown(0.5);

doc.fillColor(C_GRAY_TEXT).fontSize(8.5).font('Helvetica').lineGap(2);
doc.text(
  '• Audiencia Calificada: 2,000 Directores Jurídicos, General Counsels y Socios Directores Reales (El Salvador, Latam, USA, España).\n' +
  '• Filtro Prioritario: 400 Socios Pareto VIP (Lead Score > 90).\n' +
  '• Cadencia Anti-Bloqueo: 20-25 invitaciones diarias por cuenta con pausas aleatorias.\n' +
  '• Flujo Desatendido: Visita (Día 1) → Invitación (Día 2) → Mensaje con link directo (Día 3) → Webhook inmediato ante respuesta.'
);

// ==========================================
// PÁGINA 2: COPIES DE LINKEDIN EN 3 IDIOMAS
// ==========================================
doc.addPage();
doc.rect(35, 30, 525, 45).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(13).font('Helvetica-Bold').text('3. COPIES VIRALES DE LINKEDIN EN LOS 3 IDIOMAS OFICIALES', 50, 42);
doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica').text('Diseñados para activar comentarios masivos y alimentar el Webhook /api/waalaxy-sync', 50, 58);

doc.moveDown(2.5);

// ESPAÑOL
doc.fillColor(C_NAVY).fontSize(10.5).font('Helvetica-Bold').text('🇪🇸 1. COPY EN ESPAÑOL (Palabra Clave: "AUDITORIA")');
doc.rect(40, doc.y + 2, 515, 1).fill(C_EMERALD);
doc.moveDown(0.4);
doc.fillColor(C_GRAY_TEXT).fontSize(7.5).font('Helvetica').lineGap(1.8).text(
  'El 78% de los contratos comerciales contienen cláusulas abusivas ocultas (renovaciones forzosas, subidas no topadas, penalizaciones de $10k-$50k USD). Revisar 40 páginas toma 5 horas; con AuditFlow AI toma exactamente 10 segundos en memoria RAM volátil (SOC-2/GDPR) generando el Redline en Word (.docx con control de cambios).\n' +
  '🎁 ¿Quieres probarlo? Comenta "AUDITORIA" y mi sistema automatizado te enviará tu acceso para auditar tu 1er contrato 100% gratis.\n' +
  '#LegalTech #DirectoresLegales #ContratosMercantiles #AuditFlowAI'
);

doc.moveDown(0.6);

// INGLÉS
doc.fillColor(C_NAVY).fontSize(10.5).font('Helvetica-Bold').text('🇺🇸 2. ENGLISH COPY (Keyword: "AUDIT")');
doc.rect(40, doc.y + 2, 515, 1).fill(C_BLUE);
doc.moveDown(0.4);
doc.fillColor(C_GRAY_TEXT).fontSize(7.5).font('Helvetica').lineGap(1.8).text(
  '78% of B2B vendor contracts contain hidden traps (auto-renewals, uncapped indexations, $50k termination penalties). Reviewing 40 pages takes 5 hours; with AuditFlow AI it takes 10 seconds in volatile RAM (SOC-2/GDPR compliant) generating instant Word (.docx Track Changes) Redlines.\n' +
  '🎁 Want to test it? Comment "AUDIT" and our automated bot will send your link to audit your first contract 100% free.\n' +
  '#LegalTech #GeneralCounsel #ContractManagement #AuditFlowAI'
);

doc.moveDown(0.6);

// FRANCÉS
doc.fillColor(C_NAVY).fontSize(10.5).font('Helvetica-Bold').text('🇫🇷 3. VERSION FRANÇAISE (Mot-clé: "AUDIT")');
doc.rect(40, doc.y + 2, 515, 1).fill(C_PURPLE);
doc.moveDown(0.4);
doc.fillColor(C_GRAY_TEXT).fontSize(7.5).font('Helvetica').lineGap(1.8).text(
  '78% des contrats commerciaux contiennent des clauses abusives cachées (reconductions tacites, hausses non plafonnées). Examiner 40 pages prend 5 heures; avec AuditFlow AI, cela prend 10 secondes en mémoire RAM volatile (conforme SOC-2/GDPR) avec génération automatique de Redlines Word (.docx avec suivi des modifications).\n' +
  '🎁 Vous souhaitez tester? Commentez "AUDIT" et notre robot vous enverra votre accès gratuit immédiat.\n' +
  '#LegalTech #DirecteurJuridique #ContratsB2B #AuditFlowAI'
);

// ==========================================
// PÁGINA 3: CARRUSEL DE 6 SLIDES & CRONS
// ==========================================
doc.addPage();
doc.rect(35, 30, 525, 45).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(13).font('Helvetica-Bold').text('4. ESTRUCTURA DEL CARRUSEL DE 6 SLIDES & HEALTH-CHECKS', 50, 42);
doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica').text('Assets Gráficos Generados y Protocolos de Verificación en Segundo Plano', 50, 58);

doc.moveDown(2.5);

doc.fillColor(C_NAVY).fontSize(11).font('Helvetica-Bold').text('ESTRUCTURA DE LAS 6 DIAPOSITIVAS:');
doc.rect(40, doc.y + 2, 515, 1).fill(C_EMERALD);
doc.moveDown(0.5);

doc.fillColor(C_GRAY_TEXT).fontSize(8).font('Helvetica').lineGap(2.2);
doc.text(
  '• Slide 1 (Cover): "Las 5 Cláusulas Trampa que los Proveedores Ocultan (y cómo blindarte en 10s)"\n' +
  '• Slide 2 (Renovación): "1. Renovación Automática con Ventana Ciega (Preavisos ocultos vs. Salida a 30 días)"\n' +
  '• Slide 3 (Indexación): "2. Incrementos de Precio sin Tope (Subidas del 15% vs. Tope de IPC + 3% máx.)"\n' +
  '• Slide 4 (SLAs): "3. SLAs Tecnológicos Fantasma (Caídas sin compensación vs. Descuento automático)"\n' +
  '• Slide 5 (Redline Word): "El Entregable Estrella: Redline en Word en 10s con Control de Cambios nativo"\n' +
  '• Slide 6 (CTA): "Audita tu Contrato Gratis en 10s • Comenta AUDITORIA o visita audiflowai.com"'
);

doc.moveDown(0.8);

doc.fillColor(C_NAVY).fontSize(11).font('Helvetica-Bold').text('PROTOCOLOS DE VERIFICACIÓN AUTOMATIZADA (CRON JOBS):');
doc.rect(40, doc.y + 2, 515, 1).fill(C_BLUE);
doc.moveDown(0.5);

doc.fillColor(C_GRAY_TEXT).fontSize(8).font('Helvetica').lineGap(2.2);
doc.text(
  '1. Health-Check Webhook (/api/waalaxy-sync): Test sintético cada 6h validando latencia < 200ms.\n' +
  '2. Lead Recovery Dispatcher (/api/lead-recovery): Monitoreo de carritos abandonados cada 15m.\n' +
  '3. Aislamiento Total de Rebotes (Regla 5): Tasa de rebotes < 1.5% sin alertar a correos personales.'
);

// Pie de página
const range = doc.bufferedPageRange();
for (let i = range.start; i < (range.start + range.count); i++) {
  doc.switchToPage(i);
  doc.fontSize(7.5).fillColor('#94a3b8').text(
    `AuditFlow AI Corp. (audiflowai.com) • Operational Master Plan (ES / EN / FR) • Página ${i + 1} de ${range.count}`,
    40,
    doc.page.height - 25,
    { align: 'center', width: 515 }
  );
}

doc.end();

writeStream.on('finish', () => {
  console.log(`✅ PDF Master Plan generado exitosamente en: ${outputPath}`);
});
