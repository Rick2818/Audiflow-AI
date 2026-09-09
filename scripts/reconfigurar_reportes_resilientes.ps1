$nodePath = "C:\Program Files\nodejs\node.exe"
$workingDir = "C:\Users\Ricardo\Desktop\Audiflow Ai"

$settings = New-ScheduledTaskSettingsSet -WakeToRun -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 15)

$action2 = New-ScheduledTaskAction -Execute $nodePath -Argument "scripts\dispatch_sales_report_2pm.js" -WorkingDirectory $workingDir
$trigger2 = New-ScheduledTaskTrigger -Daily -At 2:00PM
Register-ScheduledTask -TaskName 'AuditFlow_DailyReport_2PM' -Action $action2 -Trigger $trigger2 -Settings $settings -Force

$action6 = New-ScheduledTaskAction -Execute $nodePath -Argument "scripts\dispatch_sales_report_6pm.js" -WorkingDirectory $workingDir
$trigger6 = New-ScheduledTaskTrigger -Daily -At 6:00PM
Register-ScheduledTask -TaskName 'AuditFlow_DailyReport_6PM' -Action $action6 -Trigger $trigger6 -Settings $settings -Force

Write-Host "SUCCESS: Tareas de reporte 2:00 PM y 6:00 PM configuradas con ejecucion directa node.exe, WakeToRun y tolerancia a suspension."
