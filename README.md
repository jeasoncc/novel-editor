# Novel Editor

> A modern, powerful novel writing application for serious writers

> 🇨🇳 [中文文档](./README.zh-CN.md) | English

![Novel Editor Screenshot](https://s3.bmp.ovh/imgs/2025/11/30/17e3f22342be954f.png)

![Novel Editor Features](https://s3.bmp.ovh/imgs/2025/11/30/20c87f8ef08b246d.png)

Novel Editor is a professional writing tool designed specifically for novelists and long-form fiction writers. Built with modern technologies, it provides a distraction-free writing environment with powerful organizational features.

---


## 📥 Installation

Choose your platform and install Novel Editor:

### Quick Install

| Platform | Recommended | Command |
|----------|-------------|---------|
| 🪟 Windows | Winget | `winget install Jeason.NovelEditor` |
| 🍎 macOS | Homebrew | `brew install --cask novel-editor` |
| 🐧 Ubuntu/Debian | DEB | [Download from Releases](https://github.com/Jeason-Lotus/novel-editor/releases) |
| 🐧 Fedora/RHEL | RPM | [Download from Releases](https://github.com/Jeason-Lotus/novel-editor/releases) |
| 🐧 Arch Linux | AUR | `yay -S novel-editor-bin` |
| 🐧 All Linux | Snap | `sudo snap install novel-editor-app` |

---

### 🪟 Windows

#### Winget (Recommended)
```bash
winget install Jeason.NovelEditor
```

#### Scoop
```bash
scoop install extras/novel-editor
```

#### Chocolatey
```bash
choco install novel-editor
```

#### Direct Download
Download from [GitHub Releases](https://github.com/Jeason-Lotus/novel-editor/releases):
- `novel-editor_x.x.x_x64-setup.exe` - NSIS installer (recommended)
- `novel-editor_x.x.x_x64_zh-CN.msi` - MSI installer
- `novel-editor_x.x.x_x64.msix` - MSIX package

---

### 🍎 macOS

#### Homebrew
```bash
brew install --cask novel-editor
```

#### Direct Download
Download from [GitHub Releases](https://github.com/Jeason-Lotus/novel-editor/releases):
- `novel-editor_x.x.x_aarch64.dmg` - Apple Silicon (M1/M2/M3)
- `novel-editor_x.x.x_x64.dmg` - Intel Mac

---

### 🐧 Linux

#### Snap Store (All Distros)
```bash
sudo snap install novel-editor-app
```

#### Flatpak (All Distros)
```bash
flatpak install flathub com.lotus.NovelEditor
```

#### Arch Linux (AUR)
```bash
# Binary package (fast)
yay -S novel-editor-bin

# Source package (compile from source)
yay -S novel-editor
```

#### Ubuntu/Debian (DEB)
```bash
# Download and install
wget https://github.com/Jeason-Lotus/novel-editor/releases/latest/download/novel-editor_VERSION_amd64.deb
sudo dpkg -i novel-editor_*.deb
sudo apt-get install -f  # Fix dependencies if needed
```

#### Fedora/RHEL (RPM)
```bash
wget https://github.com/Jeason-Lotus/novel-editor/releases/latest/download/novel-editor-VERSION-1.x86_64.rpm
sudo dnf install novel-editor-*.rpm
```

#### AppImage (Portable)
```bash
wget https://github.com/Jeason-Lotus/novel-editor/releases/latest/download/novel-editor_VERSION_amd64.AppImage
chmod +x novel-editor_*.AppImage
./novel-editor_*.AppImage
```

#### Ubuntu PPA
```bash
sudo add-apt-repository ppa:jeason/novel-editor
sudo apt update && sudo apt install novel-editor
```

#### Fedora COPR
```bash
sudo dnf copr enable jeason/novel-editor
sudo dnf install novel-editor
```

---

### Installation Comparison

| Feature | Direct Download | Package Manager | Snap/Flatpak |
|---------|-----------------|-----------------|--------------|
| Auto Update | ❌ | ✅ | ✅ |
| Sandboxed | ❌ | ❌ | ✅ |
| System Integration | ✅ | ✅ | ⚠️ |
| Install Size | Small | Small | Medium |

---

### System Requirements

- **OS:** Windows 10+, macOS 10.15+, Linux (x86_64/ARM64)
- **RAM:** 2GB minimum, 4GB+ recommended
- **Storage:** ~200MB

## 🎯 What is Novel Editor?

Novel Editor is a **Monorepo** project containing:

- **Desktop App** - Cross-platform desktop application (Tauri + React)
- **Website** - Official website and documentation (Next.js 15)
- **API Server** - Backend services (Fastify + PostgreSQL)
- **Admin Panel** - Content management system

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


## 📄 License

This project is licensed under the [MIT License](./LICENSE).


Made with ❤️ by [Jeason](https://github.com/jeasoncc) and [contributors](https://github.com/jeasoncc/novel-editor/graphs/contributors)
