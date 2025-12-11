#!/bin/bash

echo "🔧 修复路由问题..."

# 1. 删除路由缓存
echo "📁 清理缓存文件..."
rm -rf .turbo
rm -rf node_modules/.cache
rm -rf dist

# 2. 重新生成路由树
echo "🌳 重新生成路由树..."
rm -f src/routeTree.gen.ts

# 3. 重新安装依赖（如果需要）
echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "安装依赖..."
    npm install
fi

echo "✅ 修复完成！"
echo ""
echo "请重启开发服务器："
echo "  npm run dev"
echo ""
echo "然后访问: http://localhost:1420/settings"