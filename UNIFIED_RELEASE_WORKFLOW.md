# 统一的桌面应用发布工作流

## 概述

已将所有桌面应用构建流程整合到单个工作流：`.github/workflows/release-desktop.yml`

一次发布，生成所有平台的安装包！

## 🚀 支持的平台和格式

### Windows
- ✅ **MSI** - 传统安装程序（Tauri 原生）
- ✅ **NSIS** - 现代安装程序（Tauri 原生）
- ✅ **MSIX** - Microsoft Store 格式（独立 job）

### macOS
- ✅ **DMG** - macOS 磁盘镜像
- ✅ **APP** - macOS 应用包
- 支持架构：
  - Apple Silicon (aarch64)
  - Intel (x86_64)

### Linux
- ✅ **DEB** - Debian/Ubuntu 包
- ✅ **AppImage** - 通用 Linux 包
- ✅ **RPM** - Red Hat/Fedora 包
- 支持架构：
  - x86_64
  - ARM64

## 📋 工作流结构

```yaml
release-desktop.yml
├── Job 1: publish-tauri (矩阵构建)
│   ├── macOS (aarch64)
│   ├── macOS (x86_64)
│   ├── Ubuntu 22.04
│   ├── Ubuntu 22.04 ARM
│   └── Windows
│       ├── MSI
│       └── NSIS
│
└── Job 2: build-msix (依赖 Job 1)
    └── Windows MSIX
        ├── 构建可执行文件
        ├── 创建 MSIX 包
        ├── 签名
        └── 上传到 Release
```

## 🔄 工作流程

### 1. 触发条件

```yaml
on:
  workflow_dispatch:  # 手动触发
  push:
    branches:
      - release        # 推送到 release 分支
    tags:
      - "v*.*.*"           # 旧格式 tag
      - "desktop-v*.*.*"   # 新格式 tag
```

### 2. 构建流程

#### 阶段 1：多平台构建（并行）

所有平台同时构建：
- macOS (2 个架构)
- Linux (2 个架构)
- Windows (MSI + NSIS)

#### 阶段 2：MSIX 构建（串行）

等待 Windows 构建完成后：
- 重新构建可执行文件
- 创建 MSIX 包结构
- 使用 MakeAppx 打包
- 自签名证书签名
- 上传到 Release

### 3. 输出产物

所有文件自动上传到：
- **GitHub Artifacts**（临时，90天）
- **GitHub Releases**（永久）

## 📦 发布步骤

### 方法 1：创建 Tag（推荐）

```bash
# 确保代码已提交
git add .
git commit -m "feat: 新功能"

# 版本号会自动递增，假设当前是 0.1.15
# 创建 tag
git tag desktop-v0.1.15

# 推送 tag
git push origin desktop-v0.1.15
```

### 方法 2：手动触发

1. 访问：https://github.com/jeasoncc/novel-editor/actions/workflows/release-desktop.yml
2. 点击 "Run workflow"
3. 选择分支
4. 点击 "Run workflow"

### 方法 3：推送到 release 分支

```bash
git checkout -b release
git push origin release
```

## 📊 构建时间估算

| 平台 | 预计时间 | 并行 |
|------|---------|------|
| macOS (aarch64) | ~10 分钟 | ✅ |
| macOS (x86_64) | ~10 分钟 | ✅ |
| Ubuntu 22.04 | ~8 分钟 | ✅ |
| Ubuntu ARM | ~8 分钟 | ✅ |
| Windows (MSI/NSIS) | ~12 分钟 | ✅ |
| **MSIX** | ~10 分钟 | ⏳ 等待 Windows 完成 |
| **总计** | ~22 分钟 | |

## 🎯 优势

### ✅ 统一管理
- 一个工作流文件
- 一次发布所有平台
- 统一的版本号

### ✅ 高效构建
- 并行构建节省时间
- 缓存加速（Rust、Bun）
- 自动化流程

### ✅ 完整覆盖
- Windows: MSI + NSIS + MSIX
- macOS: DMG + APP (双架构)
- Linux: DEB + AppImage + RPM

### ✅ 可靠性
- 构建失败不影响其他平台
- 自动上传到 Release
- Artifacts 备份

## 🔍 监控构建

### 查看工作流状态

```bash
# 列出最近的运行
gh run list --workflow=release-desktop.yml

# 查看特定运行
gh run view <run-id>

# 实时监控
gh run watch <run-id>
```

### 下载产物

```bash
# 下载所有 artifacts
gh run download <run-id>

# 下载特定 artifact
gh run download <run-id> -n msix-package
```

## 📝 配置说明

### 并发控制

```yaml
concurrency:
  group: release-desktop-${{ github.ref }}
  cancel-in-progress: false  # 不取消发布流程
```

确保同一个 ref 不会重复构建，但不会取消正在进行的发布。

### 矩阵策略

```yaml
strategy:
  fail-fast: false  # 一个平台失败不影响其他平台
  matrix:
    include:
      - platform: 'windows-latest'
        args: ''
        target: ''
```

### MSIX Job 依赖

```yaml
build-msix:
  needs: publish-tauri  # 等待主构建完成
```

MSIX 构建会等待所有平台构建完成后再开始。

## 🛠️ 自定义配置

### 添加新平台

在 matrix 中添加：

```yaml
- platform: 'ubuntu-24.04'
  args: ''
  target: ''
```

### 修改 MSIX 配置

编辑 `build-msix` job 中的 PowerShell 脚本。

### 更改触发条件

修改 `on` 部分：

```yaml
on:
  push:
    tags:
      - "desktop-v*.*.*"
  # 添加其他触发条件
```

## 🐛 故障排查

### 构建失败

1. 查看失败的 job 日志
2. 检查是否是平台特定问题
3. 其他平台的构建不受影响

### MSIX 构建失败

1. 检查 Windows 主构建是否成功
2. 查看 MSIX job 的详细日志
3. 验证可执行文件是否生成

### 版本号问题

确保 `apps/desktop/src-tauri/tauri.conf.json` 中的版本号正确。

## 📚 相关文档

- `MSIX_FINAL_SOLUTION.md` - MSIX 打包详解
- `DISTRIBUTION_STRATEGY.md` - 分发策略
- `docs/workflows-explained.md` - 工作流说明

## 🎉 总结

**一次发布，全平台覆盖！**

- ✅ Windows: 3 种格式（MSI + NSIS + MSIX）
- ✅ macOS: 2 种架构（Intel + Apple Silicon）
- ✅ Linux: 3 种格式（DEB + AppImage + RPM）

**总共 8 种安装包，一次构建完成！**
