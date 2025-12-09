#!/bin/bash

# 获取 MSI 文件的 ProductCode
# 用于 Winget 清单

set -e

MSI_FILE="${1:-/tmp/novel-editor.msi}"

if [ ! -f "$MSI_FILE" ]; then
    echo "错误: MSI 文件不存在: $MSI_FILE"
    exit 1
fi

echo "正在提取 ProductCode..."
echo ""

# 方法 1: 使用 msiinfo (Linux)
if command -v msiinfo &> /dev/null; then
    echo "使用 msiinfo 提取..."
    PRODUCT_CODE=$(msiinfo export "$MSI_FILE" Property | grep -A1 "ProductCode" | tail -1 | awk '{print $2}')
    if [ -n "$PRODUCT_CODE" ]; then
        echo "ProductCode: $PRODUCT_CODE"
        exit 0
    fi
fi

# 方法 2: 使用 7z 提取并解析
if command -v 7z &> /dev/null; then
    echo "使用 7z 提取..."
    TEMP_DIR=$(mktemp -d)
    7z x "$MSI_FILE" -o"$TEMP_DIR" > /dev/null 2>&1
    
    # 查找 Property 表
    if [ -f "$TEMP_DIR/Property.idt" ]; then
        PRODUCT_CODE=$(grep "ProductCode" "$TEMP_DIR/Property.idt" | awk '{print $2}')
        rm -rf "$TEMP_DIR"
        
        if [ -n "$PRODUCT_CODE" ]; then
            echo "ProductCode: $PRODUCT_CODE"
            exit 0
        fi
    fi
    
    rm -rf "$TEMP_DIR"
fi

# 方法 3: 使用 strings 查找 GUID 模式
echo "使用 strings 查找..."
PRODUCT_CODE=$(strings "$MSI_FILE" | grep -E '\{[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}\}' | head -1)

if [ -n "$PRODUCT_CODE" ]; then
    echo "可能的 ProductCode: $PRODUCT_CODE"
    echo ""
    echo "注意: 这可能不是正确的 ProductCode，建议在 Windows 上验证"
    exit 0
fi

echo "错误: 无法提取 ProductCode"
echo ""
echo "请在 Windows 上运行以下 PowerShell 命令："
echo ""
echo "  \$msi = Get-Item 'novel-editor_0.1.11_x64_zh-CN.msi'"
echo "  \$installer = New-Object -ComObject WindowsInstaller.Installer"
echo "  \$database = \$installer.GetType().InvokeMember('OpenDatabase', 'InvokeMethod', \$null, \$installer, @(\$msi.FullName, 0))"
echo "  \$view = \$database.GetType().InvokeMember('OpenView', 'InvokeMethod', \$null, \$database, \"SELECT Value FROM Property WHERE Property = 'ProductCode'\")"
echo "  \$view.GetType().InvokeMember('Execute', 'InvokeMethod', \$null, \$view, \$null)"
echo "  \$record = \$view.GetType().InvokeMember('Fetch', 'InvokeMethod', \$null, \$view, \$null)"
echo "  \$productCode = \$record.GetType().InvokeMember('StringData', 'GetProperty', \$null, \$record, 1)"
echo "  Write-Output \$productCode"
echo ""

exit 1
