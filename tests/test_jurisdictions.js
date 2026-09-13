// ==============================================================================
// AUDITFLOW AI - MULTI-JURISDICTIONAL LEGAL FIDUCIARY TEST SUITE
// ==============================================================================
// Verifica que todos los marcos legales civiles, comerciales y de privacidad
// (El Salvador, Guatemala, Costa Rica, Panamá, Honduras, Suecia, Noruega,
// Dinamarca, Finlandia, Alemania y Global) estén rigurosamente integrados.
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  LEGAL_JURISDICTIONS, 
  resolveJurisdiction, 
  getLegalNoticeForOutbound, 
  buildAiJurisdictionPrompt 
} from '../lib/legal-jurisdictions.js';

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
console.log(`⚖️ INICIANDO SUITE DE BLINDAJE MULTI-JURISDICCIONAL LEGAL`);
console.log(`=======================================================\n`);

// GRUPO 1: Resolución de Países y Leyes Reales
console.log(`[GRUPO 1] Mapeo Fiduciario de Códigos Comerciales y Leyes Civiles:`);

// 1.1 El Salvador
const sv = resolveJurisdiction('El Salvador');
assert(sv.id === 'sv', 'El Salvador resuelve ID sv');
assert(sv.commercialCode.includes('Código de Comercio de El Salvador'), 'SV cita Código de Comercio de El Salvador');
assert(sv.commercialArticles.includes('Arts. 945 y ss.'), 'SV cita Arts. 945 y ss.');
assert(sv.consumerLaw.includes('Art. 17'), 'SV cita Ley de Protección al Consumidor Art. 17');

// 1.2 Guatemala
const gt = resolveJurisdiction('Guatemala');
assert(gt.id === 'gt', 'Guatemala resuelve ID gt');
assert(gt.commercialCode.includes('Decreto 2-70'), 'GT cita Decreto 2-70 del Congreso');
assert(gt.commercialArticles.includes('Art. 688'), 'GT cita Art. 688 sobre teoría de la imprevisión');

// 1.3 Costa Rica
const cr = resolveJurisdiction('Costa Rica');
assert(cr.id === 'cr', 'Costa Rica resuelve ID cr');
assert(cr.commercialCode.includes('Ley N° 3284'), 'CR cita Ley N° 3284');
assert(cr.consumerLaw.includes('Ley N° 7472') && cr.consumerLaw.includes('Art. 42'), 'CR cita Ley 7472 Art. 42');

// 1.4 Panamá
const pa = resolveJurisdiction('Panamá');
assert(pa.id === 'pa', 'Panamá resuelve ID pa');
assert(pa.consumerLaw.includes('Ley 45 de 31 de octubre de 2007'), 'PA cita Ley 45 de 2007 (ACODECO)');

// 1.5 Honduras
const hn = resolveJurisdiction('Honduras');
assert(hn.id === 'hn', 'Honduras resuelve ID hn');
assert(hn.commercialCode.includes('Decreto N° 73-1950'), 'HN cita Decreto 73-1950');

// GRUPO 2: Cuidado Especial Nórdico (Avtalslagen § 36 & EU GDPR Art. 28)
console.log(`\n[GRUPO 2] Región Nórdica (Suecia, Noruega, Dinamarca, Finlandia):`);

// 2.1 Suecia
const se = resolveJurisdiction('Sweden');
assert(se.id === 'se', 'Suecia resuelve ID se');
assert(se.commercialCode.includes('Avtalslagen') && se.commercialCode.includes('Lag 1915:218'), 'Suecia cita Avtalslagen Lag 1915:218');
assert(se.commercialArticles.includes('§ 36 Avtalslagen'), 'Suecia cita expresamente § 36 Avtalslagen (cláusula general de estipulaciones abusivas)');
assert(se.privacyStandard.includes('EU GDPR') && se.privacyStandard.includes('Article 28'), 'Suecia garantiza EU GDPR Art. 28 en RAM');

// 2.2 Noruega
const no = resolveJurisdiction('Norway');
assert(no.id === 'no', 'Noruega resuelve ID no');
assert(no.commercialArticles.includes('§ 36 Avtaleloven'), 'Noruega cita § 36 Avtaleloven');

// 2.3 Dinamarca
const dk = resolveJurisdiction('Denmark');
assert(dk.id === 'dk', 'Dinamarca resuelve ID dk');
assert(dk.commercialArticles.includes('§ 36 Aftaleloven'), 'Dinamarca cita § 36 Aftaleloven');

// 2.4 Finlandia
const fi = resolveJurisdiction('Finland');
assert(fi.id === 'fi', 'Finlandia resuelve ID fi');
assert(fi.commercialArticles.includes('36 § Oikeustoimilaki'), 'Finlandia cita 36 § Oikeustoimilaki');

// 2.5 Alemania / DACH
const de = resolveJurisdiction('Germany');
assert(de.id === 'de', 'Alemania resuelve ID de');
assert(de.commercialArticles.includes('§§ 305–310 BGB'), 'Alemania cita §§ 305–310 BGB (AGB-Recht)');

// GRUPO 3: Prompts de Inteligencia Artificial Dinámicos
console.log(`\n[GRUPO 3] Ensamble de Prompt IA con Marco Legal Local:`);
const promptSV = buildAiJurisdictionPrompt('sv', 'Contrato_SV.pdf', 'buyer');
assert(promptSV.includes('Código de Comercio de El Salvador'), 'Prompt SV incluye Código de Comercio de El Salvador');
assert(promptSV.includes('jurisdiction_applied'), 'Prompt SV instruye respuesta con jurisdiction_applied');

