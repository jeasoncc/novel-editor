# 📦 Microsoft Store 发布指南

## 🔍 审核失败原因

根据你的截图，审核失败的主要原因是：

### ❌ Code sign check 失败

**错误信息**:
> Your app does not have a digital signature which violates Microsoft Store Policy 10.2.9

**原因**: 
- 直接上传的 EXE 文件没有数字签名
- Microsoft Store 要求所有应用必须有有效的数字签名

## 🎯 解决方案

### 方案 A: 使用 MSIX 打包（强烈推荐）

Microsoft Store 推荐使用 MSIX 格式，MSIX 会自动处理签名问题。

#### 优点
- ✅ 自动签名
- ✅ 更好的安装体验
- ✅ 自动更新支持
- ✅ 符合 Microsoft Store 要求

#### 步骤

##### 1. 安装 Windows SDK

下载并安装 [Windows SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/)

或使用 Visual Studio Installer 安装 "Windows 10 SDK"

##### 2. 配置 Tauri 生成 MSIX

更新 `tauri.conf.json`:

```json
{
  "bundle": {
    "active": true,
    "targets": ["msi", "nsis"],
    "windows": {
      "certificateThumbprint": null,
      "digestAlgorithm": "sha256",
      "timestampUrl": ""
    }
  }
}
```

##### 3. 构建 MSIX 包

```bash
# 在 Windows 上构建
cd apps/desktop
bun run tauri build -- --target x86_64-pc-windows-msvc
```

这会生成：
- `novel-editor_0.1.0_x64.msi`
- `novel-editor_0.1.0_x64-setup.exe` (NSIS)

##### 4. 使用 MSIX Packaging Tool

