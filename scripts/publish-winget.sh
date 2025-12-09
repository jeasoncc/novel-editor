#!/bin/bash

# Winget 发布自动化脚本
# 自动创建 PR 到 microsoft/winget-pkgs
# 
# 注意：可以在任何系统上运行（Linux/macOS/Windows）
# 只需要 Git 和 GitHub CLI

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Winget 发布自动化脚本${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 检查必要的工具
echo "检查必要的工具..."

if ! command -v gh &> /dev/null; then
    echo -e "${RED}错误: 未安装 GitHub CLI (gh)${NC}"
    echo "请访问: https://cli.github.com/"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}错误: 未安装 Git${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} 工具检查通过"
echo ""

# 获取版本号
VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
echo "当前版本: ${YELLOW}$VERSION${NC}"
echo ""

# 检查清单文件是否存在
MANIFEST_DIR="winget-manifests"
if [ ! -d "$MANIFEST_DIR" ]; then
    echo -e "${RED}错误: 找不到清单文件目录: $MANIFEST_DIR${NC}"
    exit 1
fi

echo "清单文件:"
ls -1 "$MANIFEST_DIR"
echo ""

# 询问是否继续
read -p "是否继续发布到 Winget? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 0
fi

# 克隆 winget-pkgs (如果不存在)
WINGET_REPO="winget-pkgs"
if [ ! -d "$WINGET_REPO" ]; then
    echo ""
    echo "克隆 winget-pkgs 仓库..."
    
    # 获取 GitHub 用户名
    GH_USER=$(gh api user --jq .login)
    
    # 检查是否已经 fork
    echo "检查是否已有 fork..."
    if gh repo view "$GH_USER/winget-pkgs" &> /dev/null; then
        echo "检测到已有 fork，克隆你的 fork（SSH，浅克隆）..."
        git clone --depth=1 "git@github.com:$GH_USER/winget-pkgs.git" "$WINGET_REPO"
        cd "$WINGET_REPO"
        git remote add upstream "git@github.com:microsoft/winget-pkgs.git"
        cd ..
    else
        echo "正在 fork microsoft/winget-pkgs..."
        gh repo fork microsoft/winget-pkgs --clone=false
        echo "等待 fork 完成..."
        sleep 3
        echo "克隆你的 fork（SSH，浅克隆）..."
        git clone --depth=1 "git@github.com:$GH_USER/winget-pkgs.git" "$WINGET_REPO"
        cd "$WINGET_REPO"
        git remote add upstream "git@github.com:microsoft/winget-pkgs.git"
        cd ..
    fi
else
    echo ""
    echo "使用现有的 winget-pkgs 目录"
    cd "$WINGET_REPO"
    git fetch origin
    git checkout master 2>/dev/null || git checkout main
    git pull origin master 2>/dev/null || git pull origin main
    cd ..
fi

# 创建目标目录
TARGET_DIR="$WINGET_REPO/manifests/j/Jeason/NovelEditor/$VERSION"
echo ""
echo "创建目标目录: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

# 复制清单文件
echo "复制清单文件..."
cp "$MANIFEST_DIR"/* "$TARGET_DIR/"

# 列出复制的文件
echo ""
echo "已复制的文件:"
ls -1 "$TARGET_DIR"
echo ""

# 进入 winget-pkgs 目录
cd "$WINGET_REPO"

# 创建新分支
BRANCH_NAME="novel-editor-$VERSION"
echo "创建分支: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

# 添加文件
echo "添加文件到 Git..."
git add "manifests/j/Jeason/NovelEditor/$VERSION/"

# 提交
COMMIT_MSG="New package: Jeason.NovelEditor version $VERSION"
echo "提交: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# 推送
echo "推送到 GitHub..."
git push -u origin "$BRANCH_NAME"

# 创建 PR
echo ""
echo "创建 Pull Request..."

PR_TITLE="New package: Jeason.NovelEditor version $VERSION"
PR_BODY="Novel Editor - 一个现代化的小说编辑器

**Package Information:**
- Package: Jeason.NovelEditor
- Version: $VERSION
- Publisher: Lotus
- License: MIT

**Description:**
Novel Editor 是一个功能强大的小说编辑器，提供丰富的编辑功能和直观的用户界面。

**Features:**
- 富文本编辑器，支持 Markdown
- 章节管理和大纲视图
- 角色管理
- 场景管理
- 自动保存
- 跨平台支持

**Links:**
- Homepage: https://github.com/jeasoncc/novel-editor
- Release: https://github.com/jeasoncc/novel-editor/releases/tag/desktop-v$VERSION
"

gh pr create \
  --repo microsoft/winget-pkgs \
  --title "$PR_TITLE" \
  --body "$PR_BODY" \
  --head "$(gh api user --jq .login):$BRANCH_NAME"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ PR 创建成功！${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "下一步:"
echo "1. 访问 PR 页面查看状态"
echo "2. 等待机器人验证（几分钟）"
echo "3. 等待维护者审核（1-3天）"
echo "4. PR 合并后，用户可以使用 'winget install Jeason.NovelEditor' 安装"
echo ""
echo "查看 PR:"
gh pr view --web

cd ..
