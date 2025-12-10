#!/bin/bash

echo "=========================================="
echo "  Snapcraft 登录工具"
echo "=========================================="
echo ""
echo "请按照提示操作："
echo "1. 输入你的 Ubuntu One 邮箱"
echo "2. 输入密码"
echo "3. 登录成功后，凭证会保存到 output/snapcraft-credentials.txt"
echo ""
echo "=========================================="
echo ""

# 登录
snapcraft login

# 导出凭证
if snapcraft export-login /output/snapcraft-credentials.txt; then
    echo ""
    echo "=========================================="
    echo "✓ 凭证已保存到 output/snapcraft-credentials.txt"
    echo ""
    echo "下一步："
    echo "1. 打开 GitHub 仓库 -> Settings -> Secrets -> Actions"
    echo "2. 新建 Secret，名称: SNAPCRAFT_TOKEN"
    echo "3. 将 output/snapcraft-credentials.txt 的内容粘贴进去"
    echo "=========================================="
    echo ""
    echo "凭证内容："
    echo "=========================================="
    cat /output/snapcraft-credentials.txt
    echo ""
    echo "=========================================="
else
    echo "✗ 导出凭证失败"
    exit 1
fi
