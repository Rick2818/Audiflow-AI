import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

const pdfPathArtifact = 'C:\\Users\\Ricardo\\.gemini\\antigravity\\brain\\1b74fe70-ca6a-4d85-8c65-a075df1bb7a1\\MASTER_PROMPT_BLUEPRINT.pdf';
const pdfPathWorkspace = 'c:\\Users\\Ricardo\\Desktop\\Audiflow Ai\\MASTER_PROMPT_BLUEPRINT.pdf';
const markdownPath = path.join(process.cwd(), 'MASTER_PROMPT_BLUEPRINT.md');

const mdText = fs.readFileSync(markdownPath, 'utf8');

function createPdf(outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Header Branding
    doc.rect(0, 0, doc.page.width, 60).fill('#0b0f19');
    doc.fillColor('#10b981').fontSize(16).text('AuditFlow AI — Master Prompt Blueprint 2.0', 40, 20, { bold: true });
    doc.fillColor('#9ca3af').fontSize(9).text('Fábrica de MicroSaaS B2B de Alta Conversión • Documento Oficial', 40, 42);

    doc.moveDown(3);
    doc.fillColor('#111827');

    const lines = mdText.split('\n');
    lines.forEach(line => {
      if (line.startsWith('# ')) {
        doc.moveDown(0.8);
        doc.fillColor('#047857').fontSize(15).text(line.replace('# ', ''), { bold: true });
      } else if (line.startsWith('## ')) {
        doc.moveDown(0.6);
        doc.fillColor('#065f46').fontSize(12).text(line.replace('## ', ''), { bold: true });
      } else if (line.startsWith('### ')) {
        doc.moveDown(0.4);
        doc.fillColor('#1e293b').fontSize(10.5).text(line.replace('### ', ''), { bold: true });
      } else if (line.startsWith('=')) {
        doc.moveDown(0.3);
        doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(40, doc.y).lineTo(doc.page.width - 40, doc.y).stroke();
        doc.moveDown(0.3);
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        doc.fillColor('#334155').fontSize(9).text('• ' + line.substring(2), { indent: 15 });
      } else if (line.trim().length > 0) {
        doc.fillColor('#1e293b').fontSize(9).text(line);
      } else {
        doc.moveDown(0.2);
      }
    });

    // Footer final
    doc.moveDown(1);
    doc.fillColor('#9ca3af').fontSize(8).text('AuditFlow AI Enterprise Blueprint • Documento de Arquitectura y Marketing B2B 2.0', { align: 'center' });

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function run() {
  await createPdf(pdfPathArtifact);
  await createPdf(pdfPathWorkspace);
  console.log('PDFs generated successfully!');
}

run();
