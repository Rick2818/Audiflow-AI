@echo off
REM ==============================================================================
REM AUDITFLOW AI — DISPARADOR AUTOMÁTICO META ADS (FACEBOOK & INSTAGRAM) 8:00 AM CST
REM ==============================================================================

cd /d "c:\Users\Ricardo\Desktop\Audiflow Ai"
echo [%date% %time%] Iniciando publicacion de tendencias de Meta Ads (Facebook e Instagram)... >> meta_daily_cron.log
node scripts/meta_daily_trending_sower.mjs >> meta_daily_cron.log 2>&1
echo [%date% %time%] Publicacion finalizada. >> meta_daily_cron.log
