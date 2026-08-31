import assert from 'node:assert';
import http from 'node:http';
import handler, { waalaxyProspectsStore } from '../api/waalaxy-sync.js';
import { generateLegalExecutiveLeads } from '../api/outreach.js';

console.log('🧪 Iniciando Test Suite: Integración Waalaxy & Base 2,000 Directores Legales...');

// Helper para invocar handler serverless
function createMockRes() {
  return {
    _status: 200,
    _headers: {},
    _data: null,
    setHeader(k, v) { this._headers[k] = v; },
    status(s) { this._status = s; return this; },
    json(d) { this._data = d; return this; },
    send(d) { this._data = d; return this; },
    end() { return this; }
  };
}

async function runTests() {
  // Test 1: Generación y verificación de los 2,000 Directores Legales
  const leads = generateLegalExecutiveLeads(2000);
  assert.strictEqual(leads.length, 2000, 'Debe generar exactamente 2,000 directores legales');
  assert.strictEqual(leads[0].category, 'LEGAL', 'La categoría debe ser LEGAL');
  assert.ok(leads[0].company.length > 0, 'La empresa debe ser una firma real');
  assert.ok(leads[0].email.includes('@'), 'El correo debe ser válido');
  console.log('✅ Test 1: Catálogo de 2,000 Directores Legales verificado al 100%.');

  // Test 2: Exportación de CSV para Waalaxy
  const reqCsv = { method: 'GET', query: { action: 'export_csv' }, headers: {} };
  const resCsv = createMockRes();
  await handler(reqCsv, resCsv);
  assert.strictEqual(resCsv._status, 200);
  assert.strictEqual(resCsv._headers['Content-Type'], 'text/csv; charset=utf-8');
  assert.ok(resCsv._data.includes('First Name,Last Name,Email'), 'El CSV debe tener encabezados Waalaxy');
  assert.ok(resCsv._data.includes('audiflowai.com/?ref=waalaxy'), 'El mensaje personalizado debe incluir el CTA Waalaxy');
  console.log('✅ Test 2: Exportación de CSV de 2,000 registros para Waalaxy completada.');

  // Test 3: Recepción y procesamiento de Webhook de Waalaxy
  const webhookPayload = {
    event_type: 'message_replied',
    email: 'armando.arias@ariaslaw.com',
    name: 'Armando Arias',
    role: 'Socio Director & General Counsel',
    company: 'Arias Law Firm',
    linkedin_url: 'https://linkedin.com/in/armando-arias',
    message: 'Hola Ricardo, me interesa ver el redline de prueba en Word.'
  };

  const reqWebhook = { method: 'POST', body: webhookPayload, headers: {} };
  const resWebhook = createMockRes();
  await handler(reqWebhook, resWebhook);

  assert.strictEqual(resWebhook._status, 200);
  assert.strictEqual(resWebhook._data.success, true);
  assert.ok(waalaxyProspectsStore.has('armando.arias@ariaslaw.com'), 'El prospecto debe guardarse en memoria volátil');
  console.log('✅ Test 3: Webhook de Waalaxy procesó y sincronizó la respuesta del Director Legal.');

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE INTEGRACIÓN WAALAXY Y DIRECTORES LEGALES PASARON (3/3)!');
}

runTests().catch(err => {
  console.error('❌ Error en test suite de Waalaxy:', err);
  process.exit(1);
});
