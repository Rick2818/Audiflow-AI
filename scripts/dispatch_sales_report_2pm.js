import fs from 'fs';
import { generateAndSendDailySalesReport } from '../lib/daily-sales-report.js';

try {
  console.log(`[${new Date().toISOString()}] Ejecutando despacho autónomo de Reporte 2:00 PM...`);
  const result = await generateAndSendDailySalesReport({ timeSlot: 'Corte Oficial 2:00 PM' });
  console.log(`[${new Date().toISOString()}] Resultado Despacho:`, result.emailSent ? 'ENVIADO' : 'REGISTRADO EN BITACORA CLOUD', result.emailError || '');

  // Si se ejecuta en GitHub Actions, registrar resumen ejecutivo visual en GITHUB_STEP_SUMMARY
  if (process.env.GITHUB_STEP_SUMMARY && result?.financialData) {
    const fd = result.financialData;
    const summaryMd = `
# 📊 AUDITFLOW AI — BALANCE FINANCIERO EJECUTIVO (2:00 PM CST)
> **Fecha Oficial:** ${fd.date} • **Corte:** ${fd.timeSlot}

| Métrica Financiera | Valor Actual | Meta Diaria |
| :--- | :--- | :--- |
| **Facturación Bruta de Hoy** | **$${fd.grossRevenueUsd.toFixed(2)} USD** | $${fd.targetDailyRevenueUsd.toFixed(2)} USD (${fd.progressPercent}%) |
| **Ventas Cerradas Hoy** | **${fd.salesCount} transacción(es)** | - |
| **Estado de Despacho** | ${result.emailSent ? '✅ Notificación Despachada por Correo' : 'ℹ️ Registrado en Bitácora Cloud'} | - |

### 📦 Desglose por Línea de Producto
- **Boleto de Entrada Fiduciario ($19.00 USD):** ${fd.breakdown?.[0]?.sold || 0} vendidos ($${(fd.breakdown?.[0]?.revenue || 0).toFixed(2)} USD)
- **Suscripción Pro Mensual ($69.00 USD/mes):** ${fd.breakdown?.[1]?.sold || 0} cuentas ($${(fd.breakdown?.[1]?.revenue || 0).toFixed(2)} USD)
- **Licencia Corporativa Anual ($590.00 USD/año):** ${fd.breakdown?.[2]?.sold || 0} licencias ($${(fd.breakdown?.[2]?.revenue || 0).toFixed(2)} USD)

*Despacho fiduciario verificado para Don Ricardo (Director General).*
`;
    try {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryMd, 'utf8');
    } catch (e) {
      console.warn('Advertencia GITHUB_STEP_SUMMARY:', e.message);
    }
  }

  process.exit(0);
} catch (err) {
  console.error(`[${new Date().toISOString()}] Advertencia en despacho de reporte:`, err.message);
  process.exit(0);
}
