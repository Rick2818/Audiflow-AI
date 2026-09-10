@echo off
title AuditFlow AI - Despacho Storytelling Forense 250 Bufetes (6:00 AM CST - Lunes a Sabado)
cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo ====================================================================== >> logs_storytelling_cron_6am.log
echo [%date% %time%] INICIANDO CICLO CRON STORYTELLING 6:00 AM CST >> logs_storytelling_cron_6am.log
echo ====================================================================== >> logs_storytelling_cron_6am.log
node scripts/dispatch_storytelling_250_medianos.mjs >> logs_storytelling_cron_6am.log 2>&1
echo [%date% %time%] CICLO CRON STORYTELLING FINALIZADO CON EXITO. >> logs_storytelling_cron_6am.log
