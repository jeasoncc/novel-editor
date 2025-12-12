# Novel Editor 发布平台指南

## 🚀 快速发布命令

使用 npm 脚本可以快速创建标签并触发自动发布：

```bash
# 跨平台发布
npm run tag:desktop          # 桌面应用 (GitHub Releases - 所有平台)
npm run tag:web              # Web 应用部署
npm run tag:all              # 创建所有标签，触发全平台发布

# Linux 平台发布
npm run tag:linux:snap       # Snap Store
npm run tag:linux:flatpak    # Flathub (Flatpak)
npm run tag:linux:aur        # AUR 源码包
npm run tag:linux:aur-bin    # AUR 二进制包
npm run tag:linux:ppa        # Debian PPA (Ubuntu/Debian)
npm run tag:linux:copr       # Fedora COPR (Fedora/RHEL)
npm run tag:linux:obs        # openSUSE Build Service
npm run tag:linux:gentoo     # Gentoo Overlay

# Windows 平台发布
npm run tag:windows:winget   # Winget (Windows 包管理器)
npm run tag:windows:chocolatey # Chocolatey (Windows 包管理器)
npm run tag:windows:scoop    # Scoop (Windows 轻量包管理器)

# macOS 平台发布
npm run tag:macos:homebrew   # Homebrew (macOS 包管理器)
```

详细说明请参考：
- [平台特定发布指南](./platform-specific-publishing.md) - 按平台分类的详细指南
- [Flatpak 和 Winget 发布指南](./flatpak-winget-publishing.md) - 特定平台详细说明

## 📋 发布状态跟踪

### ✅ 已发布平台
- [x] GitHub Releases
- [x] AUR (Arch Linux)
- [x] Snap Store
- [x] Flathub (Flatpak)
- [x] Winget (Windows 包管理器)
- [x] Chocolatey (Windows 包管理器)
- [x] Scoop (Windows 轻量包管理器)
- [x] Homebrew (macOS 包管理器)
- [x] Web 应用 (Vercel/Netlify/GitHub Pages)
- [x] Debian PPA (Ubuntu/Debian/Mint)
- [x] Fedora COPR (Fedora/RHEL/CentOS)
- [x] openSUSE Build Service (openSUSE/SUSE)
- [x] Gentoo Overlay (Gentoo Linux)

### 🚀 优先发布平台

#### 高优先级 (1-2周内)
- [ ] **Microsoft Store** - 你已有MSIX打包
- [ ] **AppImage** - 跨Linux发行版
- [ ] **Product Hunt** - 产品发现平台

#### 中优先级 (1个月内)
- [ ] **Homebrew** - macOS包管理器
- [ ] **Chocolatey** - Windows包管理器
- [ ] **AlternativeTo** - 软件替代品网站
- [ ] **Reddit** - r/linux, r/writing, r/selfhosted

#### 低优先级 (有时间时)
- [ ] **Scoop** - Windows轻量包管理器
- [ ] **Debian PPA** - Ubuntu/Debian包
- [ ] **RPM包** - Fedora/RHEL包
- [ ] **SourceForge** - 开源软件平台

## 🎯 目标用户群体平台

### 写作者社区
- [ ] **Scrivener论坛** - 专业写作软件用户
- [ ] **NaNoWriMo社区** - 小说写作月参与者
- [ ] **WritingForums.org** - 英文写作社区
- [ ] **知乎写作话题** - 中文写作社区
- [ ] **豆瓣写作小组** - 文艺创作者

### 技术社区
- [ ] **Hacker News** - 技术产品发布
- [ ] **Dev.to** - 开发者博客平台
- [ ] **Indie Hackers** - 独立开发者
- [ ] **Tauri Discord** - Tauri应用展示

## 📦 各平台发布要求

### Microsoft Store
- **要求**: MSIX包 (✅ 已有)
- **费用**: $19一次性费用
- **审核时间**: 1-3天
- **文档**: https://docs.microsoft.com/en-us/windows/uwp/publish/

### Winget
- **要求**: 公开下载链接
- **费用**: 免费
- **方式**: PR到winget-pkgs仓库
- **文档**: https://docs.microsoft.com/en-us/windows/package-manager/

### Homebrew
- **要求**: macOS二进制文件
- **费用**: 免费
- **方式**: PR到homebrew-cask
- **文档**: https://docs.brew.sh/Adding-Software-to-Homebrew

### AppImage
- **要求**: Linux二进制 + AppImage打包
- **费用**: 免费
- **工具**: appimagetool
- **文档**: https://appimage.org/

### Product Hunt
- **要求**: 产品截图、描述、网站
- **费用**: 免费
- **最佳时间**: 周二-周四发布
- **文档**: https://help.producthunt.com/

## 🛠️ 技术准备清单

### 需要创建的包格式
- [ ] **AppImage** - 便携Linux应用
- [ ] **macOS .dmg** - macOS安装包
- [ ] **Chocolatey .nupkg** - Windows包
- [ ] **Homebrew Formula** - macOS包配置

### 需要准备的材料
- [ ] **应用截图** (多个平台尺寸)
- [ ] **应用图标** (各种尺寸)
- [ ] **产品描述** (中英文版本)
- [ ] **功能特性列表**
- [ ] **用户指南/文档**
- [ ] **演示视频** (可选但推荐)

## 📈 发布策略建议

### 阶段1: 扩大Linux覆盖
1. 创建AppImage版本
2. 提交到更多Linux发行版

### 阶段2: Windows生态
1. 发布到Microsoft Store
2. 添加到Winget
3. 创建Chocolatey包

### 阶段3: macOS支持
1. 构建macOS版本
2. 发布到Homebrew
3. 考虑Mac App Store

### 阶段4: 社区推广
1. 在写作社区分享
2. 技术社区展示
3. 产品发现平台

## 📊 成功指标

### 短期目标 (1个月)
- [ ] 5个新平台发布
- [ ] 100+ 总下载量
- [ ] 10+ GitHub stars

### 中期目标 (3个月)
- [ ] 10个平台发布
- [ ] 500+ 总下载量
- [ ] 50+ GitHub stars
- [ ] 首个用户反馈/Issue

### 长期目标 (6个月)
- [ ] 15个平台发布
- [ ] 1000+ 总下载量
- [ ] 100+ GitHub stars
- [ ] 活跃用户社区

## 🔗 有用链接

- [Tauri发布指南](https://tauri.app/v1/guides/distribution/)
- [跨平台应用发布最佳实践](https://github.com/sindresorhus/awesome-electron#distribution)
- [开源项目推广指南](https://github.com/zenika-open-source/promote-open-source-project)

---

**提示**: 优先选择你的目标用户最可能使用的平台。对于小说编辑器，写作社区和创作者平台可能比纯技术平台更有效。