# Novel Editor

> A modern, powerful novel writing application for serious writers

> 🇨🇳 [中文文档](./README.zh-CN.md) | English

![Novel Editor Screenshot](https://s3.bmp.ovh/imgs/2025/11/30/17e3f22342be954f.png)

![Novel Editor Features](https://s3.bmp.ovh/imgs/2025/11/30/20c87f8ef08b246d.png)

Novel Editor is a professional writing tool designed specifically for novelists and long-form fiction writers. Built with modern technologies, it provides a distraction-free writing environment with powerful organizational features.

---


## 📥 Installation

Choose your platform and install Novel Editor in seconds:

### Windows

#### Microsoft Store (Recommended)
Coming soon to Microsoft Store for automatic updates.

#### Winget (Windows Package Manager)
```bash
winget install Jeason.NovelEditor
```

#### Direct Download
Download the installer from [GitHub Releases](https://github.com/jeasoncc/novel-editor/releases):
- `novel-editor_x.x.x_x64-setup.exe` - NSIS installer (recommended)
- `novel-editor_x.x.x_x64_zh-CN.msi` - MSI installer
- `novel-editor_x.x.x_x64.msix` - MSIX package

### macOS

#### Homebrew (Coming Soon)
```bash
brew install --cask novel-editor
```

#### Direct Download
Download from [GitHub Releases](https://github.com/jeasoncc/novel-editor/releases):
- `novel-editor_x.x.x_aarch64.dmg` - Apple Silicon (M1/M2/M3)
- `novel-editor_x.x.x_x64.dmg` - Intel Mac

### Linux

#### Arch Linux (AUR)
```bash
yay -S novel-editor-bin
# or
paru -S novel-editor-bin
```

#### Snap Store (Coming Soon)
```bash
sudo snap install novel-editor
```

#### Debian/Ubuntu (DEB)
Download from [GitHub Releases](https://github.com/jeasoncc/novel-editor/releases):
```bash
# x64
sudo dpkg -i novel-editor_x.x.x_amd64.deb

# ARM64
sudo dpkg -i novel-editor_x.x.x_arm64.deb
```

#### Fedora/RHEL (RPM)
```bash
# x64
sudo rpm -i novel-editor-x.x.x-1.x86_64.rpm

# ARM64
sudo rpm -i novel-editor-x.x.x-1.aarch64.rpm
```

#### AppImage (Universal)
Download and run:
```bash
# x64
chmod +x novel-editor_x.x.x_amd64.AppImage
./novel-editor_x.x.x_amd64.AppImage

# ARM64
chmod +x novel-editor_x.x.x_aarch64.AppImage
./novel-editor_x.x.x_aarch64.AppImage
```

## 🎯 What is Novel Editor?

Novel Editor is a **Monorepo** project containing:

- **Desktop App** - Cross-platform desktop application (Tauri + React)
- **Website** - Official website and documentation (Next.js 15)
- **API Server** - Backend services (Fastify + PostgreSQL)
- **Admin Panel** - Content management system

## ✨ Key Features

### Desktop Application

- ✍️ **Immersive Writing** - Rich text editor based on Lexical with Markdown shortcuts
- 📂 **Structured Project Management** - Tree-based organization: Books → Chapters → Scenes
- 🔍 **Powerful Search** - In-file search/replace, global full-text search with regex support
- 🎨 **Icon Theme System** - 6 preset themes, similar to VSCode's icon theme feature
- 📊 **Outline & Chart System** - Complete outline management with Mermaid and PlantUML chart support
- 👤 **Character Mention** - Quick character references via `@` symbol with hover Wiki display
- 💾 **Multiple Export Formats** - JSON, ZIP structured export, Markdown, DOCX, etc.
- ⚙️ **Reliable Storage** - IndexedDB + Dexie for offline persistence
- 🚢 **Production-Ready** - One-command build for AppImage, DEB, RPM, MSI, DMG installers

### Web Website

- 🎨 **Modern Design** - Beautiful UI design with dark mode support
- 📱 **Fully Responsive** - Perfect adaptation for mobile, tablet, and desktop
- ⚡ **Performance Optimized** - Next.js 15 App Router for lightning-fast loading
- ♿ **Accessibility Friendly** - WCAG compliant with keyboard navigation support
- 🔍 **SEO Optimized** - Complete metadata and Open Graph tags
- 📚 **Documentation System** - Three-column layout documentation center with search and outline navigation

## 🛠️ Tech Stack

### Monorepo Tools
- **Turborepo** 2.0+ - High-performance build system
- **Bun** - Package manager, runtime, and build tool
- **Workspaces** - Workspace management

### Desktop Application
- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **UI Library**: Shadcn UI + Radix UI
- **Editor**: Lexical (rich text editor)
- **State Management**: Zustand + TanStack Query
- **Routing**: TanStack Router
- **Database**: Dexie.js (IndexedDB)
- **Desktop Framework**: Tauri (Rust)
- **Styling**: Tailwind CSS
- **Code Quality**: Biome





## 🌟 Star History

If you find Novel Editor useful, please consider giving it a star! ⭐

## � Liceanse

This project is licensed under the [MIT License](./LICENSE).


Made with ❤️ by [Jeason](https://github.com/jeasoncc) and [contributors](https://github.com/jeasoncc/novel-editor/graphs/contributors)
