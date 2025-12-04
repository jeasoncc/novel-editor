# 🤖 使用 GitHub Actions 自动构建 MSIX

## 🎯 概述

我们创建了一个 GitHub Actions workflow，可以自动构建 MSIX 包，无需在本地 Windows 机器上操作。

## ✅ 优势

- ✅ **完全自动化** - 推送 tag 即可触发构建
- ✅ **免费** - 使用 GitHub Actions 免费额度
- ✅ **无需证书** - Microsoft Store 会自动签名
- ✅ **可重复** - 每次构建都是一致的
- ✅ **版本管理** - 自动创建 Release

## 🚀 使用方法

### 方法 A: 手动触发（推荐用于测试）

1. 进入 GitHub 仓库
2. 点击 **Actions** 标签
3. 选择 **Build MSIX for Microsoft Store**
4. 点击 **Run workflow**
5. 输入版本号（例如：`0.1.6`）
6. 点击 **Run workflow**

等待 10-15 分钟，构建完成后：
- 在 Artifacts 中下载 `msix-package`
- 解压得到 `NovelEditor_0.1.6.msix`

### 方法 B: 自动触发（推荐用于发布）

1. 创建并推送 tag：

```bash
# 创建 tag
git tag msix-v0.1.6

# 推送 tag
git push origin msix-v0.1.6
```

2. GitHub Actions 自动触发构建

3. 构建完成后，自动创建 Draft Release

4. 在 Releases 页面：
   - 查看自动生成的 Release
   - 下载 MSIX 文件
   - 编辑 Release 信息
   - 发布 Release

## 📋 Workflow 详解

### 触发条件

```yaml
on:
  workflow_dispatch:  # 手动触发
    inputs:
      version: '0.1.6'
  
  push:
    tags:
      - 'msix-v*.*.*'  # 推送 msix-v 开头的 tag
```

### 构建步骤

1. **Checkout 代码**
2. **安装 Bun 和 Rust**
3. **安装依赖**
4. **构建前端**
5. **构建 Tauri 应用**
6. **创建 MSIX 包结构**
   - 复制可执行文件
   - 复制图标资源
   - 生成 AppxManifest.xml
7. **打包 MSIX**
8. **上传 Artifact**
9. **创建 Release**（如果是 tag 触发）

### 生成的文件

- `NovelEditor_0.1.6.msix` - MSIX 安装包
- `AppxManifest.xml` - 应用清单
- 图标和资源文件

## 🔍 验证 MSIX 包

### 在本地测试

下载 MSIX 文件后：

#### 方法 1: 双击安装

1. 右键点击 `.msix` 文件
2. 选择 "安装"
3. 按照提示完成安装

#### 方法 2: PowerShell 安装

```powershell
# 安装
Add-AppxPackage -Path "NovelEditor_0.1.6.msix"

# 查看已安装的应用
Get-AppxPackage -Name "NovelEditor"

# 卸载
Remove-AppxPackage -Package "NovelEditor_0.1.6.0_x64__8wekyb3d8bbwe"
```

### 检查包内容

```powershell
# 解压 MSIX 查看内容
Expand-Archive -Path "NovelEditor_0.1.6.msix" -DestinationPath "msix-content"

# 查看文件
Get-ChildItem -Path "msix-content" -Recurse
```

## 📦 上传到 Microsoft Store

### 步骤

1. **下载 MSIX 文件**
   - 从 GitHub Actions Artifacts 下载
   - 或从 Releases 页面下载

2. **登录 Partner Center**
   - 访问: https://partner.microsoft.com/dashboard
   - 登录你的开发者账户

3. **创建新提交**
   - 找到你的应用
   - 点击 "Start new submission"

4. **上传 MSIX**
   - 在 "Packages" 部分
   - 点击 "Browse files"
   - 选择 `NovelEditor_0.1.6.msix`
   - 上传

5. **填写应用信息**
   - 应用描述
   - 截图
   - 隐私政策
   - 支持信息

6. **提交审核**
   - 检查所有信息
   - 点击 "Submit to the Store"

7. **等待审核**
   - 通常 1-3 个工作日
   - 在 Partner Center 查看状态

## 🔧 自定义配置

### 修改应用信息

编辑 `.github/workflows/build-msix.yml` 中的 AppxManifest.xml 部分：

```xml
<Identity Name="NovelEditor"
          Publisher="CN=YourName"  <!-- 修改发布者 -->
          Version="$VERSION.0" />

<Properties>
  <DisplayName>你的应用名称</DisplayName>  <!-- 修改显示名称 -->
  <PublisherDisplayName>你的名字</PublisherDisplayName>  <!-- 修改发布者显示名称 -->
  ...
</Properties>
```

