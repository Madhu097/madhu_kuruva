Add-Type -AssemblyName System.Drawing

function Optimize-OGImage($srcPath, $dstPath, [long]$quality = 82) {
    $bytes = [System.IO.File]::ReadAllBytes($srcPath)
    $ms = New-Object System.IO.MemoryStream(,$bytes)
    $img = [System.Drawing.Image]::FromStream($ms)
    $targetW = 1200
    $targetH = 630
    $bmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
    $g.DrawImage($img, $destRect)
    
    $jpegCodec = $null
    foreach ($codec in [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()) {
        if ($codec.MimeType -eq 'image/jpeg') {
            $jpegCodec = $codec
            break
        }
    }
    
    $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)
    
    $bmp.Save($dstPath, $jpegCodec, $encoderParams)
    
    $g.Dispose()
    $bmp.Dispose()
    $img.Dispose()
    $ms.Dispose()
}

$source = "d:\projects\portfolio\public\og-name.jpg"
$temp = "d:\projects\portfolio\public\og-temp.jpg"

Optimize-OGImage $source $temp 82

Copy-Item $temp "d:\projects\portfolio\public\og-name.jpg" -Force
Copy-Item $temp "d:\projects\portfolio\public\og-image.jpg" -Force
Remove-Item $temp -Force

$item = Get-Item "d:\projects\portfolio\public\og-name.jpg"
Write-Output "Optimized size: $($item.Length) bytes ($([math]::Round($item.Length / 1024, 1)) KB)"
