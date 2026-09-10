@echo off
title AuditFlow AI - Publicador Vespertino Buffer (5:00 PM CST - Lunes a Domingo)
cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo ====================================================================== >> buffer_5pm_cron.log
echo [%date% %time%] INICIANDO PUBLICACION VESPERTINA REELS BUFFER 5:00 PM CST >> buffer_5pm_cron.log
echo ====================================================================== >> buffer_5pm_cron.log
node scripts/buffer_daily_publisher_5pm.mjs >> buffer_5pm_cron.log 2>&1
echo [%date% %time%] PUBLICACION VESPERTINA REELS BUFFER FINALIZADA CON EXITO. >> buffer_5pm_cron.log