const promptSE = buildAiJurisdictionPrompt('se', 'Agreement_Sweden.pdf', 'buyer');
assert(promptSE.includes('Avtalslagen'), 'Prompt SE incluye Avtalslagen');
assert(promptSE.includes('§ 36'), 'Prompt SE incluye § 36');
assert(promptSE.includes('EU GDPR Art. 28'), 'Prompt SE incluye garantía de GDPR Art. 28');

// GRUPO 4: Avisos Fiduciarios en Outbound Emails
console.log(`\n[GRUPO 4] Cajas de Notificación Legal en Prospección Outbound:`);
const noticeSV = getLegalNoticeForOutbound({ country: 'El Salvador' }, 'es');
assert(noticeSV.includes('Blindaje Legal Bajo Normas Civiles y Comerciales de El Salvador'), 'Aviso SV generado en español');
assert(noticeSV.includes('Código de Comercio de El Salvador'), 'Aviso SV cita Código de Comercio');

const noticeSE = getLegalNoticeForOutbound({ country: 'Sweden' }, 'nordic');
assert(noticeSE.includes('Fiduciary Governance under Sweden Law'), 'Aviso Nórdico generado en inglés/nórdico');
assert(noticeSE.includes('Avtalslagen'), 'Aviso Nórdico cita Avtalslagen');
assert(noticeSE.includes('Zero Data Retention') && noticeSE.includes('volatile RAM'), 'Aviso Nórdico declara RAM volátil');

// GRUPO 5: Integración en Archivos del Sistema
console.log(`\n[GRUPO 5] Verificación de Integración en el Servidor y la Interfaz:`);

const auditApiPath = path.join(rootDir, 'api', 'audit.js');
const serverPath = path.join(rootDir, 'server.js');
const cronPath = path.join(rootDir, 'scripts', 'dispatch_centroamerica_8am_cron.mjs');
const outreachPath = path.join(rootDir, 'api', 'outreach.js');
const frontendIndexPath = path.join(rootDir, 'frontend', 'index.html');
const rootIndexPath = path.join(rootDir, 'index.html');
const appJsPath = path.join(rootDir, 'frontend', 'js', 'app.js');

if (fs.existsSync(auditApiPath)) {
  const c = fs.readFileSync(auditApiPath, 'utf8');
  assert(c.includes('buildAiJurisdictionPrompt'), 'api/audit.js usa buildAiJurisdictionPrompt');
  assert(c.includes('jurisdiction_applied'), 'api/audit.js retorna jurisdiction_applied');
}

if (fs.existsSync(serverPath)) {
  const c = fs.readFileSync(serverPath, 'utf8');
  assert(c.includes('buildAiJurisdictionPrompt'), 'server.js usa buildAiJurisdictionPrompt');
  assert(c.includes('jurisdiction_applied'), 'server.js retorna jurisdiction_applied');
}

if (fs.existsSync(cronPath)) {
  const c = fs.readFileSync(cronPath, 'utf8');
  assert(c.includes('getLegalNoticeForOutbound'), 'scripts/dispatch_centroamerica_8am_cron.mjs inyecta legalNoticeHtml');
}

if (fs.existsSync(outreachPath)) {
  const c = fs.readFileSync(outreachPath, 'utf8');
  assert(c.includes('getLegalNoticeForOutbound'), 'api/outreach.js usa getLegalNoticeForOutbound');
  assert(c.includes('§ 36 on unfair contract terms'), 'api/outreach.js cita § 36 en plantilla nórdica');
}

if (fs.existsSync(frontendIndexPath)) {
  const c = fs.readFileSync(frontendIndexPath, 'utf8');
  assert(c.includes('id="jurisdiction-select"'), 'frontend/index.html incluye selector de jurisdicción');
  assert(c.includes('id="rep-jurisdiction-badge"'), 'frontend/index.html incluye rep-jurisdiction-badge');
}

if (fs.existsSync(rootIndexPath)) {
  const c = fs.readFileSync(rootIndexPath, 'utf8');
  assert(c.includes('id="jurisdiction-select"'), 'root index.html incluye selector de jurisdicción');
  assert(c.includes('id="rep-jurisdiction-badge"'), 'root index.html incluye rep-jurisdiction-badge');
}

if (fs.existsSync(appJsPath)) {
  const c = fs.readFileSync(appJsPath, 'utf8');
  assert(c.includes('onJurisdictionChanged'), 'frontend/js/app.js maneja onJurisdictionChanged');
  assert(c.includes('rep-jurisdiction-badge'), 'frontend/js/app.js actualiza rep-jurisdiction-badge');
}

console.log(`\n=======================================================`);
console.log(`📊 RESULTADOS:`);
console.log(`  Total de pruebas: ${totalTests}`);
console.log(`  Pruebas superadas: ${passedTests}`);
console.log(`  Pruebas fallidas:  ${totalTests - passedTests}`);
console.log(`=======================================================\n`);

if (passedTests === totalTests) {
  console.log(`🎉 ¡100% DE PRUEBAS MULTI-JURISDICCIONALES Y FIDUCIARIAS SUPERADAS CON ÉXITO!\n`);
  process.exit(0);
} else {
  console.error(`⚠️ ALGUNAS PRUEBAS FALLARON.`);
  process.exit(1);
}
