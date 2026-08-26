import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

console.log('📄 Generando Documento PDF: Plan Estratégico de Marketing y Actividades Realizadas...');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  info: {
    Title: 'AuditFlow AI — Plan Estratégico de Marketing, Ejecución Omnicanal y Actividades Realizadas',
    Author: 'AuditFlow AI Growth & Marketing Engineering',
    Subject: 'Blueprint Completo de Marketing para Agentes de IA y Especialistas de Crecimiento',
    Keywords: 'AuditFlow AI, Marketing Plan, Growth, PLG, Outbound, B2B SaaS'
  }
});

const outputPath = path.join(process.cwd(), 'frontend', 'Marketing_Plan_AuditFlow_AI.pdf');
const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// --- PALETA DE COLORES ---
const C_DARK = '#0f172a';
const C_PURPLE = '#6b21a8';
const C_BLUE = '#2563eb';
const C_EMERALD = '#059669';
const C_GRAY_TEXT = '#334155';
const C_MUTED = '#64748b';

// ==========================================
// PÁGINA 1: PORTADA & ARQUITECTURA GTM
// ==========================================
doc.rect(40, 35, 515, 75).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(20).font('Helvetica-Bold').text('AUDITFLOW AI CORP. • MARKETING STRATEGY', 55, 50);
doc.fillColor('#ffffff').fontSize(11).font('Helvetica').text('BLUEPRINT TÉCNICO DE MARKETING & ACTIVIDADES EJECUTADAS', 55, 75);
doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text('Guía para Especialistas y Agentes de IA • URL: audiflowai.com', 55, 90);

doc.moveDown(3.5);

// 1. FILOSOFÍA GTM & PRODUCT-LED GROWTH
doc.fillColor(C_PURPLE).fontSize(13).font('Helvetica-Bold').text('1. FILOSOFÍA DE CRECIMIENTO: FRICCIÓN CERO & PLG');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_BLUE);
doc.moveDown(0.6);

doc.fillColor(C_GRAY_TEXT).fontSize(9).font('Helvetica').lineGap(2.5);
doc.text(
  'El motor de crecimiento de AuditFlow AI está fundamentado en la estrategia de Fricción Cero (Zero-Friction Value Delivery) combinada con Product-Led Growth (PLG):\n\n' +
  '• Hook Irresistible de Entrada: El prospecto puede probar el producto y obtener su primer análisis forense en menos de 10 segundos en memoria RAM volátil, sin requerir registro previo, tarjeta de crédito ni almacenamiento de datos.\n' +
  '• Oferta Tripwire de Entrada: $19.00 USD por auditoría completa con descarga del archivo Word (.docx) con marcas de revisión (Redline) y playbook de contrapropuesta.\n' +
  '• Modelo de Expansión Recurrente: Conversión natural a planes Pro ($69.00 USD/mes) o Licencias Anuales con Marca Blanca para firmas legales ($599.00 USD/año).'
);

doc.moveDown(0.8);

// 2. CANAL 1: OUTBOUND QUIRÚRGICO B2B
doc.fillColor(C_PURPLE).fontSize(13).font('Helvetica-Bold').text('2. CANAL 1: OUTBOUND QUIRÚRGICO & COLD EMAIL (B2B)');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_BLUE);
doc.moveDown(0.6);

doc.fillColor(C_GRAY_TEXT).fontSize(9).font('Helvetica').lineGap(2.5);
doc.text(
  '• Base de Datos Real y Calificada (2,000 Decisores Legales): Compuesta al 100% por Directores Jurídicos, General Counsels y Socios Directores de firmas reales existentes (Arias, Consortium Legal, Torres Legal, BLP, Ecija, Dentons, Garrigues, Cuatrecasas, Baker McKenzie, etc.).\n' +
  '• Segmentación Pareto VIP (Top 20%): 400 Socios Directores de alto impacto con Lead Scores de 92 a 99.\n' +
  '• Cadencia Anti-Spam Drip Throttling: Envíos controlados en lotes seguros de 25 decisores por sesión con pausas para garantizar una entregabilidad superior al 98% (SPF, DKIM, DMARC y encabezados List-Unsubscribe RFC-8058).\n' +
  '• Copywriting Fiduciario Humano: Texto plano/HTML limpio de 65-75 palabras, asunto en minúsculas estilo colega (análisis gratis de contratos y redlines / {{empresa}}) y llamada a la acción de micro-compromiso de baja fricción.'
);

// ==========================================
// PÁGINA 2: OMNICANALIDAD, SEO & PLG
// ==========================================
doc.addPage();
doc.rect(40, 35, 515, 45).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(14).font('Helvetica-Bold').text('3. EJECUCIÓN OMNICANAL, SEO & BUCLES VIRALES', 55, 48);
doc.fillColor('#ffffff').fontSize(9).font('Helvetica').text('Sincronización LinkedIn, Indexación Instantánea y Re-Engagement 24/7', 55, 64);

doc.moveDown(2.5);

// CANAL 2: WAALAXY & LINKEDIN
doc.fillColor(C_PURPLE).fontSize(12).font('Helvetica-Bold').text('CANAL 2: INTEGRACIÓN LINKEDIN & WAALAXY OMNICANAL');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_EMERALD);
doc.moveDown(0.5);

doc.fillColor(C_GRAY_TEXT).fontSize(9).font('Helvetica').lineGap(2);
doc.text(
  '• Exportación de CSV Enriquecido: Exportador de 2,000 contactos con Lead Score y etiquetas para campañas en LinkedIn.\n' +
  '• Webhook Serverless 24/7 (/api/waalaxy-sync): Sincronización en tiempo real de interacciones.\n' +
  '• Auto-Responder de Redlines Instantáneo: Cuando un prospecto responde o muestra interés en LinkedIn, el sistema le despacha de forma autónoma el Redline en Word (.docx) y su acceso gratuito en menos de 3 segundos.'
);

