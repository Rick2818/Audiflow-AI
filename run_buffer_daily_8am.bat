@echo off
title AuditFlow AI - Publicador Matutino Buffer (8:00 AM CST - Lunes a Domingo)
cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo ====================================================================== >> buffer_8am_cron.log
echo [%date% %time%] INICIANDO PUBLICACION MATUTINA BUFFER 8:00 AM CST >> buffer_8am_cron.log
echo ====================================================================== >> buffer_8am_cron.log
node scripts/buffer_daily_publisher_8am.mjs >> buffer_8am_cron.log 2>&1
echo [%date% %time%] PUBLICACION MATUTINA BUFFER FINALIZADA CON EXITO. >> buffer_8am_cron.log
