# Novel Editor Documentation

Welcome to the Novel Editor documentation center. Here you'll find everything you need to use, develop, and contribute to Novel Editor.

## 📖 Documentation Index

### For Users

- [Installation Guide](./windows-install-guide.md) - How to install on different platforms
- [Desktop App Guide](./desktop-app.md) - Using the desktop application
- [Web App Guide](./web-app.md) - Using the web version

### For Developers

#### Getting Started
- [Development Setup](./development/) - Set up your development environment
- [Build Guide](./build/) - Build the project from source
- [Architecture Overview](./ARCHITECTURE.md) - System architecture

#### Release & Deployment
- [Release Process](./release/) - How we release new versions
- [Distribution Strategy](./release/DISTRIBUTION_STRATEGY.md) - Multi-platform distribution
- [Build Configuration](./build/FINAL_BUILD_CONFIG.md) - Build system configuration

#### Platform-Specific Guides
- [Windows Publishing](./windows-publishing-summary.md) - Windows Store and Winget
- [Microsoft Store Guide](./microsoft-store-guide.md) - Publishing to Microsoft Store
- [Winget Guide](./winget-quick-start.md) - Windows Package Manager
- [Snap Store Guide](./snap-store-guide.md) - Ubuntu Snap Store
- [AUR Publishing](./AUR发布指南.md) - Arch Linux AUR

#### Development Guides
- [Git Hooks](./git-hooks-guide.md) - Automated git hooks
- [Branch Management](./branch-management-guide.md) - Branch strategy
- [Workflows](./workflows-explained.md) - GitHub Actions workflows
- [Automation Features](./automation-features.md) - CI/CD automation

### Project Information

- [API Server](./api-server.md) - Backend API documentation
- [Admin Panel](./admin-panel.md) - Admin interface
- [Mobile App](./mobile-app.md) - Mobile application (planned)
- [AUR Package](./aur-package.md) - Arch Linux package

## 📁 Documentation Structure

```
docs/
├── README.md                    # This file
├── build/                       # Build guides
│   ├── BUILD_ARTIFACTS_LIST.md
│   └── FINAL_BUILD_CONFIG.md
├── release/                     # Release process
│   ├── RELEASE_GUIDE.md
│   └── DISTRIBUTION_STRATEGY.md
├── development/                 # Development guides
│   ├── git-hooks-guide.md
│   ├── branch-management-guide.md
│   └── workflows-explained.md
└── archive/                     # Historical documentation
    ├── MSIX_*.md
    ├── WINGET_*.md
    └── VERSION_BUMP_*.md
```

## 🔍 Quick Links

### Installation
- [Windows Installation](./windows-install-guide.md)
- [macOS Installation](#) (Coming soon)
- [Linux Installation](#) (Coming soon)

### Development
- [Quick Start for Developers](../README.md#-quick-start-for-developers)
- [Contributing Guide](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)

### Release
- [Release Guide](./release/RELEASE_GUIDE.md)
- [Build Artifacts](./build/BUILD_ARTIFACTS_LIST.md)
- [Distribution Strategy](./release/DISTRIBUTION_STRATEGY.md)

## 🆘 Need Help?

- **Issues**: [GitHub Issues](https://github.com/jeasoncc/novel-editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jeasoncc/novel-editor/discussions)
- **Email**: xiaomiquan@aliyun.com

## 📝 Contributing to Documentation

Found a typo or want to improve the docs? Contributions are welcome!

1. Fork the repository
2. Edit the documentation
3. Submit a pull request

All documentation is written in Markdown and located in the `docs/` directory.

---

Last updated: December 2024
