import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, '../frontend');

console.log('🔍 Iniciando Auditoría de Integridad HTML, Sintaxis JS y Diseño Dark Mode...\n');

const htmlFiles = fs.readdirSync(frontendDir).filter(f => f.endsWith('.html') && !f.startsWith('google'));
let hasErrors = false;

for (const file of htmlFiles) {
  const filePath = path.join(frontendDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  const scriptOpens = (content.match(/<script\b[^>]*>/gi) || []).length;
  const scriptCloses = (content.match(/<\/script>/gi) || []).length;

  const styleOpens = (content.match(/<style\b[^>]*>/gi) || []).length;
  const styleCloses = (content.match(/<\/style>/gi) || []).length;

  const htmlOpens = (content.match(/<html\b[^>]*>/gi) || []).length;
  const htmlCloses = (content.match(/<\/html>/gi) || []).length;

  const bodyOpens = (content.match(/<body\b[^>]*>/gi) || []).length;
  const bodyCloses = (content.match(/<\/body>/gi) || []).length;

  const hasDarkClass = content.includes('dark') || content.includes('color-scheme: dark');
  const hasDarkBg = content.includes('bg-dark') || content.includes('#09090b') || content.includes('#0B0F19');

  console.log(`📄 ${file}:`);
  console.log(`   - Scripts: ${scriptOpens} opens / ${scriptCloses} closes ${scriptOpens === scriptCloses ? '✅' : '❌'}`);
  console.log(`   - Styles: ${styleOpens} opens / ${styleCloses} closes ${styleOpens === styleCloses ? '✅' : '❌'}`);
  console.log(`   - Dark Scheme Config: ${hasDarkClass && hasDarkBg ? '✅' : '❌'}`);

  if (scriptOpens !== scriptCloses || styleOpens !== styleCloses || htmlOpens !== htmlCloses || bodyOpens !== bodyCloses) {
    console.error(`   🚨 ERROR CRÍTICO: Desbalance de etiquetas en ${file}`);
    hasErrors = true;
  }

  // Validación de Sintaxis JavaScript (omitiendo JSON-LD / schemas de SEO)
  const scriptMatches = [...content.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  scriptMatches.forEach((m, idx) => {
    const attrs = m[1].toLowerCase();
    const scriptCode = m[2].trim();
    if (!scriptCode || attrs.includes('src=') || attrs.includes('application/ld+json') || attrs.includes('type="application/json"')) return;
    try {
      new Function(scriptCode);
      console.log(`   - Script JS #${idx + 1}: Sintaxis Válida ✅`);
    } catch (jsErr) {
      console.error(`   🚨 ERROR DE SINTAXIS JS en ${file} (Script #${idx + 1}):`, jsErr.message);
      hasErrors = true;
    }
  });
}

if (hasErrors) {
  console.error('\n❌ La auditoría de integridad HTML y Sintaxis JS falló.');
  process.exit(1);
} else {
  console.log('\n🎉 100% DE LOS ARCHIVOS HTML Y SCRIPTS TIENEN ESTRUCTURA Y SINTAXIS BLINDADAS.');
}
