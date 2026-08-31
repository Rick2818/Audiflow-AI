import assert from 'assert';
import handler, { colleagueInvitesMap } from '../lib/invite-colleague.js';
import { CONFIG } from '../lib/config.js';

console.log('🧪 Iniciando Test Suite: Bucle Viral de Product-Led Growth (Invitación de Colegas / Asesor Legal)...');

async function runTests() {
  // Test 1: Rechazo de método GET (Debe ser POST)
  {
    const req = { method: 'GET', headers: {} };
    let statusCode = 0;
    let jsonResp = null;
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return { json: (d) => { jsonResp = d; }, end: () => {} }; }
    };
    await handler(req, res);
    assert.strictEqual(statusCode, 405, 'Debe devolver 405 Method Not Allowed para GET');
    console.log('✅ Test 1: Validación estricta de método HTTP (405 Method Not Allowed) pasó.');
  }

  // Test 2: Validación de correo obligatorio
  {
    const req = {
      method: 'POST',
      headers: {},
      body: { sender_name: 'Ricardo', colleague_email: '' }
    };
    let statusCode = 0;
    let jsonResp = null;
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return { json: (d) => { jsonResp = d; } }; }
    };
    await handler(req, res);
    assert.strictEqual(statusCode, 400, 'Debe devolver 400 cuando falta el email del colega');
    console.log('✅ Test 2: Validación de payload y correo obligatorio pasó.');
  }

  // Test 3: Envío exitoso de invitación, inserción en memoria y copia de control
  {
    const testColleagueEmail = 'test.asesor.legal@empresa-ejemplo.com';
    const req = {
      method: 'POST',
      headers: {},
      body: {
        sender_name: 'Carlos Mendoza',
        sender_email: 'carlos.mendoza@empresa-ejemplo.com',
        sender_company: 'Constructora Central SA',
        colleague_name: 'Lic. Roberto Silva',
        colleague_email: testColleagueEmail,
        colleague_role: 'General Counsel & Director Legal',
        document_name: 'Contrato_Arrendamiento_Comercial_2026.pdf',
        document_type: 'Contrato de Arrendamiento',
        leakage_found: '$12,400 USD',
        custom_note: 'Estimado Roberto, por favor valida la cláusula 7.3 sobre penalidades.'
      }
    };

    let statusCode = 0;
    let jsonResp = null;
    const res = {
      setHeader: () => {},
      status: (code) => { statusCode = code; return { json: (d) => { jsonResp = d; } }; }
    };

    await handler(req, res);
    assert.strictEqual(statusCode, 200, 'Debe devolver 200 OK tras enviar la invitación');
    assert.strictEqual(jsonResp.success, true, 'Debe indicar success: true');
    assert.ok(jsonResp.invite_id, 'Debe generar un invite_id');
    assert.strictEqual(jsonResp.colleague_email, testColleagueEmail);

    // Verificar persistencia en mapa volátil
    const savedRecord = colleagueInvitesMap.get(jsonResp.invite_id);
    assert.ok(savedRecord, 'El registro debe existir en colleagueInvitesMap');
    assert.strictEqual(savedRecord.colleague_email, testColleagueEmail);
    assert.strictEqual(savedRecord.sender_company, 'Constructora Central SA');

    console.log(`✅ Test 3: Despacho de invitación exitoso (ID: ${jsonResp.invite_id}) y persistencia en memoria volátil confirmada.`);
  }

  // Test 4: Verificación de configuración SSOT y Enrutamiento Dual
  {
    assert.strictEqual(CONFIG.EMAIL.OWNER_CONTROL, 'tendenciaiatufuturo@gmail.com', 'El correo de control universal debe ser tendenciaiatufuturo@gmail.com');
    assert.strictEqual(CONFIG.EMAIL.OWNER_SALES, 'rick28191@gmail.com', 'El correo de ventas debe ser rick28191@gmail.com');
    console.log('✅ Test 4: Regla SSOT y Copia de Control Universal verificada.');
  }

  console.log('\n🎉 ¡TODAS LAS PRUEBAS DEL BUCLE VIRAL PLG PASARON EXITOSAMENTE (4/4)!');
}

runTests().catch(err => {
  console.error('❌ Error en tests:', err);
  process.exit(1);
});
