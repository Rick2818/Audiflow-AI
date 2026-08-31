import assert from 'node:assert';
import handler from '../api/export-docx.js';

console.log('🧪 Iniciando Test Suite: Auto-Responder Automático de Redlines vía /api/export-docx...');

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
  // Test 1: Despacho automático de Redline por correo
  const reqAutoSend = {
    method: 'POST',
    body: {
      action: 'auto_send',
      email: 'armando.arias@ariaslaw.com',
      name: 'Armando Arias',
      company: 'Arias Law Firm',
      document_title: 'Contrato de Arrendamiento Comercial'
    },
    headers: {}
  };
  const resAutoSend = createMockRes();
  await handler(reqAutoSend, resAutoSend);

  assert.strictEqual(resAutoSend._status, 200);
  assert.strictEqual(resAutoSend._data.success, true);
  assert.strictEqual(resAutoSend._data.recipient, 'armando.arias@ariaslaw.com');
  console.log('✅ Test 1: Auto-Responder de Redline despachado y confirmado con éxito vía /api/export-docx.');

  // Test 2: Generación normal de archivo .doc/.docx
  const reqDoc = {
    method: 'POST',
    body: {
      title: 'Contrato_Servicios_Test',
      content: '<p>Cláusula leonina eliminada</p>'
    },
    headers: {}
  };
  const resDoc = createMockRes();
  await handler(reqDoc, resDoc);

  assert.strictEqual(resDoc._status, 200);
  assert.strictEqual(resDoc._headers['Content-Type'], 'application/vnd.ms-word');
  console.log('✅ Test 2: Generación y descarga de archivo Word (.doc/.docx) confirmada.');

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE AUTO-REDLINE Y DOCX PASARON EXITOSAMENTE (2/2)!');
}

runTests().catch(err => {
  console.error('❌ Error en suite de auto-redline:', err);
  process.exit(1);
});
