Add-Type -AssemblyName System.Windows.Forms,System.Drawing
$bounds = [System.Drawing.Rectangle]::FromLTRB(0, 0, 1920, 1080)
$bmp = New-Object System.Drawing.Bitmap $bounds.width, $bounds.height
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.size)
$bmp.Save('C:\Users\damat\_REPOS\AD\login_screen_test.png', [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bmp.Dispose()
Write-Host "Screenshot saved successfully"