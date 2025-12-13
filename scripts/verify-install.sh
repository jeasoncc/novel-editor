#!/bin/bash

# 触发安装验证工作流
# 用法: npm run verify:install [version]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取版本号
if [ -n "$1" ]; then
    VERSION="$1"
else
    VERSION=$(jq -r '.version' package.json)
fi

echo -e "${BLUE}🔍 Installation Verification Trigger${NC}"
echo "======================================"
echo -e "Version: ${GREEN}$VERSION${NC}"
echo ""

# 检查 gh CLI
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
    echo ""
    echo "Please install it first:"
    echo "  macOS:   brew install gh"
    echo "  Linux:   sudo apt install gh"
    echo "  Windows: winget install GitHub.cli"
    echo ""
    echo "Then authenticate with: gh auth login"
    exit 1
fi

# 检查认证状态
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with GitHub${NC}"
    echo "Please run: gh auth login"
    exit 1
fi

# 获取仓库信息
REPO=$(gh repo view --json nameWithOwner -q '.nameWithOwner' 2>/dev/null || echo "")

if [ -z "$REPO" ]; then
    echo -e "${RED}❌ Could not determine repository${NC}"
    echo "Make sure you're in a git repository with a GitHub remote"
    exit 1
fi

echo -e "Repository: ${GREEN}$REPO${NC}"
echo ""

# 确认触发
echo -e "${YELLOW}This will trigger the installation verification workflow.${NC}"
echo "It will verify installations on:"
echo "  • Windows: MSI, NSIS, Winget, Chocolatey, Scoop"
echo "  • macOS: DMG (ARM64, x64), Homebrew"
echo "  • Linux: DEB, AppImage, Snap, Flatpak, AUR, PPA, COPR, OBS, Gentoo"
echo "  • Web: Vercel, Netlify"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# 触发工作流
echo ""
echo -e "${BLUE}🚀 Triggering workflow...${NC}"

gh workflow run install-verify.yml \
    --repo "$REPO" \
    -f version="$VERSION"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Workflow triggered successfully!${NC}"
    echo ""
    echo "View progress at:"
    echo -e "  ${BLUE}https://github.com/$REPO/actions/workflows/install-verify.yml${NC}"
    echo ""
    echo "Or run: gh run list --workflow=install-verify.yml --limit=1"
else
    echo ""
    echo -e "${RED}❌ Failed to trigger workflow${NC}"
    exit 1
fi
