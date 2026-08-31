<#
.SYNOPSIS
    Script Oficial de Respaldo Dual Simultaneo (Git + Google Drive) para AuditFlow AI
    Regla de Oro: Ejecutar obligatoriamente tras cada cambio relevante.
#>
param(
    [string]$CommitMessage = "chore(sync): automated dual backup to Git and Google Drive"
)

$baseDir = "c:\Users\Ricardo\Desktop\Audiflow Ai"
$gdriveBackup = "C:\Users\Ricardo\Desktop\Google_Drive_Audiflow_AI_Backup"

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🔄 INICIANDO PROTOCOLO DE RESPALDO DUAL (GIT + GOOGLE DRIVE)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

# 1. SINCRONIZACION A GOOGLE DRIVE BACKUP
Write-Host "`n[1/2] Sincronizando réplica espejo a Google Drive Backup..." -ForegroundColor Yellow
if (!(Test-Path $gdriveBackup)) { New-Item -ItemType Directory -Path $gdriveBackup -Force | Out-Null }

$foldersToSync = @(
    "inicio proyecto Audiflow",
    "todos los archivos fuente de Audiflow",
    "Audiflow Marketing",
    "Ventas Audiflow",
    "Audiflow Master Prompt"
)

foreach ($f in $foldersToSync) {
    $src = "$baseDir\$f"
    $dst = "$gdriveBackup\$f"
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $dst -Recurse -Force
        Write-Host "  ✅ Carpeta sincronizada a Google Drive: $f" -ForegroundColor Green
    }
}

$rootFiles = @("README.md", "package.json", "vercel.json", "server.js", "Plantilla_Auditoria_Redlines_AuditFlow_AI.docx")
foreach ($rf in $rootFiles) {
    $src = "$baseDir\$rf"
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $gdriveBackup -Force
    }
}
Write-Host "  ✅ [OK] Respaldo Google Drive actualizado al 100%." -ForegroundColor Green

# 2. SINCRONIZACION A GIT Y VERCEL
Write-Host "`n[2/2] Sincronizando respaldo a GitHub y Vercel Production..." -ForegroundColor Yellow
Set-Location -Path $baseDir
git add .
git commit -m "$CommitMessage"
git push origin main
Write-Host "  ✅ [OK] Respaldo Git & Vercel desplegado exitosamente." -ForegroundColor Green

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host "🎉 RESPALDO DUAL COMPLETADO EXITOSAMENTE (GIT + GOOGLE DRIVE)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
