import { generateAndSendDailySalesReport } from '../lib/daily-sales-report.js';

try {
  console.log(`[${new Date().toISOString()}] Ejecutando despacho autónomo de Reporte 6:00 PM...`);
  const result = await generateAndSendDailySalesReport({ timeSlot: 'Corte Oficial 6:00 PM' });
  console.log(`[${new Date().toISOString()}] Resultado:`, result.emailSent ? 'ENVIADO' : 'ERROR', result.emailError || '');
  process.exit(result.emailSent ? 0 : 1);
} catch (err) {
  console.error(`[${new Date().toISOString()}] Error fatal:`, err);
  process.exit(1);
}
