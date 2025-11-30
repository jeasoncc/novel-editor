#!/bin/bash

echo "🔍 Monorepo 迁移提交脚本"
echo ""

# 显示当前状态
echo "📊 当前 Git 状态:"
echo "=================="
git status --short | head -20
echo ""
echo "... (更多文件)"
echo ""

# 统计变更
DELETED=$(git status --short | grep "^ D" | wc -l)
MODIFIED=$(git status --short | grep "^ M" | wc -l)
UNTRACKED=$(git status --short | grep "^??" | wc -l)

echo "📈 变更统计:"
echo "  删除的文件: $DELETED (移动到 apps/desktop/)"
echo "  修改的文件: $MODIFIED"
echo "  新增的文件: $UNTRACKED"
echo ""

# 验证 node_modules 被忽略
echo "✅ 验证 node_modules 被忽略:"
if git check-ignore node_modules > /dev/null 2>&1; then
    echo "  ✓ node_modules 被正确忽略"
else
    echo "  ✗ 警告: node_modules 未被忽略"
fi
echo ""

# 询问是否继续
read -p "是否继续提交这些变更? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📝 添加所有变更..."
    git add .
    
    echo ""
    echo "💾 提交变更..."
    git commit -m "refactor: migrate to monorepo structure

- Move desktop app to apps/desktop/
- Create web app in apps/web/
- Setup Turborepo with Bun workspaces
- Update GitHub Actions workflows
- Optimize .gitignore for monorepo
- Add comprehensive documentation

This is a major refactoring to support multiple applications
in a single repository using Turborepo and Bun workspaces."
    
    echo ""
    echo "✅ 提交完成!"
    echo ""
    echo "📤 下一步: 推送到远程仓库"
    echo "   git push origin main"
    echo ""
else
    echo ""
    echo "❌ 已取消"
    echo ""
fi
