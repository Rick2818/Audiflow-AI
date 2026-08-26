import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';

console.log('📄 Generando Documento PDF: Prompt Maestro de AuditFlow AI...');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  info: {
    Title: 'AuditFlow AI — Prompt Maestro & Master System Blueprint',
    Author: 'AuditFlow AI Engineering',
    Subject: 'Directivas Fiduciarias, Reglas Inmutables y Arquitectura Operativa',
    Keywords: 'AuditFlow, Prompt Maestro, Legal AI, B2B Micro-SaaS'
  }
});

const outputPath = path.join(process.cwd(), 'frontend', 'Prompt_Maestro_AuditFlow_AI.pdf');
const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Leer contenido de MASTER_PROMPT_BLUEPRINT.md y rules.md
const blueprintContent = fs.readFileSync(path.join(process.cwd(), 'MASTER_PROMPT_BLUEPRINT.md'), 'utf8');
const rulesContent = fs.readFileSync(path.join(process.cwd(), '.gemini', 'rules.md'), 'utf8');

// --- PORTADA / CABECERA OFICIAL ---
doc.rect(40, 35, 515, 60).fill('#0f172a');
doc.fillColor('#38bdf8').fontSize(20).font('Helvetica-Bold').text('AUDITFLOW AI CORP.', 55, 48);
doc.fillColor('#ffffff').fontSize(11).font('Helvetica').text('PROMPT MAESTRO • MASTER SYSTEM BLUEPRINT & FIDUCIARY RULES', 55, 72);

doc.moveDown(3);
doc.fillColor('#0f172a').fontSize(16).font('Helvetica-Bold').text('1. REGLAS FIDUCIARIAS & DE ARQUITECTURA (SSOT)', 45, 115);
doc.rect(45, 135, 505, 2).fill('#2563eb');

doc.moveDown(1.5);
doc.fillColor('#334155').fontSize(9.5).font('Helvetica').lineGap(2);

// Limpiar y formatear las reglas
const linesRules = rulesContent.split('\n');
for (const line of linesRules) {
  if (line.startsWith('# ')) continue;
  if (line.startsWith('## ')) {
    doc.moveDown(0.6);
    doc.fillColor('#1e40af').fontSize(11).font('Helvetica-Bold').text(line.replace('## ', ''));
    doc.fillColor('#334155').fontSize(9).font('Helvetica');
  } else if (line.startsWith('- **') || line.startsWith('  - **')) {
    doc.fillColor('#0f172a').font('Helvetica-Bold').text('• ' + line.replace(/^[\s\-*]+/, '').replace(/\*\*/g, ''));
  } else if (line.trim().length > 0) {
    doc.fillColor('#475569').font('Helvetica').text(line);
  }
}

// --- SECCIÓN 2: MASTER PROMPT BLUEPRINT ---
doc.addPage();
doc.rect(40, 35, 515, 45).fill('#1e293b');
doc.fillColor('#38bdf8').fontSize(14).font('Helvetica-Bold').text('2. DIRECTIVAS DEL MASTER PROMPT & CADENCIAS', 55, 48);
doc.fillColor('#94a3b8').fontSize(9).font('Helvetica').text('Configuración de Prospección B2B, Fricción Cero y Entregabilidad', 55, 64);

doc.moveDown(2);
doc.fillColor('#334155').fontSize(9).font('Helvetica').lineGap(2);

const linesBlueprint = blueprintContent.split('\n');
for (const line of linesBlueprint) {
  if (line.startsWith('# ')) continue;
  if (line.startsWith('## ')) {
    doc.moveDown(0.8);
    doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text(line.replace('## ', ''));
    doc.fillColor('#334155').fontSize(8.5).font('Helvetica');
  } else if (line.startsWith('### ')) {
    doc.moveDown(0.5);
    doc.fillColor('#2563eb').fontSize(9.5).font('Helvetica-Bold').text(line.replace('### ', ''));
    doc.fillColor('#334155').fontSize(8.5).font('Helvetica');
  } else if (line.startsWith('- ') || line.startsWith('* ')) {
    doc.fillColor('#1e293b').font('Helvetica').text('  • ' + line.replace(/^[\s\-*]+/, '').replace(/\*\*/g, ''));
  } else if (line.trim().length > 0) {
    doc.fillColor('#475569').font('Helvetica').text(line.replace(/\*\*/g, ''));
  }
}

// Pie de página en todas las páginas
const range = doc.bufferedPageRange();
for (let i = range.start; i < (range.start + range.count); i++) {
  doc.switchToPage(i);
  doc.fontSize(7.5).fillColor('#94a3b8').text(
    `AuditFlow AI Corp. (audiflowai.com) • Documento Fiduciario Confidencial • Página ${i + 1} de ${range.count}`,
    45,
    doc.page.height - 30,
    { align: 'center', width: 505 }
  );
}

doc.end();

writeStream.on('finish', () => {
  console.log(`✅ PDF generado exitosamente en: ${outputPath}`);
});
