@echo off
REM ==============================================================================
REM AUDITFLOW AI — DESPACHO AUTOMATIZADO STORYTELLING FORENSE (CAPITULO 1)
REM ==============================================================================
cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo [%date% %time%] Iniciando despacho de Capitulo 1 Storytelling Forense... >> logs\storytelling_dispatch.log
node scripts\dispatch_storytelling_forense_campaign.mjs 1 >> logs\storytelling_dispatch.log 2>&1
echo [%date% %time%] Despacho completado. >> logs\storytelling_dispatch.log
