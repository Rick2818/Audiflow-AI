@echo off
REM ==============================================================================
REM AUDITFLOW AI — PUBLICADOR MATUTINO EN BUFFER (8:00 AM CST)
REM Publica diariamente en Facebook, Instagram y LinkedIn vía Buffer GraphQL API
REM ==============================================================================
cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo ====================================================================== >> buffer_8am_cron.log
echo [%date% %time%] INICIANDO PUBLICACION MATUTINA BUFFER 8:00 AM CST >> buffer_8am_cron.log
echo ====================================================================== >> buffer_8am_cron.log
node scripts/buffer_daily_publisher_5pm.mjs >> buffer_8am_cron.log 2>&1
echo [%date% %time%] PUBLICACION MATUTINA FINALIZADA. >> buffer_8am_cron.log

