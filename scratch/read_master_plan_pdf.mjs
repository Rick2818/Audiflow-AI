import fs from 'node:fs';
import pdf from 'pdf-parse';

const pdfPath = 'c:\\Users\\Ricardo\\Desktop\\Agents\\AuditFlow_AI_Operational_Master_Plan.pdf';

console.log(`🔍 Leyendo PDF en: ${pdfPath} ...`);

if (!fs.existsSync(pdfPath)) {
  console.error(`❌ El archivo no existe en: ${pdfPath}`);
  process.exit(1);
}

const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(data => {
  console.log(`📄 Total de Páginas: ${data.numpages}`);
  console.log('\n--- CONTENIDO EXTRAÍDO DEL PDF MASTER PLAN ---\n');
  console.log(data.text);
  console.log('\n--- FIN DEL CONTENIDO ---');
}).catch(err => {
  console.error('❌ Error leyendo PDF:', err);
});
