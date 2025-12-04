# Build MSIX package for Microsoft Store
# Usage: .\scripts\build-msix.ps1 -Version "0.1.0"

param(
    [string]$Version = "0.1.6"
)

$ErrorActionPreference = "Stop"

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  📦 Building Novel Editor for Microsoft Store" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Get project root
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $ProjectRoot

# 1. Build Tauri app
Write-Host "Step 1: Building Tauri application..." -ForegroundColor Yellow
Write-Host ""

Set-Location "apps/desktop"

# Check if bun is installed
if (-not (Get-Command bun -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Bun is not installed" -ForegroundColor Red
    Write-Host "Install from: https://bun.sh" -ForegroundColor Yellow
    exit 1
}

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Gray
bun run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Frontend build failed" -ForegroundColor Red
    exit 1
}

# Build Tauri app
Write-Host "Building Tauri app..." -ForegroundColor Gray
bun run tauri build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Tauri build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Build completed" -ForegroundColor Green
Write-Host ""

# 2. Find the built files
Write-Host "Step 2: Locating build artifacts..." -ForegroundColor Yellow

$ExePath = "src-tauri/target/release/novel-editor.exe"
$MsiPath = "src-tauri/target/release/bundle/msi/novel-editor_${Version}_x64_en-US.msi"

if (-not (Test-Path $ExePath)) {
    Write-Host "Error: Executable not found at $ExePath" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Executable found: $ExePath" -ForegroundColor Green

if (Test-Path $MsiPath) {
    Write-Host "✓ MSI found: $MsiPath" -ForegroundColor Green
} else {
    Write-Host "⚠ MSI not found (optional)" -ForegroundColor Yellow
}

Write-Host ""

# 3. Create MSIX package directory
Write-Host "Step 3: Preparing MSIX package..." -ForegroundColor Yellow

$MsixDir = "../../dist/msix-temp"
$AssetsDir = "$MsixDir/Assets"

# Clean and create directories
if (Test-Path $MsixDir) {
    Remove-Item $MsixDir -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $MsixDir | Out-Null
New-Item -ItemType Directory -Force -Path $AssetsDir | Out-Null

# Copy executable
Copy-Item $ExePath "$MsixDir/novel-editor.exe" -Force
Write-Host "✓ Copied executable" -ForegroundColor Green

# Copy icons
$IconsPath = "src-tauri/icons"
if (Test-Path $IconsPath) {
    Copy-Item "$IconsPath/*" $AssetsDir -Recurse -Force
    Write-Host "✓ Copied icons" -ForegroundColor Green
}

Write-Host ""

# 4. Create AppxManifest.xml
Write-Host "Step 4: Creating AppxManifest.xml..." -ForegroundColor Yellow

$ManifestContent = @"
<?xml version="1.0" encoding="utf-8"?>
<Package xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
         xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
         xmlns:rescap="http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities">
  
  <Identity Name="NovelEditor"
            Publisher="CN=Lotus"
            Version="$Version.0" />
  
  <Properties>
    <DisplayName>小说编辑器</DisplayName>
    <PublisherDisplayName>Lotus</PublisherDisplayName>
    <Logo>Assets\StoreLogo.png</Logo>
    <Description>专为小说创作者设计的现代化写作工具</Description>
  </Properties>
  
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.17763.0" MaxVersionTested="10.0.22621.0" />
  </Dependencies>
  
  <Resources>
    <Resource Language="zh-CN"/>
    <Resource Language="en-US"/>
  </Resources>
  
  <Applications>
    <Application Id="NovelEditor" 
                 Executable="novel-editor.exe" 
                 EntryPoint="Windows.FullTrustApplication">
      <uap:VisualElements DisplayName="小说编辑器"
                          Description="专为小说创作者设计的现代化写作工具，支持大纲管理、角色管理、场景编辑等功能"
                          BackgroundColor="transparent"
                          Square150x150Logo="Assets\Square150x150Logo.png"
                          Square44x44Logo="Assets\Square44x44Logo.png">
        <uap:DefaultTile Wide310x150Logo="Assets\Wide310x150Logo.png" 
                         Square310x310Logo="Assets\LargeTile.png" 
                         Square71x71Logo="Assets\SmallTile.png">
        </uap:DefaultTile>
        <uap:SplashScreen Image="Assets\SplashScreen.png" />
      </uap:VisualElements>
    </Application>
  </Applications>
  
  <Capabilities>
    <rescap:Capability Name="runFullTrust" />
  </Capabilities>
  
</Package>
"@

$ManifestContent | Out-File -FilePath "$MsixDir/AppxManifest.xml" -Encoding UTF8
Write-Host "✓ Manifest created" -ForegroundColor Green
Write-Host ""

# 5. Check for MakeAppx.exe
Write-Host "Step 5: Checking for Windows SDK..." -ForegroundColor Yellow

$MakeAppxPaths = @(
    "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\MakeAppx.exe",
    "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22000.0\x64\MakeAppx.exe",
    "C:\Program Files (x86)\Windows Kits\10\bin\10.0.19041.0\x64\MakeAppx.exe"
)

$MakeAppx = $null
foreach ($path in $MakeAppxPaths) {
    if (Test-Path $path) {
        $MakeAppx = $path
        break
    }
}

if (-not $MakeAppx) {
    Write-Host "⚠ MakeAppx.exe not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install Windows SDK from:" -ForegroundColor Yellow
    Write-Host "https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Or use MSIX Packaging Tool:" -ForegroundColor Yellow
    Write-Host "https://www.microsoft.com/store/productId/9N5LW3JBCXKF" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Files prepared in: $MsixDir" -ForegroundColor Green
    exit 0
}

Write-Host "✓ Found MakeAppx.exe" -ForegroundColor Green
Write-Host ""

# 6. Create MSIX package
Write-Host "Step 6: Creating MSIX package..." -ForegroundColor Yellow

$OutputDir = "../../dist"
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
}

$MsixPath = "$OutputDir/NovelEditor_$Version.msix"

& $MakeAppx pack /d $MsixDir /p $MsixPath /o

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: MSIX packaging failed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ MSIX package created" -ForegroundColor Green
Write-Host ""

# 7. Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  ✅ Build completed successfully!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 MSIX Package:" -ForegroundColor Cyan
Write-Host "   Location: $MsixPath" -ForegroundColor White
Write-Host "   Version: $Version" -ForegroundColor White
Write-Host ""

$FileSize = (Get-Item $MsixPath).Length / 1MB
Write-Host "   Size: $([math]::Round($FileSize, 2)) MB" -ForegroundColor White
Write-Host ""

Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test the MSIX package locally" -ForegroundColor White
Write-Host "   2. Upload to Microsoft Partner Center" -ForegroundColor White
Write-Host "   3. Fill in app information" -ForegroundColor White
Write-Host "   4. Submit for review" -ForegroundColor White
Write-Host ""

Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   - The MSIX will be automatically signed by Microsoft Store" -ForegroundColor White
Write-Host "   - Make sure to provide privacy policy and screenshots" -ForegroundColor White
Write-Host "   - Review process usually takes 1-3 business days" -ForegroundColor White
Write-Host ""

# Clean up temp directory
Write-Host "🧹 Cleaning up..." -ForegroundColor Gray
Remove-Item $MsixDir -Recurse -Force
Write-Host "✓ Done" -ForegroundColor Green
Write-Host ""
