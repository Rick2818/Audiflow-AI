@echo off
title AuditFlow AI ? Servidor de Automatizaciones
echo ======================================================================
echo   Iniciando Servidor de Automatizaciones y Despacho de AuditFlow AI...
echo ======================================================================
echo.
echo   Abriendo panel de control en: http://localhost:5678
echo.
start http://localhost:5678
python C:\Users\Ricardo\Desktop\Agents\auditflow_automation_hub.py
pause
