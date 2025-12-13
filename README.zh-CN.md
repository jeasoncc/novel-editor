# Novel Editor

> 现代化、强大的小说写作应用，为严肃作家打造

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Release](https://img.shields.io/github/v/release/jeasoncc/novel-editor)](https://github.com/jeasoncc/novel-editor/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)](https://github.com/jeasoncc/novel-editor/releases)

Novel Editor 是专为小说家和长篇小说作者设计的专业写作工具。采用现代技术构建，提供无干扰的写作环境和强大的组织功能。

> 🇺🇸 [English Documentation](./README.md) | 中文

---

![Novel Editor 截图](https://s3.bmp.ovh/imgs/2025/11/30/17e3f22342be954f.png)

![Novel Editor 功能](https://s3.bmp.ovh/imgs/2025/11/30/20c87f8ef08b246d.png)

## 📥 安装

选择你的平台，几秒钟内安装 Novel Editor：

### Windows

#### Microsoft Store（推荐）
即将上架 Microsoft Store，支持自动更新。

#### Winget（Windows 包管理器）
```bash
winget install Jeason.NovelEditor
```

#### 直接下载
从 [GitHub Releases](https://github.com/jeasoncc/novel-editor/releases) 下载安装程序：
- `novel-editor_x.x.x_x64-setup.exe` - NSIS 安装程序（推荐）
- `novel-editor_x.x.x_x64_zh-CN.msi` - MSI 安装程序
- `novel-editor_x.x.x_x64.msix` - MSIX 包

### macOS

#### Homebrew（即将推出）
```bash
brew install --cask novel-editor
```

#### 直接下载
从 [GitHub Releases](https://github.com/jeasoncc/novel-editor/releases) 下载：
- `novel-editor_x.x.x_aarch64.dmg` - Apple Silicon (M1/M2/M3)
- `novel-editor_x.x.x_x64.dmg` - Intel Mac

### Linux

#### Arch Linux (AUR)
```bash
yay -S novel-editor-bin
# 或
paru -S novel-editor-bin
```

#### Snap Store（即将推出）
```bash
sudo snap install novel-editor
```

#### Debian/Ubuntu (DEB)
从 [GitHub Releases](https://github.com/jeasoncc/novel-editor/releases) 下载：
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

#### AppImage（通用）
下载并运行：
```bash
# x64
chmod +x novel-editor_x.x.x_amd64.AppImage
./novel-editor_x.x.x_amd64.AppImage

# ARM64
chmod +x novel-editor_x.x.x_aarch64.AppImage
./novel-editor_x.x.x_aarch64.AppImage
```

## 🎯 什么是 Novel Editor？

Novel Editor 是一个 **Monorepo** 项目，包含：

- **桌面应用** - 跨平台桌面应用（Tauri + React）
- **官方网站** - 官网和文档（Next.js 15）
- **API 服务器** - 后端服务（Fastify + PostgreSQL）
- **管理面板** - 内容管理系统

## ✨ 核心特性

### Desktop 应用

- ✍️ **沉浸式写作** - 基于 Lexical 的富文本编辑器，支持 Markdown 快捷格式
- 📂 **项目结构化管理** - 书籍 → 章节 → 场景的树状组织
- 🔍 **强大的搜索功能** - 当前文件搜索替换、全局全文搜索，支持正则表达式
- 🎨 **图标主题系统** - 6 种预设主题，类似 VSCode 的图标主题功能
- 📊 **大纲与图表系统** - 完整的大纲管理，支持 Mermaid 和 PlantUML 图表
- 👤 **角色提及功能** - 通过 `@` 符号快速引用角色，悬停显示 Wiki 信息
- 💾 **多种导出格式** - JSON、ZIP 结构化导出，Markdown、DOCX 等
- ⚙️ **可靠存储** - IndexedDB + Dexie 提供离线持久化
- 🚢 **生产级发布** - 一键产出 AppImage、DEB、RPM、MSI、DMG 安装包

### Web 官网

- 🎨 **现代化设计** - 精美的 UI 设计，支持暗色模式
- 📱 **完全响应式** - 完美适配移动端、平板和桌面端
- ⚡ **性能优化** - 使用 Next.js 15 的 App Router，极速加载
- ♿ **无障碍友好** - 遵循 WCAG 标准，键盘导航支持
- 🔍 **SEO 优化** - 完整的元数据和 Open Graph 标签
- 📚 **文档系统** - 三栏布局的文档中心，支持搜索和大纲导航

## 📁 项目结构

```
novel-editor-monorepo/
├── apps/
│   ├── desktop/          # Tauri 桌面应用
│   │   ├── src/          # React 应用源码
│   │   ├── src-tauri/    # Tauri 后端 (Rust)
│   │   └── package.json
│   └── web/              # Next.js 官网
│       ├── src/          # Next.js 应用源码
│       └── package.json
├── packages/             # 共享包（未来扩展）
├── docs/                 # 项目文档中心
│   ├── desktop/          # Desktop 应用文档
│   ├── web/              # Web 项目文档
│   ├── deployment/       # 部署文档
│   └── development/      # 开发文档
├── scripts/              # 构建和开发脚本
├── turbo.json            # Turborepo 配置
├── package.json          # 根 package.json
└── README.md             # 主文档
```

## 🚀 快速开始

### 环境要求

- **Node.js** ≥ 20
- **Bun** ≥ 1.1.0 (推荐使用 Bun 获得更快的性能)
- **Rust** & **Cargo** (仅 Desktop 应用需要，用于 Tauri)
- 各平台的 [Tauri 依赖](https://tauri.app/v1/guides/getting-started/prerequisites)

### 安装依赖

```bash
# 使用 Bun (推荐)
bun install

# 或使用 npm
npm install
```

### 开发模式

```bash
# 同时运行所有应用
bun dev

# 只运行桌面应用
bun desktop:dev
# 或
turbo run dev --filter=desktop

# 只运行官网
bun web:dev
# 或
turbo run dev --filter=web
```

开发服务器地址：
- Desktop 前端: `http://localhost:1420`
- Web 官网: `http://localhost:3000`

### 构建

```bash
# 构建所有应用
bun build

# 构建特定应用
turbo run build --filter=desktop
turbo run build --filter=web
```

### 桌面应用打包

```bash
cd apps/desktop
npm run tauri build
```

这会生成对应平台的安装包：
- Linux: AppImage, DEB, RPM
- Windows: MSI
- macOS: DMG

## 📜 可用脚本

在项目根目录执行：

| 脚本 | 说明 |
|------|------|
| `bun dev` | 启动所有应用的开发服务器 |
| `bun build` | 构建所有应用 |
| `bun lint` | 对所有应用运行 lint 检查 |
| `bun format` | 格式化所有应用的代码 |
| `bun check` | 运行类型检查和 lint |
| `bun clean` | 清理所有构建产物 |
| `bun desktop:dev` | 仅启动桌面应用开发服务器 |
| `bun web:dev` | 仅启动官网开发服务器 |

## 🛠️ 技术栈

### Monorepo 工具
- **Turborepo** 2.0+ - 高性能构建系统
- **Bun** - 包管理器、运行时和构建工具
- **Workspaces** - 工作区管理

### Desktop 应用
- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI 库**: Shadcn UI + Radix UI
- **编辑器**: Lexical (富文本编辑器)
- **状态管理**: Zustand + TanStack Query
- **路由**: TanStack Router
- **数据库**: Dexie.js (IndexedDB)
- **桌面框架**: Tauri (Rust)
- **样式**: Tailwind CSS
- **代码质量**: Biome

### Web 官网
- **框架**: Next.js 15
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **UI 组件**: Shadcn UI + Radix UI
- **图标**: Lucide React
- **主题**: next-themes

### 工具链
- **代码格式化/检查**: Biome
- **类型检查**: TypeScript (严格模式)
- **测试**: Vitest + Playwright (计划中)
- **CI/CD**: GitHub Actions

## 📚 文档

> 📖 **完整文档中心**：查看 [`docs/README.md`](./docs/README.md) 获取所有文档

### 快速导航

- 🚀 [开始使用](./docs/project/START_HERE.md) - 从这里开始！
- ⚡ [快速开始](./docs/project/QUICKSTART.md) - 5分钟上手
- 🖥️ [Desktop 应用文档](./docs/desktop/README.md) - 桌面应用完整文档
- 🌐 [Web 项目文档](./docs/web/README.md) - 官网项目文档
- 🔧 [开发指南](./docs/development/README.md) - 开发环境搭建和构建指南
- 🚢 [部署指南](./docs/deployment/README.md) - 部署相关文档

### 子项目文档

- [Desktop App](./apps/desktop/README.md) - Tauri 桌面应用详细文档
- [Desktop App (中文)](./apps/desktop/README.zh-CN.md) - 中文文档
- [Website](./apps/web/README.md) - Next.js 官网详细文档

## 🏗️ 架构说明

### Monorepo 优势

- **代码共享**: 可以在多个应用间共享类型定义、工具函数等
- **统一构建**: 使用 Turborepo 进行增量构建和缓存
- **统一管理**: 依赖、版本、脚本统一管理
- **快速开发**: 并行构建和开发服务器

### Turborepo 配置

项目使用 Turborepo 进行任务编排，主要配置在 `turbo.json`：

- **构建缓存**: 自动缓存构建产物，加速后续构建
- **任务依赖**: 自动管理任务间的依赖关系
- **并行执行**: 并行运行独立任务，提高效率
- **输出管理**: 自动管理各应用的构建输出

### 工作流程

```
┌─────────────────────────────────────────┐
│         Root Package.json               │
│  (Turborepo 任务编排和脚本)            │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼──────┐  ┌────────▼────────┐
│  Desktop App │  │   Web Website   │
│  (Tauri)     │  │   (Next.js)     │
│              │  │                 │
│  • React     │  │  • Next.js 15   │
│  • Vite      │  │  • App Router   │
│  • Lexical   │  │  • Tailwind CSS │
│  • Dexie     │  │                 │
└──────────────┘  └─────────────────┘
```

## 🔧 开发指南

### 代码规范

- **TypeScript**: 严格模式，类型安全优先
- **代码格式**: 使用 Biome 统一格式化
- **组件规范**: 函数式组件，使用 TypeScript 接口定义 Props
- **样式**: 使用 Tailwind CSS，遵循设计系统

### 提交规范

建议使用约定式提交：

```bash
feat(desktop): 添加新的搜索功能
fix(web): 修复文档页面的滚动问题
docs: 更新 README 文档
```

### 添加新功能

1. 创建功能分支: `git checkout -b feat/new-feature`
2. 开发并测试
3. 运行检查: `bun check`
4. 提交代码: `git commit -m "feat: 新功能"`
5. 推送并创建 PR

## 🧪 测试

```bash
# 运行所有测试（计划中）
bun test

# 运行桌面应用测试
cd apps/desktop && npm test

# 运行 E2E 测试
cd apps/desktop && npm run test:e2e
```

## 🚢 部署

### Desktop 应用

桌面应用可以打包为各平台的安装包：

```bash
cd apps/desktop
npm run tauri build
```

### Web 官网

官网可以部署到任何支持 Next.js 的平台：

- **Vercel** (推荐) - 零配置部署
- **Netlify** - 支持 SSR
- **Cloudflare Pages** - 边缘计算
- **自建服务器** - 使用 Docker 或直接运行

详细部署指南请查看 [部署文档](./docs/deployment/README.md)。

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feat/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: 添加新功能'`)
4. 推送到分支 (`git push origin feat/amazing-feature`)
5. 创建 Pull Request

### 贡献指南

- 代码需要通过 lint 和类型检查
- UI 改动请附上截图或演示视频
- 桌面端改动请注明测试平台
- 重大改动请先创建 issue 讨论

## 📄 许可证

本项目采用 [MIT License](./LICENSE) 许可证。

## 📧 联系方式

- **GitHub**: [@jeasoncc/novel-editor](https://github.com/jeasoncc/novel-editor)
- **邮箱**: xiaomiquan@aliyun.com

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！

---

**开始使用**: 查看 [快速开始指南](./docs/project/QUICKSTART.md) 了解更多！