1. 下载 [MSIX Packaging Tool](https://www.microsoft.com/store/productId/9N5LW3JBCXKF)

2. 打开 MSIX Packaging Tool

3. 选择 "Application package"

4. 选择 "Create package on this computer"

5. 选择你的 MSI 或 EXE 文件

6. 填写应用信息：
   - Package name: NovelEditor
   - Publisher: CN=YourName
   - Version: 0.1.0.0

7. 完成打包，生成 `.msix` 文件

##### 5. 上传到 Microsoft Store

1. 登录 [Partner Center](https://partner.microsoft.com/dashboard)

2. 创建新应用

3. 上传 `.msix` 文件

4. 填写应用信息

5. 提交审核

### 方案 B: 对 EXE 进行代码签名

如果你坚持使用 EXE，需要购买代码签名证书。

#### 步骤

##### 1. 购买代码签名证书

推荐的证书提供商：
- [DigiCert](https://www.digicert.com/code-signing/) - $474/年
- [Sectigo](https://sectigo.com/ssl-certificates-tls/code-signing) - $299/年
- [GlobalSign](https://www.globalsign.com/en/code-signing-certificate) - $299/年

##### 2. 安装证书

收到证书后，安装到 Windows 证书存储。

##### 3. 签名 EXE

使用 `signtool.exe` 签名：

```bash
# 找到 signtool.exe（通常在 Windows SDK 中）
"C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\signtool.exe" sign ^
  /f "your-certificate.pfx" ^
  /p "certificate-password" ^
  /tr http://timestamp.digicert.com ^
  /td sha256 ^
  /fd sha256 ^
  "novel-editor_0.1.0_x64-setup.exe"
```

##### 4. 验证签名

```bash
signtool verify /pa "novel-editor_0.1.0_x64-setup.exe"
```

##### 5. 上传到 Microsoft Store

上传已签名的 EXE 文件。

### 方案 C: 使用 Microsoft Store 的自动签名（最简单）

Microsoft Store 可以为你的应用自动签名。

#### 步骤

##### 1. 创建 MSIX 包（无需签名）

使用 MSIX Packaging Tool 创建未签名的 MSIX 包。

##### 2. 上传到 Partner Center

Partner Center 会自动为你的应用签名。

##### 3. 配置应用信息

确保填写完整的应用信息：
- 应用名称
- 发布者名称
- 应用描述
- 截图
- 隐私政策

## 📋 推荐方案：使用 Tauri + MSIX

### 完整流程

#### 1. 更新 Tauri 配置

创建 `apps/desktop/src-tauri/tauri.windows.conf.json`:

```json
{
  "bundle": {
    "windows": {
      "wix": {
        "language": ["zh-CN", "en-US"]
      },
      "nsis": {
        "languages": ["SimpChinese", "English"],
        "displayLanguageSelector": true
      }
    }
  }
}
```

#### 2. 构建应用

```bash
cd apps/desktop
bun run tauri build
```

#### 3. 转换为 MSIX

使用 MSIX Packaging Tool 或命令行工具：

```bash
# 使用 MakeAppx.exe
MakeAppx.exe pack /d "C:\path\to\app" /p "NovelEditor.msix"
```

#### 4. 创建应用清单

创建 `AppxManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Package xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
         xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10">
  <Identity Name="NovelEditor"
            Publisher="CN=YourName"
            Version="0.1.0.0" />
  
  <Properties>
    <DisplayName>小说编辑器</DisplayName>
    <PublisherDisplayName>Your Name</PublisherDisplayName>
    <Logo>Assets\StoreLogo.png</Logo>
  </Properties>
  
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.17763.0" MaxVersionTested="10.0.22621.0" />
  </Dependencies>
  
  <Resources>
    <Resource Language="zh-CN"/>
    <Resource Language="en-US"/>
  </Resources>
  
  <Applications>
    <Application Id="NovelEditor" Executable="novel-editor.exe" EntryPoint="Windows.FullTrustApplication">
      <uap:VisualElements DisplayName="小说编辑器"
                          Description="专为小说创作者设计的现代化写作工具"
                          BackgroundColor="transparent"
                          Square150x150Logo="Assets\Square150x150Logo.png"
                          Square44x44Logo="Assets\Square44x44Logo.png">
      </uap:VisualElements>
    </Application>
  </Applications>
</Package>
```

#### 5. 上传到 Microsoft Store

1. 登录 Partner Center
2. 创建新应用提交
3. 上传 MSIX 包
4. 填写应用信息
5. 提交审核

## 🔧 自动化构建脚本

创建 `scripts/build-msix.ps1`:

```powershell
# Build MSIX package for Microsoft Store

param(
    [string]$Version = "0.1.0"
)

Write-Host "Building Novel Editor for Microsoft Store..." -ForegroundColor Green

# 1. Build Tauri app
Write-Host "Step 1: Building Tauri app..." -ForegroundColor Yellow
Set-Location apps/desktop
bun run tauri build

# 2. Find the built executable
$ExePath = "src-tauri/target/release/novel-editor.exe"
if (-not (Test-Path $ExePath)) {
    Write-Host "Error: Executable not found at $ExePath" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Executable found" -ForegroundColor Green

# 3. Create MSIX package directory
$MsixDir = "../../dist/msix"
New-Item -ItemType Directory -Force -Path $MsixDir | Out-Null

# 4. Copy files
Write-Host "Step 2: Copying files..." -ForegroundColor Yellow
Copy-Item $ExePath "$MsixDir/novel-editor.exe"
Copy-Item "src-tauri/icons/*" "$MsixDir/Assets/" -Recurse -Force

# 5. Create AppxManifest.xml
Write-Host "Step 3: Creating manifest..." -ForegroundColor Yellow
# (Manifest content here)

# 6. Package MSIX
Write-Host "Step 4: Creating MSIX package..." -ForegroundColor Yellow
$MakeAppx = "C:\Program Files (x86)\Windows Kits\10\bin\10.0.22621.0\x64\MakeAppx.exe"
& $MakeAppx pack /d $MsixDir /p "../../dist/NovelEditor_$Version.msix"

Write-Host "✓ MSIX package created successfully!" -ForegroundColor Green
Write-Host "Location: dist/NovelEditor_$Version.msix" -ForegroundColor Cyan
```

使用方法：

```powershell
.\scripts\build-msix.ps1 -Version "0.1.0"
```

## 📝 检查清单

在提交到 Microsoft Store 之前，确保：

### 应用要求
- [ ] 应用已签名（MSIX 自动签名）
- [ ] 应用名称和发布者信息正确
- [ ] 版本号格式正确（x.x.x.x）
- [ ] 应用图标齐全（所有尺寸）

### 应用信息
- [ ] 应用描述（中文和英文）
- [ ] 应用截图（至少 1 张，推荐 4-5 张）
- [ ] 应用功能列表
- [ ] 隐私政策链接
- [ ] 支持联系方式

### 测试
- [ ] 在 Windows 10 上测试
- [ ] 在 Windows 11 上测试
- [ ] 测试安装和卸载
- [ ] 测试应用功能

## 🚨 常见问题

### Q: 为什么不能直接上传 EXE？

A: Microsoft Store 要求所有应用必须有数字签名。直接上传的 EXE 通常没有签名，会被拒绝。

### Q: MSIX 和 MSI 有什么区别？

A: 
- **MSIX**: 现代的 Windows 应用打包格式，支持自动更新，Microsoft Store 推荐
- **MSI**: 传统的 Windows 安装程序，需要手动签名

### Q: 代码签名证书很贵，有免费的吗？

A: 没有免费的代码签名证书。但使用 MSIX + Microsoft Store，Store 会自动为你签名。

### Q: 审核需要多久？

A: 通常 1-3 个工作日，复杂的应用可能需要更长时间。

### Q: 审核失败了怎么办？

A: 
1. 查看审核报告
2. 修复问题
3. 重新提交

## 📚 相关资源

- [Microsoft Store 政策](https://docs.microsoft.com/en-us/windows/uwp/publish/store-policies)
- [MSIX 打包工具](https://docs.microsoft.com/en-us/windows/msix/packaging-tool/tool-overview)
- [Tauri Windows 配置](https://tauri.app/v1/guides/building/windows)
- [Partner Center](https://partner.microsoft.com/dashboard)

## 🎯 推荐流程

1. ✅ 使用 Tauri 构建 MSI
2. ✅ 使用 MSIX Packaging Tool 转换为 MSIX
3. ✅ 上传到 Microsoft Store
4. ✅ Store 自动签名
5. ✅ 提交审核

这样可以避免购买昂贵的代码签名证书！

---

需要帮助？查看 [Microsoft Store 支持](https://developer.microsoft.com/en-us/microsoft-store/support)
