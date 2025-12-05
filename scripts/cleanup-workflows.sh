#!/bin/bash

# Workflows 清理脚本
# 帮助你删除不需要的 workflows

set -e

echo "🧹 GitHub Workflows 清理工具"
echo ""

cd "$(git rev-parse --show-toplevel)"

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 统计当前 workflows
TOTAL=$(ls -1 .github/workflows/*.yml 2>/dev/null | wc -l)

echo "📊 当前状态:"
echo "  - Workflows 总数: $TOTAL"
echo ""

# 显示所有 workflows
echo "📋 当前 Workflows:"
echo ""
ls -1 .github/workflows/*.yml | sed 's|.github/workflows/||' | nl
echo ""

# 询问清理级别
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  选择清理级别"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1) 最小清理 - 只删除明显不需要的（推荐）"
echo "   删除: performance.yml, backup.yml"
echo "   保留: 14 个"
echo ""
echo "2) 标准清理 - 删除可选的质量检查"
echo "   删除: performance, backup, bundle-size, coverage, issue-labeler, greetings"
echo "   保留: 10 个"
echo ""
echo "3) 最大清理 - 只保留核心功能"
echo "   删除: 所有可选 workflows"
echo "   保留: 6 个（CI/CD + 发布管理）"
echo ""
echo "4) 自定义 - 手动选择要删除的"
echo ""
echo "5) 取消"
echo ""

read -p "选择 (1-5): " CHOICE

case $CHOICE in
    1)
        echo ""
        echo -e "${YELLOW}最小清理模式${NC}"
        echo ""
        
        TO_DELETE=(
            "performance.yml"
            "backup.yml"
        )
        ;;
    
    2)
        echo ""
        echo -e "${YELLOW}标准清理模式${NC}"
        echo ""
        
        TO_DELETE=(
            "performance.yml"
            "backup.yml"
            "bundle-size.yml"
            "coverage.yml"
            "issue-labeler.yml"
            "greetings.yml"
        )
        ;;
    
    3)
        echo ""
        echo -e "${YELLOW}最大清理模式${NC}"
        echo ""
        
        TO_DELETE=(
            "performance.yml"
            "backup.yml"
            "bundle-size.yml"
            "coverage.yml"
            "issue-labeler.yml"
            "greetings.yml"
            "security.yml"
            "quality-gate.yml"
            "pr-checks.yml"
            "stale.yml"
        )
        ;;
    
    4)
        echo ""
        echo -e "${YELLOW}自定义模式${NC}"
        echo ""
        echo "输入要删除的 workflow 编号（用空格分隔）:"
        echo "例如: 1 3 5"
        echo ""
        
        read -p "编号: " NUMBERS
        
        TO_DELETE=()
        for num in $NUMBERS; do
            file=$(ls -1 .github/workflows/*.yml | sed 's|.github/workflows/||' | sed -n "${num}p")
            if [ -n "$file" ]; then
                TO_DELETE+=("$file")
            fi
        done
        ;;
    
    5)
        echo "已取消"
        exit 0
        ;;
    
    *)
        echo -e "${RED}无效选择${NC}"
        exit 1
        ;;
esac

# 显示将要删除的文件
if [ ${#TO_DELETE[@]} -eq 0 ]; then
    echo -e "${GREEN}没有要删除的文件${NC}"
    exit 0
fi

echo "将要删除以下 workflows:"
echo ""
for file in "${TO_DELETE[@]}"; do
    if [ -f ".github/workflows/$file" ]; then
        echo -e "  ${RED}✗${NC} $file"
    else
        echo -e "  ${YELLOW}⚠${NC} $file (不存在)"
    fi
done

echo ""
read -p "确认删除? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 0
fi

# 删除文件
echo ""
echo "🗑️  删除中..."
echo ""

DELETED=0
SKIPPED=0

for file in "${TO_DELETE[@]}"; do
    if [ -f ".github/workflows/$file" ]; then
        rm ".github/workflows/$file"
        echo -e "${GREEN}✓${NC} 已删除: $file"
        ((DELETED++))
    else
        echo -e "${YELLOW}⚠${NC} 跳过: $file (不存在)"
        ((SKIPPED++))
    fi
done

echo ""

# 统计结果
REMAINING=$(ls -1 .github/workflows/*.yml 2>/dev/null | wc -l)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ 清理完成"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 统计:"
echo "  - 删除: $DELETED 个"
echo "  - 跳过: $SKIPPED 个"
echo "  - 剩余: $REMAINING 个"
echo ""

# 显示剩余的 workflows
echo "📋 剩余 Workflows:"
echo ""
ls -1 .github/workflows/*.yml | sed 's|.github/workflows/||' | nl
echo ""

# 询问是否提交
read -p "是否提交更改? (y/N) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📝 提交更改..."
    
    git add .github/workflows/
    git commit -m "chore: clean up workflows - removed $DELETED workflows"
    
    echo ""
    echo -e "${GREEN}✓${NC} 已提交"
    echo ""
    
    read -p "是否推送到远程? (y/N) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push
        echo ""
        echo -e "${GREEN}✓${NC} 已推送"
    fi
fi

echo ""
echo "🎉 完成！"
echo ""
echo "💡 提示:"
echo "  - 查看剩余 workflows: ls .github/workflows/"
echo "  - 查看详细说明: cat WORKFLOWS_OVERVIEW.md"
echo "  - 恢复删除: git checkout .github/workflows/"
