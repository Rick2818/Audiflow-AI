@echo off
title AuditFlow AI - Siembra Diaria en Despachos Medianos (4:00 AM)
cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo ======================================================================
echo   Ejecutando ciclo de siembra fiduciaria: Despachos Medianos (4:00 AM)
echo ======================================================================
node scripts/midmarket_firms_daily_sower.mjs >> logs_midmarket_sower.log 2>&1
echo [%date% %time%] Ciclo de siembra finalizado. >> logs_midmarket_sower.log
