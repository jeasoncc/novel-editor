#!/bin/bash

# 更新Winget manifests到当前版本
# 用法: ./scripts/update-winget-manifests.sh [version]

set -e

# 获取项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# 获取版本号
if [ -n "$1" ]; then
    VERSION="$1"
else
    VERSION=$(grep '"version"' package.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
fi

echo "🔄 更新Winget manifests到版本: $VERSION"
echo ""

# 检查MSI文件是否存在
MSI_URL="https://github.com/jeasoncc/novel-editor/releases/download/desktop-v${VERSION}/novel-editor_${VERSION}_x64_zh-CN.msi"
echo "📥 检查MSI文件: $MSI_URL"

# 下载MSI文件来计算SHA256
TEMP_MSI="temp_novel-editor_${VERSION}_x64_zh-CN.msi"
if curl -L -f -o "$TEMP_MSI" "$MSI_URL" 2>/dev/null; then
    echo "✅ MSI文件下载成功"
    
    # 计算SHA256
    if command -v sha256sum >/dev/null 2>&1; then
        SHA256=$(sha256sum "$TEMP_MSI" | cut -d' ' -f1 | tr '[:lower:]' '[:upper:]')
    elif command -v shasum >/dev/null 2>&1; then
        SHA256=$(shasum -a 256 "$TEMP_MSI" | cut -d' ' -f1 | tr '[:lower:]' '[:upper:]')
    else
        echo "❌ 无法找到SHA256计算工具"
        rm -f "$TEMP_MSI"
        exit 1
    fi
    
    echo "🔐 SHA256: $SHA256"
    rm -f "$TEMP_MSI"
else
    echo "❌ 无法下载MSI文件，请确保release已发布"
    exit 1
fi

echo ""
echo "📝 更新manifest文件..."

# 更新版本文件
cat > "winget-manifests/Jeason.NovelEditor.yaml" << EOF
# yaml-language-server: \$schema=https://aka.ms/winget-manifest.version.1.5.0.schema.json

PackageIdentifier: Jeason.NovelEditor
PackageVersion: $VERSION
DefaultLocale: zh-CN
ManifestType: version
ManifestVersion: 1.5.0
EOF

# 更新安装器文件
cat > "winget-manifests/Jeason.NovelEditor.installer.yaml" << EOF
# yaml-language-server: \$schema=https://aka.ms/winget-manifest.installer.1.5.0.schema.json

PackageIdentifier: Jeason.NovelEditor
PackageVersion: $VERSION
Platform:
- Windows.Desktop
MinimumOSVersion: 10.0.0.0
InstallerType: wix
Scope: machine
InstallModes:
- interactive
- silent
- silentWithProgress
UpgradeBehavior: install
Installers:
- Architecture: x64
  InstallerUrl: $MSI_URL
  InstallerSha256: $SHA256
ManifestType: installer
ManifestVersion: 1.5.0
EOF

# 更新locale文件
cat > "winget-manifests/Jeason.NovelEditor.locale.zh-CN.yaml" << EOF
# yaml-language-server: \$schema=https://aka.ms/winget-manifest.defaultLocale.1.5.0.schema.json

PackageIdentifier: Jeason.NovelEditor
PackageVersion: $VERSION
PackageLocale: zh-CN
Publisher: Lotus
PublisherUrl: https://github.com/jeasoncc
PublisherSupportUrl: https://github.com/jeasoncc/novel-editor/issues
Author: Jeason
PackageName: Novel Editor
PackageUrl: https://github.com/jeasoncc/novel-editor
License: MIT
LicenseUrl: https://github.com/jeasoncc/novel-editor/blob/main/LICENSE
Copyright: Copyright (c) 2024 Jeason
ShortDescription: 一个现代化的小说编辑器
Description: |-
  Novel Editor 是一个功能强大的小说编辑器，提供丰富的编辑功能和直观的用户界面。
  
  主要特性：
  - 富文本编辑器，支持 Markdown
  - 章节管理和大纲视图
  - 角色管理
  - 场景管理
  - 自动保存
  - 跨平台支持
Moniker: novel-editor
Tags:
- editor
- novel
- writing
- markdown
- 小说
- 编辑器
- 写作
ManifestType: defaultLocale
ManifestVersion: 1.5.0
EOF

echo "✅ Manifest文件已更新"
echo ""

# 验证文件
echo "🔍 验证manifest文件..."
for file in winget-manifests/*.yaml; do
    if [ -f "$file" ]; then
        echo "  ✓ $(basename "$file")"
    fi
done

echo ""
echo "🎉 Winget manifests更新完成！"
echo ""
echo "📋 下一步操作："
echo "1. 提交更改到git仓库"
echo "2. 手动创建PR到 microsoft/winget-pkgs 仓库"
echo "3. 或者运行 winget-publish workflow"
echo ""
echo "🔗 有用链接："
echo "- Winget-pkgs: https://github.com/microsoft/winget-pkgs"
echo "- 提交指南: https://github.com/microsoft/winget-pkgs/blob/master/CONTRIBUTING.md"