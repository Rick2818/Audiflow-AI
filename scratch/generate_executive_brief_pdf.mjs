import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

console.log('📄 Generando Documento PDF: Executive Brief & Plan Estratégico de AuditFlow AI...');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  info: {
    Title: 'AuditFlow AI Corp. — Executive Brief & Estrategia Integral B2B',
    Author: 'Ricardo • Fundador & CEO, AuditFlow AI Corp.',
    Subject: 'Definición de Empresa, Propuesta de Valor, Precios, Dolores, Mercadeo y Matriz FODA',
    Keywords: 'AuditFlow AI, Executive Brief, LegalTech, FODA, B2B Micro-SaaS'
  }
});

const outputPath = path.join(process.cwd(), 'frontend', 'Executive_Brief_AuditFlow_AI.pdf');
const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// --- COLORES CORPORATIVOS ---
const C_DARK = '#0f172a';
const C_NAVY = '#1e3a8a';
const C_BLUE = '#2563eb';
const C_EMERALD = '#059669';
const C_GRAY_TEXT = '#334155';
const C_MUTED = '#64748b';
const C_LIGHT_BG = '#f8fafc';

// ==========================================
// PÁGINA 1: PORTADA EJECUTIVA & IDENTIDAD
// ==========================================
doc.rect(40, 35, 515, 75).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(22).font('Helvetica-Bold').text('AUDITFLOW AI CORP.', 55, 50);
doc.fillColor('#ffffff').fontSize(11).font('Helvetica').text('EXECUTIVE BRIEF • DEFINICIÓN CORPORATIVA, VALOR Y ESTRATEGIA INTEGRAL', 55, 75);
doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text('URL Oficial: audiflowai.com • Dirección Ejecutiva: Ricardo (Fundador & CEO)', 55, 90);

doc.moveDown(3.5);

// 1. ¿QUÉ ES AUDITFLOW AI?
doc.fillColor(C_NAVY).fontSize(14).font('Helvetica-Bold').text('1. ¿QUÉ ES AUDITFLOW AI Y LA EMPRESA?');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_BLUE);
doc.moveDown(0.6);

doc.fillColor(C_GRAY_TEXT).fontSize(9.5).font('Helvetica').lineGap(2.5);
doc.text(
  'AuditFlow AI (audiflowai.com) es una empresa de tecnología LegalTech y Micro-SaaS B2B de alto rendimiento especializada en Inteligencia Artificial Forense para la auditoría, detección de riesgos y renegociación contractual de contratos mercantiles y facturas de proveedores en menos de 10 segundos.\n\n' +
  'Fundada y dirigida por Ricardo (Fundador & CEO), la compañía opera bajo una arquitectura de Cero Fricción y Privacidad Estricta en memoria RAM volátil (conforme a normativas internacionales SOC-2 y GDPR), permitiendo a las empresas auditar documentos confidenciales con cero almacenamiento en disco.'
);

doc.moveDown(0.8);

// 2. ¿QUÉ HACE Y PARA QUÉ SIRVE?
doc.fillColor(C_NAVY).fontSize(14).font('Helvetica-Bold').text('2. ¿QUÉ HACE Y PARA QUÉ SIRVE?');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_BLUE);
doc.moveDown(0.6);

doc.fillColor(C_GRAY_TEXT).fontSize(9.5).font('Helvetica').lineGap(2.5);
doc.text(
  '• Qué Hace: Procesa contratos de servicios B2B, arrendamientos comerciales, SLAs tecnológicos y facturas. Identifica penalizaciones ocultas, renovaciones automáticas forzosas, cláusulas leoninas e indexaciones de precio no topadas.\n' +
  '• Entregable Estrella (Redline en Word): Genera automáticamente un archivo Word (.docx) con Control de Cambios nativo (cláusulas desproporcionadas tachadas en rojo y contrapropuestas blindadas redactadas en verde listas para enviar al proveedor).\n' +
  '• Para Qué Sirve: Sirve como escudo fiduciario para que las empresas nunca firmen contratos con desventaja legal ni paguen sobrecostos no pactados, reduciendo semanas de revisión legal a solo 10 segundos.'
);

doc.moveDown(0.8);

// 3. ¿QUIÉN LO MANEJA?
doc.fillColor(C_NAVY).fontSize(14).font('Helvetica-Bold').text('3. GOBERNANZA Y QUIÉN LO MANEJA');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_BLUE);
doc.moveDown(0.6);

