#!/bin/bash

files=(
  "src/app/about/page.tsx"
  "src/app/conduct/page.tsx"
  "src/app/contributors/page.tsx"
  "src/app/donate/page.tsx"
  "src/app/download/page.tsx"
  "src/app/license/page.tsx"
  "src/app/security/page.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # 移除 metadata 导出和 Metadata 导入
    sed -i '/^import type { Metadata }/d' "$file"
    sed -i '/^export const metadata: Metadata = {/,/^};$/d' "$file"
    echo "Removed metadata from $file"
  fi
done

echo "Done!"
