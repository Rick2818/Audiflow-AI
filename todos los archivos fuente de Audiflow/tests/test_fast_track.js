import assert from 'assert';
import handler from '../lib/fast-track-blast.js';
import { CONFIG } from '../lib/config.js';

console.log('🧪 Iniciando Test Suite: Operación 10 Clientes Hoy (Fast-Track 24h)...');

async function runTests() {
  // Test 1: Rechazo de acceso no autenticado (401)
  {
    const req = { method: 'POST', headers: {}, body: {} };
    let statusCode = 0;
    let jsonResp = null;
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return { json: (d) => { jsonResp = d; }, end: () => {} }; }
    };
    await handler(req, res);
    assert.strictEqual(statusCode, 401, 'Debe devolver 401 para peticiones no autenticadas');
    console.log('✅ Test 1: Seguridad y autenticación de administrador verificada (401).');
  }

  // Test 2: Ejecución exitosa en modo simulación (test_mode: true)
  {
    const req = {
      method: 'POST',
      headers: { 'x-admin-password': 'AuditFlow2026!' },
      body: { limit: 10, test_mode: true }
    };
    let statusCode = 0;
    let jsonResp = null;
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return { json: (d) => { jsonResp = d; } }; }
    };
    await handler(req, res);
    assert.strictEqual(statusCode, 200, 'Debe devolver 200 OK');
    assert.strictEqual(jsonResp.success, true);
    assert.strictEqual(jsonResp.count, 10);
    assert.ok(jsonResp.dispatched.length === 10);
    console.log(`✅ Test 2: Ejecución Fast-Track exitosa (${jsonResp.count} prospectos procesados con éxito).`);
  }

  // Test 3: Verificación de copia de control universal fiduciaria
  {
    assert.strictEqual(CONFIG.EMAIL.OWNER_CONTROL, 'tendenciaiatufuturo@gmail.com', 'El correo fiduciario debe ser tendenciaiatufuturo@gmail.com');
    console.log('✅ Test 3: Copia de control universal fiduciaria confirmada.');
  }

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DE FAST-TRACK BLAST PASARON EXITOSAMENTE (3/3)!');
}

runTests().catch(err => {
  console.error('❌ Error en tests:', err);
  process.exit(1);
});
