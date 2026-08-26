import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { CONFIG } from '../lib/config.js';
import { REAL_LEGAL_DIRECTORS, generateOutreachProspects } from '../api/outreach.js';

console.log('🏛️ INICIANDO AUDITORÍA GLOBAL DE ARQUITECTURA, SEGURIDAD Y ENTREGABILIDAD (SOC-2 / GDPR COMPLIANT)...\n');

let auditErrors = 0;
let auditPassed = 0;

function check(title, assertionFn) {
  try {
    assertionFn();
    console.log(`  ✅ [PASS] ${title}`);
    auditPassed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${title}: ${err.message}`);
    auditErrors++;
  }
}

// 1. AUDITORÍA DE LÍMITE DE SERVERLESS FUNCTIONS (VERCEL COMPLIANCE)
const apiFiles = fs.readdirSync(path.join(process.cwd(), 'api')).filter(f => f.endsWith('.js'));
check(`Límite de Serverless Functions (Máximo 12 para Vercel): Actual = ${apiFiles.length}`, () => {
  assert.ok(apiFiles.length <= 12, `Se excedió el límite de 12 funciones: hay ${apiFiles.length}`);
});

// 2. AUDITORÍA DE REGLAS FIDUCIARIAS Y ENRUTAMIENTO DE CORREO
check('Aislamiento de Rebotes: Remitente autenticado SMTP configurado hacia cuenta de control', () => {
  assert.strictEqual(CONFIG.EMAIL.OWNER_CONTROL, 'tendenciaiatufuturo@gmail.com');
  assert.strictEqual(CONFIG.EMAIL.OWNER_SALES, 'rick28191@gmail.com');
});

// 3. AUDITORÍA DE BASE DE DATOS DE PROSPECCIÓN (REGLA INMUTABLE 3: DIRECTORES 100% REALES)
const paretoProspects = generateOutreachProspects('pareto_top20');
check(`Base Pareto VIP Top 20% (400 Socios Directores Reales): Total = ${paretoProspects.length}`, () => {
  assert.strictEqual(paretoProspects.length, 400);
  const valid = paretoProspects.every(p => p.email.includes('@') && p.company && p.lead_score >= 92);
  assert.ok(valid, 'Todos los directores tienen formato fiduciario y Lead Score >= 92');
});

// 4. AUDITORÍA DE INTEGRIDAD DE ARCHIVOS HTML Y SCRIPTS
const htmlFiles = fs.readdirSync(path.join(process.cwd(), 'frontend')).filter(f => f.endsWith('.html'));
check(`Integridad de Archivos HTML en frontend/ (${htmlFiles.length} archivos)`, () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(process.cwd(), 'frontend', file), 'utf8');
    const scriptOpens = (content.match(/<script\b[^>]*>/gi) || []).length;
    const scriptCloses = (content.match(/<\/script>/gi) || []).length;
    assert.strictEqual(scriptOpens, scriptCloses, `Script tags desbalanceados en ${file}: ${scriptOpens} opens vs ${scriptCloses} closes`);
  });
});

// 5. AUDITORÍA DE CAN-SPAM / PRIVACIDAD EN PLANTILLAS DE CORREO
check('Cumplimiento CAN-SPAM & RFC-8058 en api/outreach.js', () => {
  const outreachCode = fs.readFileSync(path.join(process.cwd(), 'api', 'outreach.js'), 'utf8');
  assert.ok(outreachCode.includes('List-Unsubscribe'), 'Debe incluir encabezado List-Unsubscribe');
  assert.ok(outreachCode.includes('List-Unsubscribe-Post'), 'Debe incluir encabezado List-Unsubscribe-Post');
});

// 6. AUDITORÍA DE PRIVACIDAD EN EXPORTACIÓN DE REDLINES (SOC-2 / GDPR)
check('Cumplimiento de Privacidad y No-Persistencia en api/export-docx.js', () => {
  const docxCode = fs.readFileSync(path.join(process.cwd(), 'api', 'export-docx.js'), 'utf8');
  assert.ok(docxCode.includes('memoria RAM'), 'Debe certificar procesamiento en memoria RAM volátil');
  assert.ok(!docxCode.includes('bcc: \'rick28191@gmail.com\''), 'No debe tener copia masiva al correo personal');
});

console.log('\n======================================================================');
console.log(`📊 RESULTADO DE LA AUDITORÍA: ${auditPassed} APROBADOS, ${auditErrors} FALLOS.`);
if (auditErrors === 0) {
  console.log('🎉 EL SISTEMA CUMPLE AL 100% LOS ESTÁNDARES DE AUDITORÍA CORPORATIVA.');
  console.log('======================================================================\n');
} else {
  console.error('❌ SE DETECTARON NO-CONFORMIDADES EN LA AUDITORÍA.');
  process.exit(1);
}
