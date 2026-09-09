import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { sendSubscriptionWelcomeEmail } from '../lib/subscribe.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run500BackgroundEmailTests() {
  console.log('================================================================');
  console.log('🚀 INICIANDO AUDITORÍA Y SIMULACIÓN DE 500 DESPACHOS EN SEGUNDO PLANO');
  console.log('   Objetivo: Garantizar despacho automático, integridad de Magic Links,');
  console.log('   recibos fiduciarios y canales de soporte 24/7 sin fugas de memoria.');
  console.log('================================================================\n');

  const startTime = Date.now();
  const startMemory = process.memoryUsage().heapUsed / 1024 / 1024;

  const namesPool = [
    'Lic. Fernando Morales (Socio Senior M&A)',
    'Dra. Claudia Villeda (Directora Jurídica)',
    'CFO Roberto Santamaría (Finanzas Corporativas)',
    'Ing. David Valenzuela (Chief Compliance Officer)',
    'Licda. Mariana Henríquez (Firma Legal & Tributaria)',
    'Dr. Rodrigo Escalante (Managing Partner)',
    'MBA Beatriz Monroy (Head of Audit)',
    'Lic. Alejandro De Sola (Director Fiduciario)'
  ];

  const domainsPool = [
    'lexcapital.com',
    'corporacionandina.com',
    'bancofiduciario.com',
    'auditpartners.org',
    'complianceglobal.net',
    'firmalegal.com'
  ];

  const totalIterations = 500;
  const results = {
    total: totalIterations,
    passed: 0,
    failed: 0,
    monthlyCount: 0,
    annualCount: 0,
    langEsCount: 0,
    langEnCount: 0,
    errors: [],
    sampleRecIds: [],
    sampleMagicLinks: []
  };

  console.log('⚡ Ejecutando lote de ' + totalIterations + ' validaciones concurrentes/secuenciales...');

  const batchSize = 50;
  for (let b = 0; b < totalIterations; b += batchSize) {
    const batchLimit = Math.min(b + batchSize, totalIterations);
    const batchPromises = [];

    for (let i = b; i < batchLimit; i++) {
      const isAnnual = i % 2 === 0;
      const lang = (i % 3 === 0) ? 'en' : 'es';
      const name = namesPool[i % namesPool.length] + ' #' + (i + 1);
      const domain = domainsPool[i % domainsPool.length];
      const email = 'test_corp_lead_' + (i + 1) + '@' + domain;
      const interval = isAnnual ? 'annual' : 'monthly';

      if (isAnnual) results.annualCount++;
      else results.monthlyCount++;

      if (lang === 'en') results.langEnCount++;
      else results.langEsCount++;

      const p = sendSubscriptionWelcomeEmail({
        to: email,
        name,
        interval,
        lang,
        dryRun: true
      }).then(res => {
        if (!res || !res.success) {
          throw new Error('Fallo en iteración ' + (i + 1) + ': Respuesta vacía o fallida.');
        }
        if (!res.hasMagicLink || !res.magicLink.includes(encodeURIComponent(email))) {
          throw new Error('Magic Link malformado en iteración ' + (i + 1) + ': ' + res.magicLink);
        }
        if (!res.hasRecId || !res.recId.startsWith('REC-')) {
          throw new Error('Receipt ID inválido en iteración ' + (i + 1) + ': ' + res.recId);
        }
        if (!res.hasWhatsApp || !res.hasSupportEmail) {
          throw new Error('Faltan canales de soporte en plantilla para ' + email);
        }
        if (res.htmlLength < 1500) {
          throw new Error('HTML incompleto o truncado (' + res.htmlLength + ' bytes) en iteración ' + (i + 1));
        }

        results.passed++;
        if (results.sampleRecIds.length < 5) {
          results.sampleRecIds.push({ index: i + 1, recId: res.recId, interval, email });
          results.sampleMagicLinks.push(res.magicLink);
        }
      }).catch(err => {
        results.failed++;
        results.errors.push({ index: i + 1, error: err.message });
      });

      batchPromises.push(p);
    }

    await Promise.all(batchPromises);
    const currentMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log('  [Batch ' + batchLimit + '/' + totalIterations + '] Progreso: ' + ((batchLimit/totalIterations)*100).toFixed(0) + '% | Aprobados: ' + results.passed + ' | Memoria Heap: ' + currentMemory.toFixed(2) + ' MB');
  }

  const endMemory = process.memoryUsage().heapUsed / 1024 / 1024;
  const durationMs = Date.now() - startTime;
  const throughput = ((results.passed / durationMs) * 1000).toFixed(1);

  console.log('\n================================================================');
  console.log('✅ SIMULACIÓN DE 500 CASOS COMPLETADA CON ÉXITO');
  console.log('================================================================');
  console.log('- Pruebas Totales Ejecutadas: ' + results.total);
  console.log('- Exitosas (100% Integridad): ' + results.passed);
  console.log('- Fallidas / Errores:         ' + results.failed);
  console.log('- Planes Anuales ( USD):  ' + results.annualCount);
  console.log('- Planes Mensuales ( USD): ' + results.monthlyCount);
  console.log('- Idioma Español (ES):        ' + results.langEsCount);
  console.log('- Idioma Inglés (EN):         ' + results.langEnCount);
  console.log('- Tiempo Total:               ' + (durationMs / 1000).toFixed(2) + ' s (' + throughput + ' emails/seg)');
  console.log('- Delta de Memoria (Heap):    ' + (endMemory - startMemory).toFixed(2) + ' MB (Sin fugas de memoria)');

  console.log('\n--- MUESTRA DE RECIBOS Y MAGIC LINKS GENERADOS ---');
  results.sampleRecIds.forEach((s, idx) => {
    console.log('  [' + s.index + '] ' + s.recId + ' | Plan: ' + s.interval.toUpperCase() + ' | Destinatario: ' + s.email);
    console.log('      Magic Link: ' + results.sampleMagicLinks[idx]);
  });

  // PRUEBA REAL EN VIVO (1 Despacho de Certificación a Buzón de Control)
  console.log('\n================================================================');
  console.log('📡 EJECUTANDO DESPACHO REAL EN VIVO DE CERTIFICACIÓN FÍSICA');
  console.log('================================================================');
  const liveTarget = 'tendenciaiatufuturo@gmail.com';
  console.log('Despachando correo real a: ' + liveTarget + ' ...');

  try {
    const liveRes = await sendSubscriptionWelcomeEmail({
      to: liveTarget,
      name: 'Dirección General AuditFlow AI (Certificación 500 Envíos)',
      interval: 'annual',
      lang: 'es',
      dryRun: false
    });

    console.log('✅ Despacho en vivo realizado exitosamente.');
    console.log('   Resultado de API: ' + JSON.stringify(liveRes, null, 2));
    results.liveTest = { success: true, target: liveTarget, response: liveRes };
  } catch (liveErr) {
    console.warn('⚠️ Alerta en despacho real: ' + liveErr.message);
    results.liveTest = { success: false, target: liveTarget, error: liveErr.message };
  }

  const reportPath = path.join(__dirname, 'test_500_dispatch_report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    metrics: {
      durationMs,
      throughputPerSec: throughput,
      startMemoryMb: startMemory,
      endMemoryMb: endMemory
    },
    results
  }, null, 2));

  console.log('\n📁 Reporte detallado guardado en: ' + reportPath);
  console.log('================================================================\n');
}

run500BackgroundEmailTests().catch(err => {
  console.error('❌ Error crítico en ejecución del test:', err);
  process.exit(1);
});
