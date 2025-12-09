# MSIX 打包指南 - 使用 cargo-packager

## 概述

基于 Tauri GitHub Issue #4818 的社区方案，我们使用 `cargo-packager` 来生成 MSIX 包。

**参考：** https://github.com/tauri-apps/tauri/issues/4818

## 为什么使用 cargo-packager？

### Tauri 的限制

- Tauri 2.0 目前不原生支持 MSIX 格式
- 只能生成 MSI 和 NSIS 安装包
- 社区正在开发 MSIX 支持

### cargo-packager 的优势

- ✅ 官方推荐的打包工具
- ✅ 支持多种格式（包括 MSIX）
- ✅ 与 Tauri 生态系统集成良好
- ✅ 活跃维护和社区支持

## 配置文件

### Packager.toml

我们创建了 `apps/desktop/src-tauri/Packager.toml` 配置文件：

```toml
[package]
product_name = "Novel Editor"
version = "0.1.11"
description = "一个现代化的小说编辑器"
publisher = "Lotus"
identifier = "com.lotus.novel-editor"

[windows.msix]
enabled = true
publisher = "CN=Lotus"
publisher_display_name = "Lotus"
display_name = "Novel Editor"
capabilities = ["runFullTrust"]
```

**关键配置：**
- `publisher`: 必须与签名证书的 CN 匹配
- `capabilities`: MSIX 需要 `runFullTrust` 权限
- `display_name`: 在 Windows 开始菜单显示的名称

## 本地构建

### 前置要求

1. **Windows 10/11**（必须）
2. **Rust** 工具链
3. **Bun** 或 Node.js
4. **cargo-packager**

### 安装 cargo-packager

```bash
cargo install cargo-packager --locked
```

### 构建步骤

```bash
# 1. 进入项目目录
cd apps/desktop

# 2. 安装依赖
bun install

# 3. 构建前端
bun run build

# 4. 进入 Tauri 目录
cd src-tauri

# 5. 使用 cargo-packager 构建 MSIX
cargo packager --release --formats nsis,msi,app

# 6. 查找生成的 MSIX
# 通常在 target/release/ 目录下
```

### 输出文件

构建完成后，你会得到：

```
target/release/
├── novel-editor.exe
└── bundle/
    ├── msi/
    │   └── novel-editor_0.1.11_x64.msi
    ├── nsis/
    │   └── novel-editor_0.1.11_x64-setup.exe
    └── msix/  (如果 cargo-packager 支持)
        └── novel-editor_0.1.11_x64.msix
```

## GitHub Actions 自动化

### Workflow 配置

我们创建了 `.github/workflows/build-msix.yml`：

**特点：**
1. 自动安装 cargo-packager
2. 构建前端和 Rust 应用
3. 生成 MSIX 包
4. 自动签名（测试证书）
5. 上传到 GitHub Release

### 触发方式

**自动触发：**
```bash
git tag desktop-v0.1.12
git push origin desktop-v0.1.12
```

**手动触发：**
```bash
gh workflow run build-msix.yml
```

或访问：
https://github.com/jeasoncc/novel-editor/actions/workflows/build-msix.yml

## 图标配置

### MSIX 图标要求

MSIX 需要特定尺寸的图标：

| 文件名 | 尺寸 | 用途 |
|--------|------|------|
| `44x44.png` | 44x44 | 应用列表图标 |
| `150x150.png` | 150x150 | 开始菜单磁贴 |
| `50x50.png` | 50x50 | Store 图标 |

### 生成图标

如果你只有一个 `icon.png`，可以使用 ImageMagick 生成：

```bash
# 安装 ImageMagick
# Windows: choco install imagemagick
# macOS: brew install imagemagick
# Linux: sudo apt install imagemagick

# 生成不同尺寸
cd apps/desktop/src-tauri/icons
convert icon.png -resize 44x44 44x44.png
convert icon.png -resize 150x150 150x150.png
convert icon.png -resize 50x50 50x50.png
```

或使用在线工具：
- https://www.iloveimg.com/resize-image
- https://imageresizer.com/

## 签名配置

### 当前状态：自签名证书

**优点：**
- 免费
- 快速测试

**缺点：**
- 用户会看到"未知发布者"警告
- 不能直接提交到 Microsoft Store
- 需要用户手动信任证书

### 用户安装步骤（自签名）

1. 下载 `.msix` 文件
2. 右键 → 属性 → 数字签名
3. 详细信息 → 查看证书 → 安装证书
4. 选择"本地计算机"
5. 选择"受信任的根证书颁发机构"
6. 完成安装
7. 双击 `.msix` 安装应用

### 升级到真实证书

#### 选项 1：购买代码签名证书

**价格：** $100-300/年

**提供商：**
- DigiCert: https://www.digicert.com/
- Sectigo: https://sectigo.com/
- GlobalSign: https://www.globalsign.com/

**优点：**
- 消除 SmartScreen 警告
- 可以提交到 Microsoft Store
- 建立用户信任

**配置方法：**

1. 购买证书后，将 `.pfx` 文件转换为 base64：
   ```bash
   base64 -i certificate.pfx -o certificate.txt
   ```

2. 添加到 GitHub Secrets：
   - `SIGNING_CERT`: 证书的 base64 内容
   - `CERT_PASSWORD`: 证书密码

