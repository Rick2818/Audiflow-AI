@echo off
title AuditFlow AI - Despacho Automatico Nordicos (4:00 AM CST - Lunes a Viernes)
cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo ====================================================================== >> logs_nordicos_cron_4am.log
echo [%date% %time%] INICIANDO CICLO CRON NORDICOS 4:00 AM CST >> logs_nordicos_cron_4am.log
echo ====================================================================== >> logs_nordicos_cron_4am.log
node scripts/nordic_midmarket_daily_sower.mjs >> logs_nordicos_cron_4am.log 2>&1
echo [%date% %time%] CICLO CRON NORDICOS FINALIZADO CON EXITO. >> logs_nordicos_cron_4am.log
