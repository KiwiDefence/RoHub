# Builds the RoHub Travel Android app (debug APK) and installs it on a
# USB-connected phone if one is found.
#   npm run app:build                      -> server = this PC's Wi-Fi IP:4000
#   npm run app:build -- -Api http://x:4000 -> custom Piticot server
param(
  [string]$Api = ""
)
$ErrorActionPreference = "Stop"
$repo = Resolve-Path "$PSScriptRoot\..\.."
Set-Location $repo

$env:JAVA_HOME = "C:\Android\jdk21"
$env:ANDROID_HOME = "C:\Android\Sdk"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"

if (-not $Api) {
  $ip = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.PrefixOrigin -in @("Dhcp", "Manual") -and $_.IPAddress -notlike "169.254*" -and $_.IPAddress -notlike "127.*" -and $_.InterfaceAlias -notmatch "vEthernet|WSL|Tailscale|VirtualBox|VMware" } |
    Sort-Object { if ($_.InterfaceAlias -match "Wi-?Fi|Wireless|WLAN") { 0 } else { 1 } } |
    Select-Object -First 1 -ExpandProperty IPAddress
  if ($ip) { $Api = "http://${ip}:4000" }
}
$env:NEXT_PUBLIC_PITICOT_API = $Api
$env:NEXT_PUBLIC_BASE_PATH = ""
Write-Host "Piticot server baked into the app: $(if ($Api) { $Api } else { '(none)' })"

npm run build
if ($LASTEXITCODE -ne 0) { throw "Next build failed" }
npx cap sync android
if ($LASTEXITCODE -ne 0) { throw "cap sync failed" }

Push-Location android
.\gradlew.bat assembleDebug --console=plain
$gradleExit = $LASTEXITCODE
Pop-Location
if ($gradleExit -ne 0) { throw "Gradle build failed" }

$outDir = "$repo\private\app"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null
$apk = "$outDir\RoHubTravel.apk"
Copy-Item "android\app\build\outputs\apk\debug\app-debug.apk" $apk -Force
Write-Host "APK: $apk"

$devices = & adb devices | Select-String "\tdevice$"
if ($devices) {
  Write-Host "Installing on connected phone..."
  & adb install -r $apk
  & adb shell monkey -p com.rohubtravel.app -c android.intent.category.LAUNCHER 1 | Out-Null
} else {
  Write-Host "No phone on USB. Copy the APK to the phone and open it to install."
}
