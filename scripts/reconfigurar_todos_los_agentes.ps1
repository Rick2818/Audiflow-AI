# ==============================================================================
# AUDITFLOW AI — RECONFIGURACIÓN MAESTRA DE TAREAS PROGRAMADAS
# Corrige problemas de rutas con espacios, políticas de batería y suspensión.
# ==============================================================================

$nodePath = "C:\Program Files\nodejs\node.exe"
$workingDir = "C:\Users\Ricardo\Desktop\Audiflow Ai"

$settings = New-ScheduledTaskSettingsSet `
    -WakeToRun `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -MultipleInstances IgnoreNew `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 20)

Write-Host "Reconfigurando tareas programadas de AuditFlow AI..." -ForegroundColor Cyan

# 1. 4:00 AM - Siembra Medianos
$action1 = New-ScheduledTaskAction -Execute $nodePath -Argument "scripts\midmarket_firms_daily_sower.mjs" -WorkingDirectory $workingDir
$trigger1 = New-ScheduledTaskTrigger -Daily -At 4:00AM
Register-ScheduledTask -TaskName 'AuditFlowAI_MidmarketSower_4AM' -Action $action1 -Trigger $trigger1 -Settings $settings -Force | Out-Null
Write-Host "✅ AuditFlowAI_MidmarketSower_4AM (4:00 AM) reconfigurada." -ForegroundColor Green

# 2. 4:00 AM - Nórdicos
$action2 = New-ScheduledTaskAction -Execute $nodePath -Argument "scripts\nordic_midmarket_daily_sower.mjs" -WorkingDirectory $workingDir
$trigger2 = New-ScheduledTaskTrigger -Daily -At 4:00AM
Register-ScheduledTask -TaskName 'AuditFlowAI_NordicMidmarket_4AM' -Action $action2 -Trigger $trigger2 -Settings $settings -Force | Out-Null
Write-Host "✅ AuditFlowAI_NordicMidmarket_4AM (4:00 AM) reconfigurada." -ForegroundColor Green

# 3. 6:00 AM - Storytelling Bufetes (Lunes a Sábado)
$action3 = New-ScheduledTaskAction -Execute $nodePath -Argument "scripts\dispatch_storytelling_250_medianos.mjs" -WorkingDirectory $workingDir
$trigger3 = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday,Saturday -At 6:00AM
Register-ScheduledTask -TaskName 'AuditFlowAI_Storytelling_LunesSabado_6AM' -Action $action3 -Trigger $trigger3 -Settings $settings -Force | Out-Null
Write-Host "✅ AuditFlowAI_Storytelling_LunesSabado_6AM (6:00 AM) reconfigurada." -ForegroundColor Green

# 4. 8:00 AM - Buffer Social Autopilot Matutino
$action4 = New-ScheduledTaskAction -Execute $nodePath -Argument "scripts\buffer_daily_publisher_8am.mjs" -WorkingDirectory $workingDir
$trigger4 = New-ScheduledTaskTrigger -Daily -At 8:00AM
Register-ScheduledTask -TaskName 'AuditFlow_SocialAutopilot_8AM' -Action $action4 -Trigger $trigger4 -Settings $settings -Force | Out-Null
Write-Host "✅ AuditFlow_SocialAutopilot_8AM (8:00 AM) reconfigurada." -ForegroundColor Green

# 5. 2:00 PM - Reporte Ejecutivo Financiero Mediodía
$action5 = New-ScheduledTaskAction -Execute $nodePath -Argument "scripts\dispatch_sales_report_2pm.js" -WorkingDirectory $workingDir
$trigger5 = New-ScheduledTaskTrigger -Daily -At 2:00PM
Register-ScheduledTask -TaskName 'AuditFlow_DailyReport_2PM' -Action $action5 -Trigger $trigger5 -Settings $settings -Force | Out-Null
Write-Host "✅ AuditFlow_DailyReport_2PM (2:00 PM) reconfigurada." -ForegroundColor Green

# 6. 5:00 PM - Buffer Social Autopilot Vespertino (Reels / Video)
$action6 = New-ScheduledTaskAction -Execute $nodePath -Argument "scripts\buffer_daily_publisher_5pm.mjs" -WorkingDirectory $workingDir
$trigger6 = New-ScheduledTaskTrigger -Daily -At 5:00PM
Register-ScheduledTask -TaskName 'AuditFlow_SocialAutopilot_5PM' -Action $action6 -Trigger $trigger6 -Settings $settings -Force | Out-Null
Write-Host "✅ AuditFlow_SocialAutopilot_5PM (5:00 PM) reconfigurada." -ForegroundColor Green

# 7. 6:00 PM - Reporte Ejecutivo Financiero Cierre
$action7 = New-ScheduledTaskAction -Execute $nodePath -Argument "scripts\dispatch_sales_report_6pm.js" -WorkingDirectory $workingDir
$trigger7 = New-ScheduledTaskTrigger -Daily -At 6:00PM
Register-ScheduledTask -TaskName 'AuditFlow_DailyReport_6PM' -Action $action7 -Trigger $trigger7 -Settings $settings -Force | Out-Null
Write-Host "✅ AuditFlow_DailyReport_6PM (6:00 PM) reconfigurada." -ForegroundColor Green

Write-Host "`nTodas las tareas han sido corregidas con ejecución directa de node.exe y tolerancia a suspensión/batería." -ForegroundColor Cyan
