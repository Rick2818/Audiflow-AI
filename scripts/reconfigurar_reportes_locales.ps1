$action6 = New-ScheduledTaskAction -Execute "cmd.exe" -Argument '/c "c:\Users\Ricardo\Desktop\Audiflow Ai\scripts\run_daily_sales_report_6pm.bat"'
$trigger6 = New-ScheduledTaskTrigger -Daily -At 6:00PM
Register-ScheduledTask -TaskName 'AuditFlow_DailyReport_6PM' -Action $action6 -Trigger $trigger6 -Force

$action2 = New-ScheduledTaskAction -Execute "cmd.exe" -Argument '/c "c:\Users\Ricardo\Desktop\Audiflow Ai\scripts\run_daily_sales_report_2pm.bat"'
$trigger2 = New-ScheduledTaskTrigger -Daily -At 2:00PM
Register-ScheduledTask -TaskName 'AuditFlow_DailyReport_2PM' -Action $action2 -Trigger $trigger2 -Force

Write-Host "SUCCESS: Tareas de reporte financiero (2:00 PM y 6:00 PM) vinculadas a scripts locales directos y programadas DIARIAMENTE."
