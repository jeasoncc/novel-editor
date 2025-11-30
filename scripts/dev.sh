#!/bin/bash

# Novel Editor 开发脚本

echo "🚀 Novel Editor Monorepo"
echo ""
echo "选择要启动的项目:"
echo "1) 官网 (Next.js)"
echo "2) 桌面应用 (Tauri)"
echo "3) 全部"
echo ""
read -p "请输入选项 (1-3): " choice

case $choice in
  1)
    echo "🌐 启动官网..."
    bun web:dev
    ;;
  2)
    echo "🖥️  启动桌面应用..."
    bun desktop:dev
    ;;
  3)
    echo "🚀 启动所有项目..."
    bun dev
    ;;
  *)
    echo "❌ 无效选项"
    exit 1
    ;;
esac
