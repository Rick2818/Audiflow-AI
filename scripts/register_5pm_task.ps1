$action = New-ScheduledTaskAction -Execute 'cmd.exe' -Argument '/c "c:\Users\Ricardo\Desktop\Audiflow Ai\scripts\run_buffer_daily_5pm.bat"'
$trigger = New-ScheduledTaskTrigger -Daily -At 5:00PM
Register-ScheduledTask -TaskName 'AuditFlow_SocialAutopilot_5PM' -Action $action -Trigger $trigger -Force
Write-Host "SUCCESS: AuditFlow_SocialAutopilot_5PM registered successfully."
