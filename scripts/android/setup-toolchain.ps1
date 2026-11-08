# Installs a portable JDK 21 + Android SDK (command-line tools) into C:\Android.
# No admin rights needed. Safe to re-run.
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"
$root = "C:\Android"
$jdkDir = "$root\jdk21"
$sdkDir = "$root\Sdk"
New-Item -ItemType Directory -Force -Path $root, $sdkDir | Out-Null

if (-not (Test-Path "$jdkDir\bin\java.exe")) {
  Write-Host "Downloading JDK 21..."
  $zip = "$root\jdk21.zip"
  Invoke-WebRequest "https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse" -OutFile $zip
  Expand-Archive $zip -DestinationPath "$root\jdk-tmp" -Force
  $inner = Get-ChildItem "$root\jdk-tmp" -Directory | Select-Object -First 1
  Move-Item $inner.FullName $jdkDir
  Remove-Item "$root\jdk-tmp", $zip -Recurse -Force
}

$sdkmanager = "$sdkDir\cmdline-tools\latest\bin\sdkmanager.bat"
if (-not (Test-Path $sdkmanager)) {
  Write-Host "Resolving latest Android command-line tools..."
  $xml = (Invoke-WebRequest "https://dl.google.com/android/repository/repository2-3.xml" -UseBasicParsing).Content
  $name = [regex]::Matches($xml, "commandlinetools-win-(\d+)_latest\.zip") | Sort-Object { [int64]$_.Groups[1].Value } | Select-Object -Last 1 | ForEach-Object { $_.Value }
  if (-not $name) { $name = "commandlinetools-win-13114758_latest.zip" }
  Write-Host "Downloading $name..."
  $zip = "$root\cmdline-tools.zip"
  Invoke-WebRequest "https://dl.google.com/android/repository/$name" -OutFile $zip
  Expand-Archive $zip -DestinationPath "$sdkDir\cmdline-tmp" -Force
  New-Item -ItemType Directory -Force -Path "$sdkDir\cmdline-tools" | Out-Null
  Move-Item "$sdkDir\cmdline-tmp\cmdline-tools" "$sdkDir\cmdline-tools\latest"
  Remove-Item "$sdkDir\cmdline-tmp", $zip -Recurse -Force
}

$env:JAVA_HOME = $jdkDir
$env:ANDROID_HOME = $sdkDir
$env:Path = "$jdkDir\bin;$sdkDir\platform-tools;$env:Path"

Write-Host "Installing platform packages..."
$androidCli = "$sdkDir\cmdline-tools\latest\bin\android.exe"
if (Test-Path $androidCli) {
  & $androidCli --sdk=$sdkDir sdk install platform-tools platforms/android-36 build-tools/36.0.0
} else {
  $yes = ("y`n" * 30)
  $yes | & $sdkmanager --sdk_root=$sdkDir --licenses | Out-Null
  & $sdkmanager --sdk_root=$sdkDir "platform-tools" "platforms;android-36" "build-tools;36.0.0"
}

[Environment]::SetEnvironmentVariable("JAVA_HOME", $jdkDir, "User")
[Environment]::SetEnvironmentVariable("ANDROID_HOME", $sdkDir, "User")
Write-Host "DONE. JAVA_HOME=$jdkDir ANDROID_HOME=$sdkDir"