doc.moveDown(0.8);

// CANAL 3: SEO PROGRAMÁTICO
doc.fillColor(C_PURPLE).fontSize(12).font('Helvetica-Bold').text('CANAL 3: SEO PROGRAMÁTICO & INDEXNOW PINGER');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_BLUE);
doc.moveDown(0.5);

doc.fillColor(C_GRAY_TEXT).fontSize(9).font('Helvetica').lineGap(2);
doc.text(
  '• Protocolo IndexNow Activo: Notificación directa a Bing, Yandex y buscadores en <5 segundos vía /api/indexnow.\n' +
  '• 4 URLs Canónicas B2B Indexadas en Sitemap XML:\n' +
  '  1. Landing Principal: audiflowai.com/\n' +
  '  2. Arrendamientos: audiflowai.com/auditar-contrato-arrendamiento\n' +
  '  3. Facturas Proveedor: audiflowai.com/auditar-factura-proveedor\n' +
  '  4. Servicios IT & SLA: audiflowai.com/auditar-contrato-servicios-it'
);

doc.moveDown(0.8);

// CANAL 4: BUCLE VIRAL PLG
doc.fillColor(C_PURPLE).fontSize(12).font('Helvetica-Bold').text('CANAL 4 & 5: BUCLE VIRAL DE PRODUCTO Y LEAD RECOVERY');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_BLUE);
doc.moveDown(0.5);

doc.fillColor(C_GRAY_TEXT).fontSize(9).font('Helvetica').lineGap(2);
doc.text(
  '• Bucle Viral de Invitación (/api/invite-colleague): Cada usuario que audita un contrato puede invitar con 1 clic a su asesor legal o colega, otorgando créditos de auditoría mutuos e impulsando el coeficiente viral K.\n' +
  '• Lead Recovery Inteligente (/api/lead-recovery): Re-enganche automatizado para prospectos que subieron contratos pero no completaron la descarga del Redline, rescatando el 25-35% de leads no convertidos.'
);

// ==========================================
// PÁGINA 3: MATRIZ DE CONVERSIÓN & REGLAS
// ==========================================
doc.addPage();
doc.rect(40, 35, 515, 45).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(14).font('Helvetica-Bold').text('4. EMBUDO DE CONVERSIÓN & REGLAS FIDUCIARIAS', 55, 48);
doc.fillColor('#ffffff').fontSize(9).font('Helvetica').text('Pasarelas, Enrutamiento Fiduciario y Protección de Marca', 55, 64);

doc.moveDown(2.5);

// EMBUDO
doc.fillColor(C_PURPLE).fontSize(12).font('Helvetica-Bold').text('MATRIZ DE CONVERSIÓN Y MONETIZACIÓN:');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_EMERALD);
doc.moveDown(0.5);

doc.fillColor(C_GRAY_TEXT).fontSize(9).font('Helvetica').lineGap(2);
doc.text(
  '• Paso 1 (Atracción): Cold Email + LinkedIn Waalaxy + SEO Programático IndexNow.\n' +
  '• Paso 2 (Activación Fricción Cero): Diagnóstico instantáneo de 10s en memoria RAM volátil.\n' +
  '• Paso 3 (Monetización Front-End): Oferta $19 USD para descargar el Redline Word (.docx).\n' +
  '• Paso 4 (Monetización Back-End): Suscripción recurrente $69 USD/mes o $599 USD/año Marca Blanca.\n' +
  '• Pasarelas de Pago Oficiales:\n' +
  '  1. Wompi (Banco Agrícola / Bancolombia): Tarjetas y banca en El Salvador y Centroamérica.\n' +
  '  2. Bitcoin Lightning Network (rick28@strike.me): Liquidación instantánea sin comisiones bancarias.\n' +
  '  3. Stripe: Clientes internacionales y corporativos.'
);

doc.moveDown(0.8);

// REGLAS FIDUCIARIAS
doc.fillColor(C_PURPLE).fontSize(12).font('Helvetica-Bold').text('REGLAS FIDUCIARIAS PARA EL EQUIPO DE MARKETING:');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_BLUE);
doc.moveDown(0.5);

doc.fillColor(C_GRAY_TEXT).fontSize(8.5).font('Helvetica').lineGap(2);
doc.text(
  '1. Prohibido el uso de prospectos o datos ficticios en campañas de producción.\n' +
  '2. Aislamiento Total de Rebotes: Cualquier rebote técnico es filtrado en silencio. El correo personal (rick28191@gmail.com) es exclusivo para notificaciones de ventas confirmadas.\n' +
  '3. Garantía Estricta de Confidencialidad: Cero almacenamiento de archivos en disco (SOC-2/GDPR en memoria RAM volátil).'
);

// Pie de página
const range = doc.bufferedPageRange();
for (let i = range.start; i < (range.start + range.count); i++) {
  doc.switchToPage(i);
  doc.fontSize(7.5).fillColor('#94a3b8').text(
    `AuditFlow AI Corp. (audiflowai.com) • Plan de Marketing & Operaciones • Página ${i + 1} de ${range.count}`,
    45,
    doc.page.height - 25,
    { align: 'center', width: 505 }
  );
}

doc.end();

writeStream.on('finish', () => {
  console.log(`✅ PDF del Plan de Marketing generado exitosamente en: ${outputPath}`);
});