doc.fillColor(C_GRAY_TEXT).fontSize(9.5).font('Helvetica').lineGap(2.5);
doc.text(
  '• Fundador & CEO: Ricardo (ricardo@audiflowai.com) — Lidera la visión del producto, la relación con clientes y la dirección estratégica.\n' +
  '• Arquitectura de Software e IA: Antigravity AI Engineering — Infraestructura serverless de alta disponibilidad, motores de lenguaje Gemini Flash y tuberías de cifrado en memoria volátil.\n' +
  '• Operación y Soporte 24/7: Sistema automatizado de auto-respuesta y atención fiduciaria con respaldo permanente.'
);

// ==========================================
// PÁGINA 2: VALOR, DOLORES Y PRECIOS
// ==========================================
doc.addPage();
doc.rect(40, 35, 515, 45).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(14).font('Helvetica-Bold').text('4. ESTRUCTURA DE PRECIOS & DOLORES QUE ELIMINA', 55, 48);
doc.fillColor('#ffffff').fontSize(9).font('Helvetica').text('Modelo Comercial de Fricción Cero y Retorno de Inversión Inmediato', 55, 64);

doc.moveDown(2.5);

// 4. PRECIOS Y MODELO
doc.fillColor(C_NAVY).fontSize(13).font('Helvetica-Bold').text('ESTRUCTURA DE PRECIOS TRANSPARENTE:');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_EMERALD);
doc.moveDown(0.6);

doc.fillColor(C_GRAY_TEXT).fontSize(9.5).font('Helvetica').lineGap(3);
doc.text(
  '1. 🎁 1er Diagnóstico Forense: 100% Gratis en 10s en memoria RAM (sin tarjeta ni registro invasivo).\n' +
  '2. ⚡ Oferta Redline Flash Individual: $19.00 USD por contrato completo auditado con descarga en Word (.docx con control de cambios) y playbook de contrapropuesta.\n' +
  '3. 💼 Plan Pro Mensual: $69.00 USD/mes con auditorías y redlines ilimitados para empresas y despachos.\n' +
  '4. 🏛️ Licencia Corporativa Anual: $599.00 USD/año con Marca Blanca para firmas legales y consultoras.\n' +
  '• Pasarelas Habilitadas: Wompi (Banco Agrícola / Bancolombia), Bitcoin Lightning (rick28@strike.me) y Stripe.'
);

doc.moveDown(0.8);

// 5. DOLORES QUE ELIMINA
doc.fillColor(C_NAVY).fontSize(13).font('Helvetica-Bold').text('DOLORES CRÍTICOS QUE ELIMINA AL CLIENTE:');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_BLUE);
doc.moveDown(0.6);

doc.fillColor(C_GRAY_TEXT).fontSize(9.5).font('Helvetica').lineGap(2.5);
doc.text(
  '• ❌ Dolor 1: Semanas de retraso en firmas esperando que el equipo legal revise 40 páginas.\n' +
  '  👉 Solución AuditFlow: Diagnóstico exhaustivo y detección de trampas en menos de 10 segundos.\n\n' +
  '• ❌ Dolor 2: Fuga de capital por renovaciones automáticas forzosas e incrementos tarifarios abusivos.\n' +
  '  👉 Solución AuditFlow: Redacción de cláusula de tope inflacionario (IPC + 3% máx.) y salida libre.\n\n' +
  '• ❌ Dolor 3: Miedo a subir información confidencial a la nube de terceros.\n' +
  '  👉 Solución AuditFlow: Cero persistencia en disco. El archivo se audita en memoria RAM y se autodestruye al terminar la sesión.'
);

doc.moveDown(0.8);

// 6. PLAN DE MERCADEO
doc.fillColor(C_NAVY).fontSize(13).font('Helvetica-Bold').text('PLAN DE MERCADEO & GO-TO-MARKET (PLG):');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_BLUE);
doc.moveDown(0.6);

doc.fillColor(C_GRAY_TEXT).fontSize(9.5).font('Helvetica').lineGap(2.5);
doc.text(
  '• Estrategia de Fricción Cero: Prueba de valor inmediata antes de solicitar cualquier pago.\n' +
  '• Outbound Quirúrgico B2B: Prospección directa a 2,000 Directores Legales y Socios de firmas reales.\n' +
  '• Omnicanalidad LinkedIn / Waalaxy: Webhooks 24/7 que despachan el Redline en Word al interactuar.\n' +
  '• Bucle Viral PLG (Product-Led Growth): Sistema de invitación de colegas y abogados asesores con regalo de créditos de auditoría mutuos.'
);

// ==========================================
// PÁGINA 3: MATRIZ FODA & BENEFICIOS
// ==========================================
doc.addPage();
doc.rect(40, 35, 515, 45).fill(C_DARK);
doc.fillColor('#38bdf8').fontSize(14).font('Helvetica-Bold').text('5. ANÁLISIS ESTRATÉGICO FODA (SWOT) & BENEFICIOS', 55, 48);
doc.fillColor('#ffffff').fontSize(9).font('Helvetica').text('Evaluación Integral de Competitividad, Riesgos y Oportunidades de Mercado', 55, 64);

