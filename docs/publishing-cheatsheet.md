# 发布命令速查表

## 🚀 一键发布
```bash
npm run tag:all              # 发布到所有平台
```

## 🌐 跨平台
```bash
npm run tag:desktop          # GitHub Releases (所有桌面格式)
npm run tag:web              # Web 应用部署
```

## 🐧 Linux 平台
```bash
# 全部 Linux 平台
npm run tag:linux:all        # 发布到所有 Linux 平台

# 单个平台
npm run tag:linux:snap       # Snap Store
npm run tag:linux:flatpak    # Flathub
npm run tag:linux:aur        # AUR 源码包
npm run tag:linux:aur-bin    # AUR 二进制包
npm run tag:linux:ppa        # Debian PPA
npm run tag:linux:copr       # Fedora COPR
npm run tag:linux:obs        # openSUSE OBS
npm run tag:linux:gentoo     # Gentoo Overlay
```

## 🪟 Windows 平台
```bash
# 全部 Windows 平台
npm run tag:windows:all      # 发布到所有 Windows 平台

# 单个平台
npm run tag:windows:winget   # Microsoft Winget
npm run tag:windows:chocolatey # Chocolatey
npm run tag:windows:scoop    # Scoop
```

## 🍎 macOS 平台
```bash
# 全部 macOS 平台
npm run tag:macos:all        # 发布到所有 macOS 平台

# 单个平台
npm run tag:macos:homebrew   # Homebrew
```

## 📋 常用组合

### 快速发布主流平台
```bash
npm run tag:desktop
npm run tag:linux:snap
npm run tag:linux:flatpak
npm run tag:windows:winget
npm run tag:web
```

### 发布到所有包管理器
```bash
npm run tag:linux:all
npm run tag:windows:all
npm run tag:macos:all
```

### 测试发布
```bash
npm run tag:linux:aur-bin    # 快速 Linux 测试
npm run tag:windows:scoop    # 快速 Windows 测试
```

## 🔧 辅助命令
```bash
npm run version:bump         # 更新版本号
npm run stats:check          # 检查下载统计
npm run icons:update         # 更新应用图标
```

## 📊 平台覆盖率

| 平台类型 | 命令数量 | 覆盖用户群 |
|---------|---------|-----------|
| Linux | 8 个平台 | ~90% Linux 用户 |
| Windows | 3 个平台 | ~80% Windows 用户 |
| macOS | 1 个平台 | ~70% macOS 用户 |
| Web | 1 个平台 | 所有平台用户 |

**总计**: 13 个发布平台 + GitHub Releases + Web 部署 = 15 种分发方式