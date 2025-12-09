#!/bin/bash

# Winget PR 创建脚本（假设已经克隆了 winget-pkgs）
# 使用方法：在 winget-pkgs 目录外运行此脚本

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Winget PR 创建脚本${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 获取版本号
VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
echo "版本: ${YELLOW}$VERSION${NC}"
echo ""

# 检查 winget-pkgs 目录
if [ ! -d "winget-pkgs" ]; then
    echo -e "${RED}错误: 找不到 winget-pkgs 目录${NC}"
    echo ""
    echo "请先克隆仓库："
    echo "  git clone --depth=1 git@github.com:jeasoncc/winget-pkgs.git"
    echo ""
    exit 1
fi

echo "进入 winget-pkgs 目录..."
cd winget-pkgs

# 更新 master 分支
echo "更新 master 分支..."
git checkout master 2>/dev/null || git checkout main
git pull origin master 2>/dev/null || git pull origin main

# 创建目录
TARGET_DIR="manifests/j/Jeason/NovelEditor/$VERSION"
echo "创建目录: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

# 复制清单文件
echo "复制清单文件..."
cp ../winget-manifests/* "$TARGET_DIR/"

# 列出文件
echo ""
echo "已复制的文件:"
ls -1 "$TARGET_DIR"
echo ""

# 创建分支
BRANCH_NAME="novel-editor-$VERSION"
echo "创建分支: $BRANCH_NAME"
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"

# 添加文件
echo "添加文件..."
git add "$TARGET_DIR"

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
  --head "jeasoncc:$BRANCH_NAME"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  ✅ PR 创建成功！${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "查看 PR:"
gh pr view --web

cd ..
