@echo off
cd /d "C:\Users\Ricardo\Desktop\Audiflow Ai"
node -e "import('./lib/daily-sales-report.js').then(m => m.generateAndSendDailySalesReport({ timeSlot: 'Corte Oficial 6:00 PM' }))"
