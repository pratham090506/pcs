$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8085/')
$listener.Start()
Write-Host "Server running at http://localhost:8085/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response
    
    # Add anti-cache headers so mobile browsers get instant updates
    $res.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
    $res.AddHeader("Pragma", "no-cache")
    $res.AddHeader("Expires", "0")
    $res.AddHeader("Access-Control-Allow-Origin", "*")

    $urlPath = $req.Url.LocalPath
    if ($urlPath -eq '/') { $urlPath = '/index.html' }
    $filePath = Join-Path (Get-Location) $urlPath.Substring(1)

    if (Test-Path $filePath -PathType Leaf) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        switch ($ext) {
            ".html" { $res.ContentType = "text/html; charset=utf-8" }
            ".css"  { $res.ContentType = "text/css; charset=utf-8" }
            ".js"   { $res.ContentType = "application/javascript; charset=utf-8" }
            ".svg"  { $res.ContentType = "image/svg+xml" }
            ".jpg"  { $res.ContentType = "image/jpeg" }
            ".png"  { $res.ContentType = "image/png" }
            default { $res.ContentType = "application/octet-stream" }
        }
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $res.StatusCode = 404
    }
    $res.OutputStream.Close()
}
