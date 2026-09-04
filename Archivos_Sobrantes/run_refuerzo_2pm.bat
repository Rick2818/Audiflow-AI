@echo off
REM ==============================================================================
REM AUDITFLOW AI — DISPARADOR CAMPAÑA DE REFUERZO SECTOR MEDIO 2:00 PM CST
REM ==============================================================================

cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo [%date% %time%] Iniciando Campana de Refuerzo Sector Medio 2:00 PM... >> refuerzo_2pm_cron.log
node scripts/campana_refuerzo_sector_medio.mjs >> refuerzo_2pm_cron.log 2>&1
echo [%date% %time%] Campana de refuerzo finalizada. >> refuerzo_2pm_cron.log
