$nodePath = "C:\Program Files\nodejs\node.exe"
$workingDir = "c:\Users\Ricardo\Desktop\Audiflow Ai"
$scriptPath = "scripts\dispatch_centroamerica_8am_cron.mjs"

$settings = New-ScheduledTaskSettingsSet -WakeToRun -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 20)

$action = New-ScheduledTaskAction -Execute $nodePath -Argument $scriptPath -WorkingDirectory $workingDir
$trigger = New-ScheduledTaskTrigger -Daily -At 8:00AM

Register-ScheduledTask -TaskName "AuditFlow_Outreach_Centroamerica_8AM" -Action $action -Trigger $trigger -Settings $settings -Description "AuditFlow AI - Despacho Matutino Centroamerica (Bufetes y CFOs Reales 8:00 AM CST)" -Force

Write-Host "SUCCESS: Tarea AuditFlow_Outreach_Centroamerica_8AM registrada exitosamente."
Get-ScheduledTask -TaskName "AuditFlow_Outreach_Centroamerica_8AM" | Select-Object TaskName, State, @{Name="NextRunTime";Expression={($_ | Get-ScheduledTaskInfo).NextRunTime}} | Format-Table -AutoSize
