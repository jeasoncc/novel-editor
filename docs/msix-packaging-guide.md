# MSIX 打包指南（用于 Windows Store）

## 现状

**Tauri 2.0 目前不直接支持生成 MSIX 文件。**

但我们可以使用 Microsoft 的 MSIX Packaging Tool 将现有的 .msi 或 .exe 转换为 MSIX。

## 方案 1：使用 MSIX Packaging Tool（推荐）

### 前置要求

1. **Windows 10/11 电脑**（必须）
2. **MSIX Packaging Tool**
   - 从 Microsoft Store 安装
   - 或访问：https://www.microsoft.com/store/productId/9N5LW3JBCXKF

### 步骤

#### 1. 下载构建产物

从 GitHub Release 下载：
- `novel-editor_0.1.11_x64_zh-CN.msi`

或从 GitHub Actions 下载：
- 访问：https://github.com/jeasoncc/novel-editor/actions
- 下载 `tauri-bundles-windows-latest` 产物

#### 2. 打开 MSIX Packaging Tool

1. 启动 MSIX Packaging Tool
2. 选择 "Application package"
3. 点击 "Create package on this computer"

#### 3. 准备打包环境

**重要：** 建议在干净的 Windows 环境中打包

选项 A：使用当前电脑
- 点击 "Next"

选项 B：使用虚拟机（推荐）
- 创建一个干净的 Windows 虚拟机
- 在虚拟机中安装 MSIX Packaging Tool

#### 4. 选择安装程序

1. 点击 "Browse"
2. 选择 `novel-editor_0.1.11_x64_zh-CN.msi`
3. 签名偏好：选择 "Sign with Device Guard signing"（微软会签名）
4. 点击 "Next"

#### 5. 填写包信息

**Package information:**
- Package name: `NovelEditor`
- Package display name: `Novel Editor` 或 `小说编辑器`
- Publisher display name: `Lotus` 或你的名字
- Version: `0.1.11.0`（必须是 4 位数字）
- Install location: 保持默认

**Package identity:**
- Publisher: `CN=你的名字`（会自动生成）

点击 "Next"

#### 6. 安装应用

1. 工具会自动运行安装程序
2. 按照安装向导完成安装
3. **重要：** 安装完成后，启动应用测试一下
4. 关闭应用
5. 在 MSIX Packaging Tool 中点击 "Next"

#### 7. 首次启动任务

1. 工具会询问是否有首次启动任务
2. 如果没有特殊需求，直接点击 "Next"

#### 8. 服务报告

1. 检查是否有服务
2. 通常没有，直接点击 "Next"

#### 9. 创建包

1. 选择保存位置
2. 点击 "Create"
3. 等待打包完成（1-5分钟）

#### 10. 验证包

打包完成后：
1. 双击生成的 `.msix` 文件
2. 点击 "安装"
3. 测试应用是否正常运行
4. 如果正常，可以提交到 Microsoft Store

## 方案 2：使用命令行工具

### 前置要求

1. 安装 Windows SDK
   - 下载：https://developer.microsoft.com/windows/downloads/windows-sdk/

### 步骤

#### 1. 创建清单文件

创建 `AppxManifest.xml`：

```xml
<?xml version="1.0" encoding="utf-8"?>
<Package
  xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10"
  xmlns:uap="http://schemas.microsoft.com/appx/manifest/uap/windows10"
  xmlns:rescap="http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities">
  
  <Identity
    Name="NovelEditor"
    Publisher="CN=Lotus"
    Version="0.1.11.0" />
  
  <Properties>
    <DisplayName>Novel Editor</DisplayName>
    <PublisherDisplayName>Lotus</PublisherDisplayName>
    <Logo>Assets\StoreLogo.png</Logo>
  </Properties>
  
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.17763.0" MaxVersionTested="10.0.22000.0" />
  </Dependencies>
  
  <Resources>
    <Resource Language="zh-CN" />
  </Resources>
  
  <Applications>
    <Application Id="NovelEditor" Executable="novel-editor.exe" EntryPoint="Windows.FullTrustApplication">
      <uap:VisualElements
        DisplayName="Novel Editor"
        Description="一个现代化的小说编辑器"
        BackgroundColor="transparent"
        Square150x150Logo="Assets\Square150x150Logo.png"
        Square44x44Logo="Assets\Square44x44Logo.png">
      </uap:VisualElements>
    </Application>
  </Applications>
  
  <Capabilities>
    <rescap:Capability Name="runFullTrust" />
  </Capabilities>
</Package>
```