3. 更新 workflow：
   ```yaml
   - name: Sign MSIX with real certificate
     shell: pwsh
     run: |
       $certBytes = [Convert]::FromBase64String("${{ secrets.SIGNING_CERT }}")
       [IO.File]::WriteAllBytes("cert.pfx", $certBytes)
       
       & signtool sign /fd SHA256 /f "cert.pfx" /p "${{ secrets.CERT_PASSWORD }}" *.msix
   ```

#### 选项 2：Microsoft Store 签名（推荐）

**价格：** $19/年（开发者账号）

**优点：**
- Microsoft 自动签名
- 完全免费（除了开发者账号）
- 用户信任度最高
- 自动更新

**步骤：**
1. 注册 Microsoft Store 开发者账号
2. 创建应用
3. 上传 MSIX（可以是自签名的）
4. Microsoft 会重新签名
5. 通过审核后发布

## cargo-packager vs 手动打包

| 特性 | cargo-packager | 手动 MakeAppx |
|------|----------------|---------------|
| 易用性 | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| 自动化 | ✅ 完全自动 | ⚠️ 需要脚本 |
| 配置 | ✅ TOML 文件 | ⚠️ XML 清单 |
| 维护 | ✅ 官方支持 | ⚠️ 自己维护 |
| 图标处理 | ✅ 自动 | ⚠️ 手动 |
| 依赖管理 | ✅ 自动 | ⚠️ 手动 |

**结论：** cargo-packager 是更好的选择。

## 常见问题

### Q: cargo-packager 是官方工具吗？

A: 是的，它是 Tauri 团队推荐的打包工具，用于生成各种格式的安装包。

### Q: 为什么不直接用 Tauri CLI？

A: Tauri 2.0 目前不支持 MSIX。cargo-packager 是过渡方案，未来可能会集成到 Tauri CLI。

### Q: MSIX 和 MSI 有什么区别？

A: 
- **MSIX**: 现代格式，支持 Microsoft Store，自动更新，沙箱隔离
- **MSI**: 传统格式，兼容性好，但功能较少

### Q: 必须用 MSIX 吗？

A: 不是。如果不发布到 Microsoft Store，MSI 和 NSIS 已经足够。

### Q: cargo-packager 生成的 MSIX 能直接提交到 Store 吗？

A: 可以，但需要：
1. 使用真实的代码签名证书，或
2. 让 Microsoft Store 重新签名

### Q: 如何更新 Packager.toml 中的版本号？

A: 版本号会自动从 `tauri.conf.json` 同步，不需要手动更新。

### Q: 支持哪些平台？

A: cargo-packager 支持：
- Windows: MSIX, MSI, NSIS
- macOS: DMG, APP
- Linux: DEB, RPM, AppImage

## 测试 MSIX

### 本地测试

```bash
# 1. 构建 MSIX
cargo packager --release --formats app

# 2. 找到 MSIX 文件
$msix = Get-ChildItem -Path target/release -Recurse -Filter "*.msix"

# 3. 安装证书（首次需要）
# 右键 MSIX → 属性 → 数字签名 → 安装证书

# 4. 安装应用
# 双击 MSIX 文件
```

### GitHub Actions 测试

```bash
# 手动触发 workflow
gh workflow run build-msix.yml

# 等待完成
gh run watch

# 下载 artifact
gh run download
```

## 发布策略

### 阶段 1：测试（现在）

**目标：** 验证 MSIX 打包流程

**方案：**
- ✅ 使用 cargo-packager 生成 MSIX
- ✅ 使用自签名证书
- ✅ 内部测试

### 阶段 2：公开发布（用户 > 100）

**目标：** 提供多种安装方式

**方案：**
- ✅ GitHub Releases（MSI + MSIX）
- ✅ Winget（推荐）
- ⏸️ 暂不发布到 Store

### 阶段 3：Store 发布（用户 > 500）

**目标：** 最大化覆盖面

**方案：**
- 💰 购买代码签名证书
- 💰 注册 Microsoft Store
- ✅ 提交 MSIX 到 Store

## 相关资源

### 官方文档

- [cargo-packager GitHub](https://github.com/crabnebula-dev/cargo-packager)
- [Tauri Issue #4818](https://github.com/tauri-apps/tauri/issues/4818)
- [MSIX 官方文档](https://docs.microsoft.com/windows/msix/)

### 社区资源

- [Tauri Discord](https://discord.gg/tauri)
- [cargo-packager 示例](https://github.com/crabnebula-dev/cargo-packager/tree/main/examples)

## 总结

**cargo-packager 方案的优势：**

1. ✅ **官方推荐** - Tauri 团队认可的方案
2. ✅ **自动化** - 配置一次，自动构建
3. ✅ **多格式** - 同时生成 MSI、NSIS、MSIX
4. ✅ **易维护** - TOML 配置，简单明了
5. ✅ **社区支持** - 活跃的开发和问题解决

**下一步：**
1. 测试 cargo-packager 构建
2. 验证 MSIX 安装
3. 根据用户反馈决定是否投资签名证书

---

**更新日期：** 2024-12-09
**基于：** Tauri Issue #4818 社区方案
