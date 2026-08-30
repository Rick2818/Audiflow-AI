Add-Type -AssemblyName System.Drawing

# GENERATE FACEBOOK PAGE COVER BANNER (1640 x 624 px — Retina 820x312)
$width = 1640
$height = 624
$bmp = New-Object System.Drawing.Bitmap($width, $height)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# 1. Background Gradient (Deep Obsidian / Black Luxury)
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point($width, $height)),
    [System.Drawing.Color]::FromArgb(255, 6, 7, 10),
    [System.Drawing.Color]::FromArgb(255, 18, 16, 14)
)
$g.FillRectangle($bgBrush, 0, 0, $width, $height)

# 2. Subtle Gold Glows
$glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 212, 175, 55))
$g.FillEllipse($glowBrush, 1300, 100, 400, 400)
$g.FillEllipse($glowBrush, -100, 200, 350, 350)

# 3. Gold Eyebrow Badge (Centrado en zona segura)
$badgeX = 120
$badgeY = 90
$badgeWidth = 520
$badgeHeight = 44
$badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(240, 20, 18, 14))
$badgePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 212, 175, 55), 1.5)
$g.FillRectangle($badgeBrush, $badgeX, $badgeY, $badgeWidth, $badgeHeight)
$g.DrawRectangle($badgePen, $badgeX, $badgeY, $badgeWidth, $badgeHeight)

$badgeFont = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold)
$goldTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 212, 175, 55))
$g.DrawString('★ LEGALTECH & FINANCIAL DUE DILIGENCE', $badgeFont, $goldTextBrush, ($badgeX + 18), ($badgeY + 11))

# 4. Main Headline
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$titleFont = New-Object System.Drawing.Font('Arial', 32, [System.Drawing.FontStyle]::Bold)
$g.DrawString('Due Diligence & Auditoría Jurídico-Contable', $titleFont, $whiteBrush, $badgeX, 160)
$g.DrawString('en Tiempo Real con IA Determinista', $titleFont, $goldTextBrush, $badgeX, 215)

# 5. Subtitle
$subFont = New-Object System.Drawing.Font('Arial', 18, [System.Drawing.FontStyle]::Regular)
$grayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 180, 175, 160))
$g.DrawString('Diseñado para Directores Legales, General Counsel, Compliance y CFOs', $subFont, $grayBrush, $badgeX, 290)

# 6. Feature Pillars (Puntos de valor)
$pillarFont = New-Object System.Drawing.Font('Arial', 16, [System.Drawing.FontStyle]::Bold)
$pillarText = '✦ Pasivos Ocultos    ✦ Redlines de Contratos    ✦ Cero Alucinaciones'
$g.DrawString($pillarText, $pillarFont, $goldTextBrush, $badgeX, 360)

# 7. Trust Stamp Footer
$footerFont = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold)
$footerGray = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 130, 125, 115))
$g.DrawString('🔒 PRIVACIDAD EN MEMORIA VOLÁTIL • COBERTURA 14 PAÍSES • AUDIFLOWAI.COM', $footerFont, $footerGray, $badgeX, 440)

# 8. Right Side Logo Emblem Card
$cardX = 1260
$cardY = 120
$cardWidth = 260
$cardHeight = 360
$cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(200, 12, 14, 18))
$cardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 212, 175, 55), 2)
$g.FillRectangle($cardBrush, $cardX, $cardY, $cardWidth, $cardHeight)
$g.DrawRectangle($cardPen, $cardX, $cardY, $cardWidth, $cardHeight)

# Logo Monogram A inside card
$pathLeft = New-Object System.Drawing.Drawing2D.GraphicsPath
$ptsLeft = @(
    (New-Object System.Drawing.PointF(($cardX + 60), ($cardY + 240))),
    (New-Object System.Drawing.PointF(($cardX + 115), ($cardY + 70))),
    (New-Object System.Drawing.PointF(($cardX + 140), ($cardY + 70))),
    (New-Object System.Drawing.PointF(($cardX + 85), ($cardY + 240)))
)
$pathLeft.AddPolygon($ptsLeft)
$g.FillPath($whiteBrush, $pathLeft)

$goldBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(($cardX + 110), ($cardY + 70))),
    (New-Object System.Drawing.Point(($cardX + 200), ($cardY + 240))),
    [System.Drawing.Color]::FromArgb(255, 254, 243, 214),
    [System.Drawing.Color]::FromArgb(255, 184, 147, 43)
)
$pathRight = New-Object System.Drawing.Drawing2D.GraphicsPath
$ptsRight = @(
    (New-Object System.Drawing.PointF(($cardX + 110), ($cardY + 70))),
    (New-Object System.Drawing.PointF(($cardX + 135), ($cardY + 70))),
    (New-Object System.Drawing.PointF(($cardX + 195), ($cardY + 240))),
    (New-Object System.Drawing.PointF(($cardX + 170), ($cardY + 240)))
)
$pathRight.AddPolygon($ptsRight)
$g.FillPath($goldBrush, $pathRight)

$rectBar = New-Object System.Drawing.RectangleF(($cardX + 88), ($cardY + 160), 80, 18)
$g.FillRectangle($goldBrush, $rectBar)

$logoFont = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString('AUDIFLOWAI.COM', $logoFont, $whiteBrush, ($cardX + ($cardWidth / 2)), ($cardY + 280), $sf)

# Save image files
$bmp.Save('c:\Users\Ricardo\Desktop\Audiflow Ai\banner_facebook_audiflowai.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('c:\Users\Ricardo\Desktop\Audiflow Ai\banner_audiflowai.png', [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
Write-Host "✅ Banner de Facebook regenerado con dimensiones exactas 1640x624!"