doc.moveDown(2.2);

// BENEFICIOS
doc.fillColor(C_NAVY).fontSize(12).font('Helvetica-Bold').text('BENEFICIOS CLAVE DEL SISTEMA:');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_EMERALD);
doc.moveDown(0.5);

doc.fillColor(C_GRAY_TEXT).fontSize(9).font('Helvetica').lineGap(2);
doc.text(
  '• Ahorro de Tiempo (>95%): De 4-6 horas de lectura legal a 10 segundos.\n' +
  '• Retorno de Inversión Inmediato: Una sola penalización evitada ahorra entre $2,000 y $50,000 USD.\n' +
  '• Autonomía en Negociación: Genera el Word (.docx) listo para reenviar al proveedor.'
);

doc.moveDown(0.8);

// MATRIZ FODA
doc.fillColor(C_NAVY).fontSize(12).font('Helvetica-Bold').text('MATRIZ ESTRATÉGICA FODA / SWOT:');
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_BLUE);
doc.moveDown(0.6);

// FORTALEZAS
doc.fillColor('#166534').fontSize(10).font('Helvetica-Bold').text('💪 FORTALEZAS (STRENGTHS):');
doc.fillColor(C_GRAY_TEXT).fontSize(8.5).font('Helvetica').lineGap(2);
doc.text(
  '• Velocidad ultra-rápida (<10s) con modelos optimizados de IA.\n' +
  '• Exportación nativa a Word con marcas de revisión aceptadas universalmente por la industria legal.\n' +
  '• Privacidad fiduciaria certificada (RAM volátil, 0 persistencia en disco, SOC-2/GDPR).\n' +
  '• Pasarelas de cobro híbridas (Banca Local El Salvador Wompi + Bitcoin Lightning + Stripe).'
);

doc.moveDown(0.5);

// DEBILIDADES
doc.fillColor('#b45309').fontSize(10).font('Helvetica-Bold').text('⚠️ DEBILIDADES (WEAKNESSES):');
doc.fillColor(C_GRAY_TEXT).fontSize(8.5).font('Helvetica').lineGap(2);
doc.text(
  '• Marca emergente compitiendo con consultoras y firmas tradicionales de prestigio.\n' +
  '• Equipo fundador compacto (mitigado mediante infraestructura 100% automatizada 24/7).\n' +
  '• Dependencia de la adopción digital por parte de abogados conservadores de firmas tradicionales.'
);

doc.moveDown(0.5);

// OPORTUNIDADES
doc.fillColor('#1d4ed8').fontSize(10).font('Helvetica-Bold').text('🚀 OPORTUNIDADES (OPPORTUNITIES):');
doc.fillColor(C_GRAY_TEXT).fontSize(8.5).font('Helvetica').lineGap(2);
doc.text(
  '• Mercado masivo desatendido de PyMEs y firmas medianas en El Salvador, Centroamérica, Latam y US Hispanic.\n' +
  '• Alianzas institucionales de Marca Blanca ($599/año) con cámaras de comercio y despachos corporativos.\n' +
  '• Creciente presión corporativa por reducir costos legales externos usando IA ética y confidencial.'
);

doc.moveDown(0.5);

// AMENAZAS
doc.fillColor('#991b1b').fontSize(10).font('Helvetica-Bold').text('🛡️ AMENAZAS (THREATS) Y MITIGACIÓN:');
doc.fillColor(C_GRAY_TEXT).fontSize(8.5).font('Helvetica').lineGap(2);
doc.text(
  '• Competencia de herramientas genéricas de IA (ChatGPT, Claude) -> Mitigación: AuditFlow AI genera Redlines en Word con control de cambios legal específico, no texto plano genérico.\n' +
  '• Cambios en regulaciones de entregabilidad de email (SPF/DKIM/DMARC) -> Mitigación: Cadencias de goteo seguro (25 correos/sesión) y aislamiento total de rebotes.'
);

// Pie de página en todas las páginas
const range = doc.bufferedPageRange();
for (let i = range.start; i < (range.start + range.count); i++) {
  doc.switchToPage(i);
  doc.fontSize(7.5).fillColor('#94a3b8').text(
    `AuditFlow AI Corp. (audiflowai.com) • Documento Estratégico Oficial • Página ${i + 1} de ${range.count}`,
    45,
    doc.page.height - 25,
    { align: 'center', width: 505 }
  );
}

doc.end();

writeStream.on('finish', () => {
  console.log(`✅ PDF Ejecutivo generado exitosamente en: ${outputPath}`);
});
