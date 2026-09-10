@echo off
REM ==============================================================================
REM AUDITFLOW AI — DISPARADOR AUTOMÁTICO SECTOR MEDIO NÓRDICOS 4:00 AM CST
REM Equivalente a 12:00 PM CEST (Suecia, Noruega, Dinamarca) / 1:00 PM (Finlandia)
REM ==============================================================================

cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo [%date% %time%] Iniciando despacho automatico de Sector Medio Nordicos 4:00 AM... >> nordic_midmarket_cron.log
node scripts/nordic_midmarket_daily_sower.mjs >> nordic_midmarket_cron.log 2>&1
echo [%date% %time%] Despacho finalizado con exito. >> nordic_midmarket_cron.log