#### 2. 准备资源文件

创建 `Assets` 目录，添加图标：
- `StoreLogo.png` (50x50)
- `Square150x150Logo.png` (150x150)
- `Square44x44Logo.png` (44x44)

#### 3. 打包

```powershell
# 使用 makeappx 打包
makeappx pack /d "C:\path\to\app" /p "novel-editor.msix" /l

# 签名（如果需要）
signtool sign /fd SHA256 /a /f certificate.pfx /p password novel-editor.msix
```

## 方案 3：使用 GitHub Actions 自动化（未来）

目前 Tauri 不支持，但可以在 workflow 中添加 MSIX 转换步骤：

```yaml
- name: Convert to MSIX
  if: runner.os == 'Windows'
  run: |
    # 安装 MSIX Packaging Tool CLI
    # 转换 MSI 到 MSIX
    # 这需要额外的配置
```

## 提交到 Microsoft Store

### 1. 注册开发者账号

- 访问：https://partner.microsoft.com/dashboard
- 费用：$19/年（个人）或 $99/年（公司）

### 2. 创建应用

1. 登录 Partner Center
2. 点击 "新建应用"
3. 保留应用名称：`Novel Editor`

### 3. 上传 MSIX

1. 进入应用页面
2. 点击 "提交"
3. 上传 `.msix` 文件
4. 填写应用信息：
   - 描述
   - 截图（至少 1 张，推荐 4-5 张）
   - 分类：生产力
   - 年龄分级
   - 隐私政策 URL

### 4. 等待审核

- 通常 1-3 个工作日
- 审核通过后自动发布

## 常见问题

### Q: 为什么 Tauri 不直接支持 MSIX？

A: MSIX 是相对较新的格式，Tauri 团队还在开发中。预计未来版本会支持。

### Q: 必须用 MSIX 才能发布到 Store 吗？

A: 是的，Microsoft Store 要求使用 MSIX 或 APPX 格式。

### Q: 可以在 Linux/Mac 上打包 MSIX 吗？

A: 不行，MSIX Packaging Tool 只能在 Windows 上运行。

### Q: 有没有更简单的方法？

A: 
1. 使用 Winget（免费，无需 MSIX）
2. 等 Tauri 支持 MSIX
3. 购买代码签名证书，直接发布 MSI

### Q: 代码签名怎么办？

A: 
- 如果用 MSIX Packaging Tool 的 "Device Guard signing"，微软会自动签名
- 如果手动打包，需要购买代码签名证书

## 推荐流程

### 现在（最简单）

1. ✅ 发布到 Winget（免费，无需 MSIX）
2. ✅ 发布到 GitHub Releases
3. ✅ 获得用户反馈

### 3-6 个月后（如果用户增长好）

4. 💰 购买 Microsoft Store 开发者账号（$19/年）
5. 🔧 使用 MSIX Packaging Tool 转换
6. 📦 发布到 Microsoft Store

### 为什么不急于发布到 Store？

- 需要投入时间学习 MSIX 打包
- 需要 Windows 电脑
- 需要 $19/年
- Winget 已经能覆盖大部分 Windows 用户
- 等 Tauri 原生支持 MSIX 会更简单

## 参考资源

- [MSIX Packaging Tool 文档](https://docs.microsoft.com/windows/msix/packaging-tool/tool-overview)
- [MSIX 格式规范](https://docs.microsoft.com/windows/msix/)
- [Microsoft Store 发布指南](https://docs.microsoft.com/windows/uwp/publish/)
- [Tauri MSIX 支持追踪](https://github.com/tauri-apps/tauri/issues)

## 总结

**当前最佳方案：**
1. 先发布到 Winget（免费，简单）
2. 等用户增长后再考虑 Microsoft Store
3. 或等 Tauri 原生支持 MSIX

**如果坚持要发布到 Store：**
1. 需要 Windows 电脑
2. 使用 MSIX Packaging Tool 转换
3. 投入 $19/年 + 学习时间
