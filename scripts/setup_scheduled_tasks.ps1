# AuditFlow AI - Registro de Tareas Programadas en Windows Task Scheduler
$action2 = New-ScheduledTaskAction -Execute "powershell.exe" -Argument '-WindowStyle Hidden -NoProfile -Command "Invoke-RestMethod -Uri \"https://audiflowai.com/api/admin?action=daily_sales_report&slot=2:00+PM\" -Method Get"'
$trigger2 = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday -At 14:00
Register-ScheduledTask -TaskName "AuditFlow_DailyReport_2PM" -Action $action2 -Trigger $trigger2 -Description "AuditFlow AI - Despacho automatico de Reporte de Ventas 2:00 PM" -Force

$action6 = New-ScheduledTaskAction -Execute "powershell.exe" -Argument '-WindowStyle Hidden -NoProfile -Command "Invoke-RestMethod -Uri \"https://audiflowai.com/api/admin?action=daily_sales_report&slot=6:00+PM\" -Method Get"'
$trigger6 = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday,Tuesday,Wednesday,Thursday,Friday -At 18:00
Register-ScheduledTask -TaskName "AuditFlow_DailyReport_6PM" -Action $action6 -Trigger $trigger6 -Description "AuditFlow AI - Despacho automatico de Reporte de Ventas 6:00 PM" -Force

Get-ScheduledTask -TaskName "AuditFlow_DailyReport_*" | Format-Table TaskName, State