### 添加更多资源

在 workflow 中添加步骤：

```yaml
- name: Copy additional resources
  shell: pwsh
  run: |
    # 复制文档
    Copy-Item README.md msix-package/
    
    # 复制许可证
    Copy-Item LICENSE msix-package/
```

### 修改目标平台

```xml
<Dependencies>
  <TargetDeviceFamily Name="Windows.Desktop" 
                      MinVersion="10.0.17763.0"  <!-- 最低版本 -->
                      MaxVersionTested="10.0.22621.0" />  <!-- 测试版本 -->
</Dependencies>
```

## 🚨 常见问题

### Q: 构建失败，找不到 MakeAppx.exe

A: GitHub Actions 的 Windows runner 应该已经安装了 Windows SDK。如果失败，检查 workflow 日志。

### Q: MSIX 包无法安装

A: 
1. 检查 AppxManifest.xml 格式是否正确
2. 确保版本号格式为 `x.x.x.0`
3. 检查是否有必需的文件

### Q: 需要签名吗？

A: 
- **本地测试**: 需要开启开发者模式
- **Microsoft Store**: 不需要，Store 会自动签名

### Q: 如何开启开发者模式？

A: 
1. 打开 Windows 设置
2. 更新和安全 → 开发者选项
3. 选择 "开发人员模式"

### Q: 构建时间太长

A: 
- 首次构建需要 15-20 分钟（下载依赖）
- 后续构建 10-15 分钟（有缓存）
- 可以通过优化 Rust 缓存来加速

## 💡 最佳实践

### 版本号管理

使用语义化版本号：

```bash
# 补丁版本
git tag msix-v0.1.7

# 小版本
git tag msix-v0.2.0

# 大版本
git tag msix-v1.0.0
```

### 发布流程

1. **开发和测试**
   ```bash
   git checkout -b feat/new-feature
   # 开发...
   git commit -m "feat: 添加新功能"
   ```

2. **合并到 main**
   ```bash
   git checkout main
   git merge feat/new-feature
   git push
   ```

3. **更新版本号**
   ```bash
   ./scripts/bump-version.sh
   git add .
   git commit -m "chore: release v0.1.7"
   ```

4. **创建 MSIX tag**
   ```bash
   git tag msix-v0.1.7
   git push origin msix-v0.1.7
   ```

5. **等待构建完成**
   - 查看 Actions 页面
   - 下载 MSIX 文件

6. **上传到 Microsoft Store**
   - 登录 Partner Center
   - 上传 MSIX
   - 提交审核

### 自动化发布

可以进一步自动化，直接从 GitHub Actions 上传到 Microsoft Store：

```yaml
# 需要配置 Microsoft Store API credentials
- name: Upload to Microsoft Store
  uses: microsoft/store-submission@v1
  with:
    tenant-id: ${{ secrets.AZURE_TENANT_ID }}
    client-id: ${{ secrets.AZURE_CLIENT_ID }}
    client-secret: ${{ secrets.AZURE_CLIENT_SECRET }}
    app-id: ${{ secrets.STORE_APP_ID }}
    package-path: NovelEditor_*.msix
```

## 📊 成本分析

### GitHub Actions 免费额度

- **Public 仓库**: 无限制
- **Private 仓库**: 
  - Free: 2,000 分钟/月
  - Pro: 3,000 分钟/月
  - Team: 10,000 分钟/月

### 每次构建消耗

- **Windows runner**: 2x 倍率
- **构建时间**: 约 15 分钟
- **消耗**: 30 分钟额度

### 月度估算

- 每月发布 4 次: 120 分钟
- 完全在免费额度内

## 🔗 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [MSIX 打包文档](https://docs.microsoft.com/en-us/windows/msix/)
- [Partner Center](https://partner.microsoft.com/dashboard)
- [Tauri Actions](https://github.com/tauri-apps/tauri-action)

## 🎯 总结

使用 GitHub Actions 构建 MSIX：

✅ **优点**:
- 完全自动化
- 免费（在额度内）
- 可重复构建
- 版本管理清晰
- 无需本地 Windows 环境

❌ **缺点**:
- 首次配置需要时间
- 构建时间较长（10-15 分钟）
- 需要 GitHub 账户

**推荐**: 对于 Microsoft Store 发布，这是最佳方案！

---

需要帮助？查看 [完整指南](microsoft-store-guide.md)
