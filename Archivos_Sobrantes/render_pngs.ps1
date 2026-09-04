Add-Type -AssemblyName System.Drawing

# 1. GENERATE AVATAR PNG (600x600 px)
$bmpAvatar = New-Object System.Drawing.Bitmap(600, 600)
$g = [System.Drawing.Graphics]::FromImage($bmpAvatar)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Background
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(600, 600)),
    [System.Drawing.Color]::FromArgb(255, 5, 6, 8),
    [System.Drawing.Color]::FromArgb(255, 18, 16, 14)
)
$g.FillRectangle($bgBrush, 0, 0, 600, 600)

# Circular Ring
$penGold = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(70, 212, 175, 55), 2)
$penGold.DashStyle = [System.Drawing.Drawing2D.DashStyle]::Dash
$g.DrawEllipse($penGold, 25, 25, 550, 550)

# Monogram A: Left Leg (White)
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$pathLeft = New-Object System.Drawing.Drawing2D.GraphicsPath
$ptsLeft = @(
    (New-Object System.Drawing.PointF(170, 420)),
    (New-Object System.Drawing.PointF(275, 130)),
    (New-Object System.Drawing.PointF(320, 130)),
    (New-Object System.Drawing.PointF(215, 420))
)
$pathLeft.AddPolygon($ptsLeft)
$g.FillPath($whiteBrush, $pathLeft)

# Monogram A: Right Leg (Gold Gradient)
$goldBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(260, 130)),
    (New-Object System.Drawing.Point(430, 420)),
    [System.Drawing.Color]::FromArgb(255, 254, 243, 214),
    [System.Drawing.Color]::FromArgb(255, 184, 147, 43)
)
$pathRight = New-Object System.Drawing.Drawing2D.GraphicsPath
$ptsRight = @(
    (New-Object System.Drawing.PointF(265, 130)),
    (New-Object System.Drawing.PointF(310, 130)),
    (New-Object System.Drawing.PointF(425, 420)),
    (New-Object System.Drawing.PointF(380, 420))
)
$pathRight.AddPolygon($ptsRight)
$g.FillPath($goldBrush, $pathRight)

# Crossbar (Gold)
$rectBar = New-Object System.Drawing.RectangleF(220, 290, 155, 32)
$g.FillRectangle($goldBrush, $rectBar)

# Brand Text
$font = New-Object System.Drawing.Font('Arial', 24, [System.Drawing.FontStyle]::Bold)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$g.DrawString('AUDIFLOWAI', $font, $whiteBrush, 300, 480, $sf)

$bmpAvatar.Save('avatar_audiflowai.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmpAvatar.Dispose()


# 2. GENERATE BANNER PNG (1128x191 px)
$bmpBanner = New-Object System.Drawing.Bitmap(1128, 191)
$gb = [System.Drawing.Graphics]::FromImage($bmpBanner)
$gb.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$gb.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Background
$bgBannerBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    (New-Object System.Drawing.Point(0, 0)),
    (New-Object System.Drawing.Point(1128, 191)),
    [System.Drawing.Color]::FromArgb(255, 4, 5, 7),
    [System.Drawing.Color]::FromArgb(255, 20, 18, 14)
)
$gb.FillRectangle($bgBannerBrush, 0, 0, 1128, 191)

# Badge: LEGALTECH & FINANCIAL DUE DILIGENCE
$badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 20, 18, 12))
$badgePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 212, 175, 55), 1)
$gb.FillRectangle($badgeBrush, 185, 20, 310, 22)
$gb.DrawRectangle($badgePen, 185, 20, 310, 22)

$badgeFont = New-Object System.Drawing.Font('Arial', 8, [System.Drawing.FontStyle]::Bold)
$goldTextBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 212, 175, 55))
$gb.DrawString('* LEGALTECH & FINANCIAL DUE DILIGENCE', $badgeFont, $goldTextBrush, 195, 24)

# Headline
$titleFont = New-Object System.Drawing.Font('Arial', 16, [System.Drawing.FontStyle]::Bold)
$gb.DrawString('Due Diligence & Auditoria Juridico-Contable en Minutos.', $titleFont, $whiteBrush, 185, 50)

# Subtitle
$subFont = New-Object System.Drawing.Font('Arial', 9, [System.Drawing.FontStyle]::Regular)
$grayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 170, 160, 140))
$gb.DrawString('Disenado para Directores Legales, General Counsel, Compliance y CFOs', $subFont, $grayBrush, 185, 80)

# Features
$featFont = New-Object System.Drawing.Font('Arial', 8.5, [System.Drawing.FontStyle]::Bold)
$gb.DrawString('+ Pasivos Ocultos    + Redlines de Contratos    + Cero Alucinaciones', $featFont, $goldTextBrush, 185, 108)

# Footer Stamp
$stampFont = New-Object System.Drawing.Font('Arial', 7.5, [System.Drawing.FontStyle]::Regular)
$darkGrayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 120, 115, 100))
$gb.DrawString('PRIVACIDAD DE GRADO BANCARIO | AUDITORIA EN MEMORIA VOLATIL | AUDIFLOWAI.COM', $stampFont, $darkGrayBrush, 185, 135)

# Right Emblem Box
$gb.FillRectangle($badgeBrush, 940, 20, 135, 150)
$gb.DrawRectangle($badgePen, 940, 20, 135, 150)

# Monogram inside banner
$pathBLeft = New-Object System.Drawing.Drawing2D.GraphicsPath
$ptsBLeft = @(
    (New-Object System.Drawing.PointF(975, 110)),
    (New-Object System.Drawing.PointF(1005, 45)),
    (New-Object System.Drawing.PointF(1015, 45)),
    (New-Object System.Drawing.PointF(985, 110))
)
$pathBLeft.AddPolygon($ptsBLeft)
$gb.FillPath($whiteBrush, $pathBLeft)

$pathBRight = New-Object System.Drawing.Drawing2D.GraphicsPath
$ptsBRight = @(
    (New-Object System.Drawing.PointF(1000, 45)),
    (New-Object System.Drawing.PointF(1010, 45)),
    (New-Object System.Drawing.PointF(1040, 110)),
    (New-Object System.Drawing.PointF(1030, 110))
)
$pathBRight.AddPolygon($ptsBRight)
$gb.FillPath($goldBrush, $pathBRight)

$gb.FillRectangle($goldBrush, 988, 80, 40, 7)

$logoFont = New-Object System.Drawing.Font('Arial', 8.5, [System.Drawing.FontStyle]::Bold)
$gb.DrawString('AUDIFLOWAI.COM', $logoFont, $goldTextBrush, 950, 130)

$bmpBanner.Save('banner_audiflowai.png', [System.Drawing.Imaging.ImageFormat]::Png)
$gb.Dispose()
$bmpBanner.Dispose()

Write-Output 'PNG_GENERATION_SUCCESS'
