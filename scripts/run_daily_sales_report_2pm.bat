@echo off
REM ==============================================================================
REM AUDITFLOW AI — REPORTE FINANCIERO Y DE VENTAS DIARIO (2:00 PM)
REM ==============================================================================
cd /d "C:\Users\Ricardo\Desktop\Audiflow Ai"
echo [%date% %time%] Iniciando despacho de Reporte Diario de Ventas (2:00 PM)... >> daily_sales_report.log
node -e "import('./lib/daily-sales-report.js').then(m => m.generateAndSendDailySalesReport({ timeSlot: 'Corte Oficial 2:00 PM' }))" >> daily_sales_report.log 2>&1
echo [%date% %time%] Reporte despachado exitosamente. >> daily_sales_report.log
