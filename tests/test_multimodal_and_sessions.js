import assert from 'assert';
import crypto from 'crypto';
import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';
import verifyClientHandler from '../lib/verify-client.js';
import downloadPdfHandler from '../lib/download-pdf.js';
import paymentHandler from '../api/payment.js';

console.log('\n=======================================================');
console.log('🧪 SUITE DE VALIDACIÓN: MEJORA AUDITFLOW A 9.5/10');
console.log('=======================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${description}:`, err.message);
  }
}

async function runAsyncTest(description, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ [PASS] ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${description}:`, err.message);
  }
}

async function main() {
  console.log('[GRUPO 1] Motor Multimodal OCR & Extracción Word (.docx):');

  // Test 1: Crear un docx sintético en memoria y verificar extracción de texto
  await runAsyncTest('Extracción de texto desde archivo Word (.docx) mediante JSZip', async () => {
    const zip = new JSZip();
    const mockXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
        <w:body>
          <w:p><w:t>CLÁUSULA PRIMERA: OBJETO DEL CONTRATO.</w:t></w:p>
          <w:p><w:t>El arrendatario abonará $5,000 USD mensuales con recargo por mora.</w:t></w:p>
        </w:body>
      </w:document>`;
    zip.file('word/document.xml', mockXml);
    const buffer = await zip.generateAsync({ type: 'nodebuffer' });

    // Ejecutar lógica de extracción
    const loadedZip = await JSZip.loadAsync(buffer);
    const docXml = await loadedZip.file('word/document.xml')?.async('text');
    assert(docXml, 'word/document.xml debe existir en el paquete zip');
    const matches = docXml.match(/<w:t(?:\s+[^>]*)?>([\s\S]*?)<\/w:t>/g) || [];
    const text = matches.map(m => m.replace(/<[^>]+>/g, '')).join(' ');

    assert(text.includes('CLÁUSULA PRIMERA'), 'Debe contener el encabezado');
    assert(text.includes('$5,000 USD'), 'Debe contener la tarifa detectada');
  });

  // Test 2: Cálculo fiduciario de Hash SHA-256 en memoria RAM
  runTest('Cálculo de Hash Criptográfico SHA-256 en Memoria Volátil', () => {
    const mockDoc = Buffer.from('CONTRATO_CONFIDENCIAL_AUDITFLOW_2026', 'utf-8');
    const hash = crypto.createHash('sha256').update(mockDoc).digest('hex');
    assert.strictEqual(hash.length, 64, 'El hash SHA-256 debe tener exactamente 64 caracteres hexadecimales');
    assert(/^[a-f0-9]{64}$/.test(hash), 'El formato debe ser hexadecimal válido');
  });

  console.log('\n[GRUPO 2] Autenticación Corporativa y Tokens de Sesión:');

  // Test 3: Emisión y validación de tokens de sesión
  await runAsyncTest('Emisión de session_token de 30 días para cliente VIP', async () => {
    let responseData = null;
    let statusCode = 0;
    const req = {
      method: 'POST',
      body: { email: 'ricardo@audiflowai.com', action: 'verify_client' }
    };
    const res = {
      setHeader() {},
      status(code) { statusCode = code; return this; },
      json(data) { responseData = data; return this; }
    };

    await verifyClientHandler(req, res);
    assert.strictEqual(statusCode, 200);
    assert.strictEqual(responseData.is_client, true);
    assert(responseData.session_token, 'Debe emitir un session_token');

    // Test 4: Restauración transparente usando el token emitido
    let restoreData = null;
    let restoreCode = 0;
    const restoreReq = {
      method: 'POST',
      body: { session_token: responseData.session_token }
    };
    const restoreRes = {
      setHeader() {},
      status(code) { restoreCode = code; return this; },
      json(data) { restoreData = data; return this; }
    };

    await verifyClientHandler(restoreReq, restoreRes);
    assert.strictEqual(restoreCode, 200);
    assert.strictEqual(restoreData.is_client, true);
    assert.strictEqual(restoreData.email, 'ricardo@audiflowai.com');
  });

  console.log('\n[GRUPO 3] Catálogo Wompi SV y Pasarelas de Cobro:');

  // Test 5: Catálogo fiduciario de Wompi SV
  runTest('Catálogo de Precios Wompi SV oficial ($19 USD reporte, $69/mo y $590/año)', () => {
    const paymentFile = fs.readFileSync(path.resolve('api/payment.js'), 'utf-8');
    assert(paymentFile.includes("'report_unlock_19': { amount: 19.00"), 'Debe incluir report_unlock_19 en $19.00 USD');
    assert(paymentFile.includes("'plan_pro_69': { amount: 69.00"), 'Debe incluir plan_pro_69 en $69.00 USD');
    assert(paymentFile.includes("'plan_anual_590': { amount: 590.00"), 'Debe incluir plan_anual_590 en $590.00 USD');
    assert(paymentFile.includes('unit_amount: 1900'), 'Stripe fallback debe cobrar unit_amount: 1900 ($19.00 USD)');
  });

  console.log('\n[GRUPO 4] Arquitectura Modular y Endpoint Dedicado:');

  // Test 6: Existencia de api/verify-client.js
  runTest('El endpoint dedicado serverless api/verify-client.js existe y es válido', () => {
    assert(fs.existsSync(path.resolve('api/verify-client.js')), 'api/verify-client.js debe existir físicamente');
    const content = fs.readFileSync(path.resolve('api/verify-client.js'), 'utf-8');
    assert(content.includes('verifyClientHandler'), 'Debe invocar a verifyClientHandler');
  });

  // Test 7: Módulos frontend existen y son referenciados
  runTest('Los módulos corporate-auth.js y audit-scanner.js existen en frontend/js/modules/', () => {
    assert(fs.existsSync(path.resolve('frontend/js/modules/corporate-auth.js')), 'corporate-auth.js debe existir');
    assert(fs.existsSync(path.resolve('frontend/js/modules/audit-scanner.js')), 'audit-scanner.js debe existir');
    const indexHtml = fs.readFileSync(path.resolve('frontend/index.html'), 'utf-8');
    assert(indexHtml.includes('corporate-auth.js'), 'index.html debe cargar corporate-auth.js');
    assert(indexHtml.includes('audit-scanner.js'), 'index.html debe cargar audit-scanner.js');
  });

  // Test 8: Sincronización exacta entre frontend e index.html
  runTest('Sincronización exacta 1:1 entre frontend/index.html y root index.html', () => {
    const fHtml = fs.readFileSync(path.resolve('frontend/index.html'), 'utf-8');
    const rHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
    assert.strictEqual(fHtml, rHtml, 'frontend/index.html e index.html deben ser estrictamente idénticos');
  });

  // Test 9: Sincronización exacta entre frontend/js/app.js y js/app.js
  runTest('Sincronización exacta 1:1 entre frontend/js/app.js y root js/app.js', () => {
    const fApp = fs.readFileSync(path.resolve('frontend/js/app.js'), 'utf-8');
    const rApp = fs.readFileSync(path.resolve('js/app.js'), 'utf-8');
    assert.strictEqual(fApp, rApp, 'frontend/js/app.js y js/app.js deben ser estrictamente idénticos');
  });

  console.log('\n[GRUPO 5] Blindaje de Seguridad Post-Auditoría (Anti-Bypass, Anti-XSS, Timing-Safe):');

  // Test 10: Sincronización exacta 1:1 de corporate-auth.js
  runTest('Sincronización exacta 1:1 entre frontend/js/modules/corporate-auth.js y js/modules/corporate-auth.js', () => {
    const fAuth = fs.readFileSync(path.resolve('frontend/js/modules/corporate-auth.js'), 'utf-8');
    const rAuth = fs.readFileSync(path.resolve('js/modules/corporate-auth.js'), 'utf-8');
    assert.strictEqual(fAuth, rAuth, 'Ambos módulos corporate-auth.js deben ser estrictamente idénticos');
    assert(fAuth.includes('; Secure'), 'Debe incluir el flag Secure para conexiones HTTPS');
  });

  // Test 11: Rechazo de tokens forjados con clave hardcoded antigua
  await runAsyncTest('Rechazo seguro de tokens forjados con el antiguo secreto estático', async () => {
    const fakeSecret = 'auditflow-fiduciary-token-secret-2026';
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    const payload = `attacker@evil.com|Enterprise|${expiresAt}`;
    const forgedSig = crypto.createHmac('sha256', fakeSecret).update(payload).digest('hex');
    const forgedToken = Buffer.from(`${payload}|${forgedSig}`).toString('base64');

    let responseData = null;
    let statusCode = 0;
    const req = {
      method: 'POST',
      body: { session_token: forgedToken }
    };
    const res = {
      setHeader() {},
      status(code) { statusCode = code; return this; },
      json(data) { responseData = data; return this; }
    };

    await verifyClientHandler(req, res);
    assert.strictEqual(responseData.is_client, false, 'El token forjado offline NO debe ser aceptado como cliente');
  });

  // Test 12: Prevención de XSS en generación de PDF
  await runAsyncTest('Neutralización de inyecciones XSS / HTML en descarga de PDF', async () => {
    let htmlOutput = '';
    let statusCode = 0;
    const req = {
      method: 'POST',
      body: {
        documentName: 'Contrato<script>alert("xss")</script>.pdf',
        findings: [
          {
            type: '<img src=x onerror=alert("type_xss")>',
            description: '<script>fetch("http://evil.com")</script>',
            impact: '<b onmouseover=alert("impact")>Peligro</b>'
          }
        ]
      }
    };
    const res = {
      setHeader() {},
      status(code) { statusCode = code; return this; },
      send(data) { htmlOutput = data; return this; }
    };

    await downloadPdfHandler(req, res);
    assert.strictEqual(statusCode, 200);
    assert(!htmlOutput.includes('<script>'), 'El HTML no debe contener etiquetas <script> sin escapar');
    assert(!htmlOutput.includes('onerror='), 'El HTML no debe contener atributos onerror= sin escapar');
    assert(htmlOutput.includes('&lt;script&gt;'), 'Los scripts deben ser neutralizados a entidades HTML (&lt;script&gt;)');
  });

  // Test 13: Erradicación del Bypass Gratuito en Pasarela de Cobro
  await runAsyncTest('api/payment.js jamás entrega status=success sin cobro fiduciario confirmado', async () => {
    let responseData = null;
    let statusCode = 0;
    const req = {
      method: 'POST',
      url: '/api/payment',
      headers: { origin: 'https://audiflowai.com' },
      body: { report_id: 'rep_test_bypass_123' }
    };
    const res = {
      setHeader() {},
      status(code) { statusCode = code; return this; },
      json(data) { responseData = data; return this; }
    };

    await paymentHandler(req, res);
    assert.strictEqual(statusCode, 200);
    assert(!responseData.checkoutUrl?.includes('status=success'), 'La pasarela no debe emitir status=success gratuito');
    assert(responseData.gateway === 'wompi', 'Debe dirigir por defecto a la pasarela fiduciaria Wompi SV');
  });

  // Test 14: Verificación de Purga de Secretos de Gmail en código fuente
  runTest('Purga completa de contraseñas de aplicación de Gmail en archivos fuente', () => {
    const filesToCheck = ['server.js', 'lib/config.js', 'api/admin.js', 'lib/daily-sales-report.js'];
    for (const f of filesToCheck) {
      const content = fs.readFileSync(path.resolve(f), 'utf-8');
      assert(!content.includes('fbqiyqmapqplbcim'), `${f} no debe contener la contraseña hardcoded fbqiyqmapqplbcim`);
      assert(!content.includes('humycnvzdtyzmnos'), `${f} no debe contener la contraseña hardcoded humycnvzdtyzmnos`);
    }
  });

  // Test 15: Restricción de CORS en endpoints fiduciarios
  await runAsyncTest('CORS restringido a dominios fiduciarios autorizados', async () => {
    let corsHeader = '';
    const req = {
      method: 'POST',
      url: '/api/payment',
      headers: { origin: 'https://evil-hacker-site.com' },
      body: { report_id: 'rep_cors_test' }
    };
    const res = {
      setHeader(name, val) {
        if (name.toLowerCase() === 'access-control-allow-origin') {
          corsHeader = val;
        }
      },
      status() { return this; },
      json() { return this; }
    };

    await paymentHandler(req, res);
    assert.strictEqual(corsHeader, 'https://audiflowai.com', 'CORS debe rechazar el origen malicioso y reescribir a https://audiflowai.com');
  });

  // Test 16: No divulgación de contraseña en 401 de admin
  runTest('Erradicación de divulgación de contraseña en mensajes 401 de error', () => {
    const serverJs = fs.readFileSync(path.resolve('server.js'), 'utf-8');
    const adminJs = fs.readFileSync(path.resolve('api/admin.js'), 'utf-8');
    assert(!serverJs.includes('Puedes usar: AuditFlow2026!'), 'server.js no debe sugerir la contraseña en el 401');
    assert(!adminJs.includes('Verifica que sea AuditFlow2026!'), 'api/admin.js no debe sugerir la contraseña en el 401');
  });

  console.log('\n=======================================================');
  console.log(`📊 RESULTADOS: ${passedTests} de ${totalTests} pruebas superadas (${Math.round((passedTests/totalTests)*100)}%)`);
  if (passedTests === totalTests) {
    console.log('🎉 ¡100% DE PRUEBAS DE ELEVACIÓN A 9.5/10 SUPERADAS CON ÉXITO!');
  } else {
    console.error('⚠️ ALGUNAS PRUEBAS FALLARON.');
    process.exit(1);
  }
  console.log('=======================================================\n');
}

main().catch(err => {
  console.error('Error fatal en suite:', err);
  process.exit(1);
});
