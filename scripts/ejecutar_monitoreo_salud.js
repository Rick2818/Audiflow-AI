import dotenv from 'dotenv';
import { runHealthCheckAndAlert } from '../lib/health-monitor.js';

dotenv.config();

async function testHealthMonitor() {
  console.log('============================================================');
  console.log('🛡️ AUDITFLOW AI — PRUEBA DE VIGILANTE 24/7 & ALERTAS POR EMAIL');
  console.log('============================================================\n');

  console.log('⏳ Ejecutando auditoría de estado y generando alerta de prueba...');
  const result = await runHealthCheckAndAlert({ forceAlert: true });

  console.log('\n📊 RESULTADO DEL MONITOREO:');
  console.log(JSON.stringify(result, null, 2));

  if (result.diagnostics?.emailSent) {
    console.log(`\n🎉 ¡ALERTA DISPARADA CON ÉXITO A ${result.diagnostics.emailRecipient}!`);
  }
}

testHealthMonitor();
