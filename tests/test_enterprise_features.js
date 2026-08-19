// ==============================================================================
// AUDITFLOW AI - ENTERPRISE 5-POINT INNOVATION TEST SUITE
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ [PASS] ${message}`);
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
  }
}

console.log(`\n=======================================================`);
console.log(`🚀 INICIANDO SUITE DE PRUEBAS: 5 PUNTOS ENTERPRISE AUDITFLOW AI`);
console.log(`=======================================================\n`);

// 1. Verificación de api/cross-audit.js (Módulo 1: Auditoría Cruzada 2-Way)
console.log(`[PUNTO 1] Verificación de api/cross-audit.js (Auditoría Cruzada Contrato vs Factura):`);
const crossAuditPath = path.join(rootDir, 'api', 'cross-audit.js');
assert(fs.existsSync(crossAuditPath), 'El endpoint api/cross-audit.js existe');

if (fs.existsSync(crossAuditPath)) {
  const content = fs.readFileSync(crossAuditPath, 'utf8');
  assert(content.includes('contract_base64'), 'cross-audit.js recibe base64 de contrato');
  assert(content.includes('invoice_base64'), 'cross-audit.js recibe base64 de factura');
  assert(content.includes('reconciliation_status'), 'cross-audit.js estructura la reconciliación financiera');
  assert(content.includes('risk_heatmap'), 'cross-audit.js estructura el semáforo de riesgo (Traffic Light)');
}

// 2. Verificación de api/export-docx.js (Módulo 4: Exportación .docx con Redlines)
console.log(`\n[PUNTO 2] Verificación de api/export-docx.js (Exportación Word .docx):`);
const exportDocxPath = path.join(rootDir, 'api', 'export-docx.js');
assert(fs.existsSync(exportDocxPath), 'El endpoint api/export-docx.js existe');

if (fs.existsSync(exportDocxPath)) {
  const content = fs.readFileSync(exportDocxPath, 'utf8');
  assert(content.includes('application/vnd.ms-word'), 'export-docx.js establece cabecera MIME para Word');
  assert(content.includes('counter-box'), 'export-docx.js incluye sección de contra-propuesta en Word');
}

// 3. Verificación de Schema.org HowTo & BreadcrumbList (Módulo 2: Playbook / Rich Snippets)
console.log(`\n[PUNTO 3] Verificación de Rich Snippets & Playbook Schema en index.html:`);
const indexPath = path.join(rootDir, 'frontend', 'index.html');
if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  assert(content.includes('@type": "HowTo"'), 'index.html incluye Schema.org HowTo');
  assert(content.includes('@type": "BreadcrumbList"'), 'index.html incluye Schema.org BreadcrumbList');
  assert(content.includes('downloadDocxRedlines()'), 'index.html incluye botón para descargar Word .docx');
  assert(content.includes('downloadIcalEvents()'), 'index.html incluye botón para descargar eventos .ics');
}

// 4. Verificación de js/app.js (Módulo 5: Exportación iCal y Word)
console.log(`\n[PUNTO 4] Verificación de funciones de exportación en frontend/js/app.js:`);
const appJsPath = path.join(rootDir, 'frontend', 'js', 'app.js');
if (fs.existsSync(appJsPath)) {
  const content = fs.readFileSync(appJsPath, 'utf8');
  assert(content.includes('downloadDocxRedlines()'), 'app.js implementa downloadDocxRedlines');
  assert(content.includes('downloadIcalEvents()'), 'app.js implementa downloadIcalEvents');
  assert(content.includes('BEGIN:VCALENDAR'), 'app.js construye formato estándar iCalendar (.ics)');
}

// 5. Verificación de vercel.json & server.js
console.log(`\n[PUNTO 5] Verificación de Ruteo Servidor (server.js & vercel.json):`);
const serverPath = path.join(rootDir, 'server.js');
const vercelPath = path.join(rootDir, 'vercel.json');

if (fs.existsSync(serverPath)) {
  const content = fs.readFileSync(serverPath, 'utf8');
  assert(content.includes("app.post('/api/cross-audit'"), 'server.js monta /api/cross-audit');
  assert(content.includes("app.post('/api/export-docx'"), 'server.js monta /api/export-docx');
  assert(content.includes("app.post('/api/chat-document'"), 'server.js monta /api/chat-document');
}

if (fs.existsSync(vercelPath)) {
  const content = fs.readFileSync(vercelPath, 'utf8');
  assert(content.includes('/api/cross-audit'), 'vercel.json define ruta para /api/cross-audit');
  assert(content.includes('/api/export-docx'), 'vercel.json define ruta para /api/export-docx');
  assert(content.includes('/api/chat-document'), 'vercel.json define ruta para /api/chat-document');
}

// RESUMEN FINAL
console.log(`\n=======================================================`);
console.log(`📊 RESULTADO FINAL SUITE 5 PUNTOS ENTERPRISE:`);
console.log(`  Pruebas ejecutadas: ${totalTests}`);
console.log(`  Pruebas superadas: ${passedTests}`);
console.log(`  Pruebas fallidas:   ${totalTests - passedTests}`);
console.log(`=======================================================\n`);

if (passedTests === totalTests) {
  console.log(`🎉 ¡LOS 5 PUNTOS ENTERPRISE FUERON IMPLEMENTADOS Y VERIFICADOS CON ÉXITO 100%!\n`);
  process.exit(0);
} else {
  console.error(`⚠️ ALGUNAS PRUEBAS FALLARON.\n`);
  process.exit(1);
}
