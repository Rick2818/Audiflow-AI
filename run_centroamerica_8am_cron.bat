@echo off
title AuditFlow AI - Prospeccion Matutina Centroamerica (7:00 AM CST - Lunes a Viernes)
cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo ====================================================================== >> logs\centroamerica_8am_cron.log
echo [%date% %time%] INICIANDO DESPACHO MATUTINO CENTROAMERICA 7:00 AM CST >> logs\centroamerica_8am_cron.log
echo ====================================================================== >> logs\centroamerica_8am_cron.log
node scripts\dispatch_centroamerica_8am_cron.mjs >> logs\centroamerica_8am_cron.log 2>&1
echo [%date% %time%] DESPACHO MATUTINO CENTROAMERICA FINALIZADO CON EXITO. >> logs\centroamerica_8am_cron.log
