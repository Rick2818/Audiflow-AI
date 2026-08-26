import assert from 'node:assert';
import handler from '../api/auto-redline.js';

console.log('🧪 Iniciando Test Suite: Auto-Responder Automático de Redlines 24/7...');

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
  // Test 1: GET Status del Servicio
  const reqGet = { method: 'GET', query: {}, headers: {} };
  const resGet = createMockRes();
  await handler(reqGet, resGet);

  assert.strictEqual(resGet._status, 200);
  assert.strictEqual(resGet._data.status, 'ACTIVE');
  console.log('✅ Test 1: Endpoint de Auto-Redline responde 200 OK y estado ACTIVE.');

  // Test 2: Validación de error ante email vacío
  const reqInvalid = { method: 'POST', body: { email: '' }, headers: {} };
  const resInvalid = createMockRes();
  await handler(reqInvalid, resInvalid);

  assert.strictEqual(resInvalid._status, 400);
  assert.strictEqual(resInvalid._data.success, false);
  console.log('✅ Test 2: Validación de correo obligatorio funciona.');

  // Test 3: Despacho exitoso de Redline
  const reqValid = {
    method: 'POST',
    body: {
      email: 'armando.arias@ariaslaw.com',
      name: 'Armando Arias',
      company: 'Arias Law Firm',
      document_title: 'Contrato de Arrendamiento Comercial'
    },
    headers: {}
  };
  const resValid = createMockRes();
  await handler(reqValid, resValid);

  assert.strictEqual(resValid._status, 200);
  assert.strictEqual(resValid._data.success, true);
  assert.strictEqual(resValid._data.recipient, 'armando.arias@ariaslaw.com');
  console.log('✅ Test 3: Auto-Responder de Redline despachado y confirmado con éxito.');

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE AUTO-REDLINE PASARON EXITOSAMENTE (3/3)!');
}

runTests().catch(err => {
  console.error('❌ Error en suite de auto-redline:', err);
  process.exit(1);
});
