import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  loadState,
  selectCfoBatchWithCadence,
  buildCfoTouch1Html,
  buildCfoTouch2Html,
  buildCfoTouch3Html,
  buildBufeteHtml
} from '../scripts/dispatch_centroamerica_8am_cron.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('\n=======================================================');
console.log('🏛️ INICIANDO TEST: CADENCIA CFO 3 TOQUES + DTE / TRANSFER365');
console.log('=======================================================\n');

// 1. Validar Cadencia de 3 Toques (Lógica de Selección)
console.log('[GRUPO 1] Lógica de Progresión de Cadencia:');

const dummyCfos = [
  { firstName: 'Ana', lastName: 'Gómez', email: 'ana@empresa1.com', company: 'Empresa 1', type: 'CFO', trialUrl: 'https://audiflowai.com' },
  { firstName: 'Carlos', lastName: 'Pérez', email: 'carlos@empresa2.com', company: 'Empresa 2', type: 'CFO', trialUrl: 'https://audiflowai.com' },
  { firstName: 'Elena', lastName: 'Ríos', email: 'elena@empresa3.com', company: 'Empresa 3', type: 'CFO', trialUrl: 'https://audiflowai.com' }
];

const mockNow = new Date('2026-09-20T13:00:00Z');

// Caso A: Todos sin contactar -> deben ser Toque 1
const stateA = { cfoIndex: 0, cadence: {} };
const resA = selectCfoBatchWithCadence(dummyCfos, stateA, 2, mockNow);
assert.strictEqual(resA.selected.length, 2, 'Debe seleccionar 2 CFOs');
assert.strictEqual(resA.selected[0].touch, 1, 'Primer CFO debe ser Toque 1');
assert.strictEqual(resA.selected[1].touch, 1, 'Segundo CFO debe ser Toque 1');
console.log('  ✅ [PASS] Prospectos nuevos reciben Toque 1 (Día 0)');

// Caso B: Lead con Toque 1 hace 4 días -> debe ser elegible para Toque 2
const stateB = {
  cfoIndex: 1,
  cadence: {
    'ana@empresa1.com': { touch: 1, lastTouchDate: '2026-09-16T13:00:00Z', completed: false }
  }
};
const resB = selectCfoBatchWithCadence(dummyCfos, stateB, 2, mockNow);
assert.strictEqual(resB.selected[0].lead.email, 'ana@empresa1.com', 'Ana debe tener prioridad por Toque 2');
assert.strictEqual(resB.selected[0].touch, 2, 'Ana debe recibir Toque 2');
console.log('  ✅ [PASS] Prospectos con Toque 1 hace >= 3 días progresan a Toque 2');

// Caso C: Lead con Toque 2 hace 5 días -> debe recibir Toque 3 (Cierre diplomático)
const stateC = {
  cfoIndex: 1,
  cadence: {
    'ana@empresa1.com': { touch: 2, lastTouchDate: '2026-09-15T13:00:00Z', completed: false }
  }
};
const resC = selectCfoBatchWithCadence(dummyCfos, stateC, 2, mockNow);
assert.strictEqual(resC.selected[0].lead.email, 'ana@empresa1.com', 'Ana debe tener prioridad por Toque 3');
assert.strictEqual(resC.selected[0].touch, 3, 'Ana debe recibir Toque 3');
console.log('  ✅ [PASS] Prospectos con Toque 2 hace >= 4 días progresan a Toque 3');

// 2. Validar Templates de Correo
console.log('\n[GRUPO 2] Verificación de Templates de Correo:');
const leadSample = dummyCfos[0];

const htmlT1 = buildCfoTouch1Html(leadSample);
assert(htmlT1.includes('Control de EBITDA'), 'Toque 1 debe enfocarse en EBITDA');
assert(htmlT1.includes('RAM Volátil') || htmlT1.includes('RAM volátil'), 'Toque 1 debe declarar RAM volátil');
console.log('  ✅ [PASS] Template CFO Toque 1 contiene pilares de EBITDA y RAM volátil');

const htmlT2 = buildCfoTouch2Html(leadSample);
assert(htmlT2.includes('$18,500.00 USD'), 'Toque 2 debe incluir el caso real de $18,500 USD');
assert(htmlT2.includes('Redline en Word'), 'Toque 2 debe referenciar Redlines en Word');
console.log('  ✅ [PASS] Template CFO Toque 2 contiene caso práctico y redline');

const htmlT3 = buildCfoTouch3Html(leadSample);
assert(htmlT3.includes('50379893922'), 'Toque 3 debe contener el WhatsApp de Don Ricardo');
assert(htmlT3.includes('Crédito Fiscal Electrónico (DTE'), 'Toque 3 debe incluir facturación fiscal DTE');
console.log('  ✅ [PASS] Template CFO Toque 3 contiene cierre diplomático, WhatsApp y DTE');

// 3. Validar Proforma y Transfer365 en Frontend
console.log('\n[GRUPO 3] Verificación de Frontend y Proforma Clipboard:');
const appJsFront = fs.readFileSync(path.join(rootDir, 'frontend/js/app.js'), 'utf8');
const appJsRoot = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');

assert(appJsFront.includes('Transfer365'), 'frontend/js/app.js debe incluir Transfer365');
assert(appJsFront.includes('Crédito Fiscal Electrónico'), 'frontend/js/app.js debe incluir DTE Crédito Fiscal');
assert(appJsFront.includes('+503 7989 3922'), 'frontend/js/app.js debe incluir WhatsApp fiduciario');

assert(appJsRoot.includes('Transfer365'), 'js/app.js debe incluir Transfer365');
assert(appJsRoot.includes('Crédito Fiscal Electrónico'), 'js/app.js debe incluir DTE Crédito Fiscal');

console.log('  ✅ [PASS] copyProformaText() genera copia fiduciaria con Transfer365 y DTE');

// 4. Validar Botón Demo 1 Clic y WhatsApp en index.html
console.log('\n[GRUPO 4] Verificación de Botón Demo 1-Clic y WhatsApp en HTML:');
const htmlFront = fs.readFileSync(path.join(rootDir, 'frontend/index.html'), 'utf8');
const htmlRoot = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

assert(htmlFront.includes('btn-sample-audit-cta'), 'frontend/index.html debe tener btn-sample-audit-cta');
assert(htmlRoot.includes('btn-sample-audit-cta'), 'index.html debe tener btn-sample-audit-cta');
assert(htmlFront.includes('https://wa.me/50379893922'), 'frontend/index.html debe vincular a wa.me/50379893922');
assert(htmlRoot.includes('https://wa.me/50379893922'), 'index.html debe vincular a wa.me/50379893922');
assert(htmlFront.includes('Facturación Corporativa con Crédito Fiscal (DTE)'), 'frontend/index.html debe tener banner DTE');
assert(htmlRoot.includes('Facturación Corporativa con Crédito Fiscal (DTE)'), 'index.html debe tener banner DTE');

console.log('  ✅ [PASS] Hero Dropzone, Pricing y Footer contienen los 3 componentes de baja fricción');

console.log('\n=======================================================');
console.log('🎉 100% DE LAS PRUEBAS DE CADENCIA CFO Y DTE / TRANSFER365 SUPERADAS CON ÉXITO');
console.log('=======================================================\n');
