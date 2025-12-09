# Novel Editor 分发策略

## 📦 安装包存储方案

### ✅ 当前方案：GitHub Releases（最佳实践）

**你的工作流已经配置好了！**

所有安装包自动上传到：
```
https://github.com/jeasoncc/novel-editor/releases
```

### 为什么不用 main 分支？

| 方案 | 仓库大小影响 | 克隆速度 | 推荐度 |
|------|-------------|---------|--------|
| **GitHub Releases** | ✅ 无影响 | ✅ 快速 | ⭐⭐⭐⭐⭐ |
| main 分支 | ❌ 快速膨胀 | ❌ 变慢 | ❌❌❌ |
| gh-pages 分支 | ⚠️ 会膨胀 | ⚠️ 变慢 | ⭐⭐ |

**示例**：
- 每个 MSIX 包：~10 MB
- 10 个版本：~100 MB
- Git 保存所有历史：仓库变成 100+ MB
- 用户克隆时必须下载所有历史版本

## 🚀 分发渠道

### 1. Microsoft Store（主要渠道）
- **状态**：准备中
- **文件**：MSIX 包
- **覆盖**：Windows 用户（~75%）
- **优势**：
  - 自动更新
  - 官方签名
  - 用户信任度高
  - 内置支付系统

### 2. Winget（Windows 包管理器）
- **状态**：✅ PR 已提交
- **文件**：MSI 安装包
- **覆盖**：技术用户
- **命令**：`winget install Jeason.NovelEditor`

### 3. GitHub Releases（直接下载）
- **状态**：✅ 已配置
- **文件**：MSIX + MSI
- **覆盖**：所有用户
- **链接**：https://github.com/jeasoncc/novel-editor/releases

### 4. Snap Store（Linux）
- **状态**：准备中
- **文件**：Snap 包
- **覆盖**：Linux 用户（~3%）
- **命令**：`snap install novel-editor`

### 5. AUR（Arch Linux）
- **状态**：准备中
- **文件**：PKGBUILD
- **覆盖**：Arch Linux 用户
- **命令**：`yay -S novel-editor`

## 📊 市场份额策略

根据桌面操作系统市场份额：

| 平台 | 市场份额 | 优先级 | 分发渠道 |
|------|---------|--------|----------|
| Windows | ~75% | 🔴 最高 | Microsoft Store + Winget |
| macOS | ~15% | 🟡 中等 | 待开发 |
| Linux | ~3% | 🟢 低 | Snap + AUR |

### 当前进度

✅ **已完成**：
- GitHub Releases 自动化
- Winget 提交（审核中）
- MSIX 构建流程

⏳ **进行中**：
- Microsoft Store 提交（等待 MSIX 构建完成）
- Snap Store 配置

📋 **计划中**：
- macOS 支持（需要 Apple Developer 账号）
- Linux AppImage/DEB 包

## 🔗 用户下载链接

### 在 README.md 中添加

```markdown
## 📥 下载

### Windows

#### 推荐方式
- **Microsoft Store**（即将上线）- 自动更新，最安全
- **Winget**：`winget install Jeason.NovelEditor`

#### 直接下载
- [MSIX 包](https://github.com/jeasoncc/novel-editor/releases/latest/download/novel-editor_x64.msix) - 适用于 Windows 10/11
- [MSI 安装包](https://github.com/jeasoncc/novel-editor/releases/latest/download/novel-editor_x64_zh-CN.msi) - 传统安装程序

### Linux

- **Snap Store**（即将上线）：`snap install novel-editor`
- **AUR**（Arch Linux）：`yay -S novel-editor`

### 所有版本

访问 [Releases 页面](https://github.com/jeasoncc/novel-editor/releases) 查看所有版本和更新日志。
```

## 🔄 自动化流程

### 当前工作流

```
代码提交 → 版本自动递增 → 创建 Tag
    ↓
GitHub Actions 触发
    ↓
构建所有平台包
    ↓
自动上传到 GitHub Releases
    ↓
用户下载
```

### 发布检查清单

每次发布时：

- [ ] 代码已提交到 main 分支
- [ ] 版本号已自动递增
- [ ] 创建并推送 tag（`desktop-vX.X.X`）
- [ ] GitHub Actions 构建成功
- [ ] Release 页面有新版本
- [ ] 下载链接可用
- [ ] （可选）更新 README 中的版本号

## 📝 .gitignore 配置

已添加以下规则，确保安装包不会被提交：

```gitignore
# 安装包文件
*.msix
*.msi
*.exe
*.appimage
*.AppImage
*.deb
*.rpm
*.dmg
*.pkg
*.snap

# MSIX 打包临时目录
msix-package/

# 证书文件
*.pfx
*.cer
*.p12
```

## 🎯 最佳实践

### ✅ 推荐做法

1. **使用 GitHub Releases** 存储所有安装包
2. **自动化构建** 通过 GitHub Actions
3. **多渠道分发** 覆盖不同用户群体
4. **保持仓库轻量** 不提交二进制文件

### ❌ 避免做法

1. ❌ 不要在 main 分支存储安装包
2. ❌ 不要手动构建和上传
3. ❌ 不要忽略 .gitignore 规则
4. ❌ 不要在多个分支重复存储

## 📚 相关文档

- `docs/releases-branch-guide.md` - 分支存储方案详解
- `MSIX_FINAL_SOLUTION.md` - MSIX 打包方案
- `WINGET_PUBLISH_READY.md` - Winget 发布指南
- `docs/snap-store-guide.md` - Snap Store 发布指南

## 🔍 监控和统计

### GitHub Releases 下载统计

```bash
# 查看所有 releases
gh release list

# 查看特定版本的下载统计
gh release view desktop-v0.1.15

# 下载最新版本
gh release download --pattern "*.msix"
```

### 访问链接

- **Releases 页面**：https://github.com/jeasoncc/novel-editor/releases
- **最新版本**：https://github.com/jeasoncc/novel-editor/releases/latest
- **直接下载**：https://github.com/jeasoncc/novel-editor/releases/latest/download/novel-editor_x64.msix

## 总结

✅ **当前配置已经是最佳实践**

- GitHub Releases 自动化 ✅
- .gitignore 已配置 ✅
- 多渠道分发策略 ✅
- 仓库保持轻量 ✅

**不需要改变任何东西！** 继续使用当前方案即可。
