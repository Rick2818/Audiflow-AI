@echo off
REM ==============================================================================
REM AUDITFLOW AI — PUBLICADOR VESPERTINO EN BUFFER (5:00 PM CST)
REM Publica diariamente en Facebook, Instagram y LinkedIn vía Buffer GraphQL API
REM ==============================================================================

cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo [%date% %time%] Iniciando publicacion vespertina Buffer 5:00 PM (FB, IG, LI)... >> buffer_5pm_cron.log
node scripts/buffer_daily_publisher_5pm.mjs >> buffer_5pm_cron.log 2>&1
echo [%date% %time%] Publicacion vespertina finalizada. >> buffer_5pm_cron.log
