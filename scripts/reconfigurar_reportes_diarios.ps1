$action6 = New-ScheduledTaskAction -Execute "powershell.exe" -Argument '-WindowStyle Hidden -NoProfile -Command "Invoke-RestMethod -Uri \"https://audiflowai.com/api/admin?action=daily_sales_report&slot=6:00+PM\" -Method Get"'
$trigger6 = New-ScheduledTaskTrigger -Daily -At 6:00PM
Register-ScheduledTask -TaskName 'AuditFlow_DailyReport_6PM' -Action $action6 -Trigger $trigger6 -Force

$action2 = New-ScheduledTaskAction -Execute "powershell.exe" -Argument '-WindowStyle Hidden -NoProfile -Command "Invoke-RestMethod -Uri \"https://audiflowai.com/api/admin?action=daily_sales_report&slot=2:00+PM\" -Method Get"'
$trigger2 = New-ScheduledTaskTrigger -Daily -At 2:00PM
Register-ScheduledTask -TaskName 'AuditFlow_DailyReport_2PM' -Action $action2 -Trigger $trigger2 -Force

Write-Host "SUCCESS: Ambas tareas de reporte diario (2:00 PM y 6:00 PM) configuradas para correr TODOS LOS DIAS (Lunes a Domingo)."
