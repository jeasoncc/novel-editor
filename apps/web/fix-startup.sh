#!/bin/bash

# 修复 Next.js 启动问题脚本

echo "🔧 开始修复启动问题..."

# 1. 清除 Next.js 缓存
echo "📦 清除 Next.js 缓存..."
rm -rf .next
rm -rf node_modules/.cache

# 2. 清除可能的 lockfile 缓存
echo "🔓 清除 lockfile 缓存..."
rm -f yarn.lock
rm -f package-lock.json

# 3. 确保使用 bun
echo "✅ 验证包管理器配置..."
if ! command -v bun &> /dev/null; then
    echo "❌ 错误: 未找到 bun，请先安装 bun"
    exit 1
fi

echo "✅ bun 已安装: $(bun --version)"

# 4. 重新安装依赖（如果需要）
echo "📥 检查依赖..."
bun install

echo ""
echo "✅ 修复完成！"
echo ""
echo "现在可以尝试启动服务器："
echo "  bun run dev"
echo ""
echo "或者从根目录："
echo "  bun web:dev"

