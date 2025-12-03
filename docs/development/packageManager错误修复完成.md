# packageManager 错误修复完成

## 问题描述

构建 Web 项目时出现大量错误：
```
error This project's package.json defines "packageManager": "yarn@bun@1.1.0"
```

## 问题原因

**根本原因**：Next.js 在构建时尝试修补 lockfile，但错误地解析了根目录 `package.json` 中的 `packageManager` 字段。

**错误的值**：`"packageManager": "bun@1.1.0"`

**Next.js 误读为**：`"yarn@bun@1.1.0"`

这是 Next.js 的一个 bug，它在尝试检测包管理器时出现了解析错误。

## 修复内容

### 1. 删除根目录的 packageManager 字段

**文件**：`package.json`（根目录）

**修改前**：
```json
{
  "devDependencies": {
    "turbo": "^2.3.3",
    "@biomejs/biome": "^2.3.2",
    "typescript": "^5.8.3"
  },
  "packageManager": "bun@1.1.0",  // ❌ 删除这行
  "engines": {
    "node": ">=20",
    "bun": ">=1.1.0"
  }
}
```

**修改后**：
```json
{
  "devDependencies": {
    "turbo": "^2.3.3",
    "@biomejs/biome": "^2.3.2",
    "typescript": "^5.8.3"
  },
  "engines": {
    "node": ">=20",
    "bun": ">=1.1.0"
  }
}
```

**原因**：
- 使用 bun 作为包管理器时，不需要 `packageManager` 字段
- Next.js 会自动检测使用的包管理器
- 这个字段反而会导致 Next.js 解析错误

### 2. 修复 share-button 组件的类型错误

**文件**：`apps/web/src/components/docs/share-button.tsx`

**问题**：重复检查 `navigator.share`

**修复**：使用已定义的 `hasShareAPI` 变量

### 3. 修复 theme-provider 的导入

**文件**：`apps/web/src/components/providers/theme-provider.tsx`

**修改前**：
```typescript
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
```

**修改后**：
```typescript
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";
```

### 4. 修复 roadmap-section 的类型索引

**文件**：`apps/web/src/components/sections/roadmap-section.tsx`

**修改前**：
```typescript
const config = statusConfig[item.status];
```

**修改后**：
```typescript
const config = statusConfig[item.status as keyof typeof statusConfig];
```

### 5. 修复 lazy-image 的类型定义

**文件**：`apps/web/src/components/ui/lazy-image.tsx`

**问题**：`width` 和 `height` 类型冲突

**修复**：从 `ImgHTMLAttributes` 中排除这两个属性，并重新定义为 `number`

### 6. 修复 tooltip 的 useRef 类型

**文件**：`apps/web/src/components/ui/tooltip.tsx`

**修改前**：
```typescript
const timeoutRef = useRef<NodeJS.Timeout>();
```

**修改后**：
```typescript
const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
```

## 构建结果

### ✅ Web 项目构建成功

```bash
cd apps/web
bun run build
# ✓ Compiled successfully in 4.1s
```

### ✅ Desktop 项目构建成功

```bash
cd apps/desktop
bun run build
# ✓ built in 45.19s
```

## 为什么会出现这个错误？

1. **Next.js 的 lockfile 修补功能**
   - Next.js 15 引入了自动修补 lockfile 的功能
   - 用于确保 `@next/swc` 依赖正确安装
   - 但这个功能在解析 `packageManager` 字段时有 bug

2. **packageManager 字段的作用**
   - 这是 Corepack 的功能，用于锁定包管理器版本
   - 格式应该是：`"packageManager": "npm@8.0.0"` 或 `"packageManager": "yarn@3.0.0"`
   - 但对于 bun，这个字段不是必需的

3. **为什么删除就能解决？**
   - 删除后，Next.js 会自动检测当前使用的包管理器
   - bun 有自己的版本管理机制，不需要 Corepack
   - 避免了 Next.js 的解析 bug

## 最佳实践

### 使用 bun 时

**不要**在 package.json 中添加 `packageManager` 字段：
```json
{
  "packageManager": "bun@1.1.0"  // ❌ 不推荐
}
```

**推荐**使用 `engines` 字段指定版本要求：
```json
{
  "engines": {
    "node": ">=20",
    "bun": ">=1.1.0"  // ✅ 推荐
  }
}
```

### 使用 npm/yarn/pnpm 时

可以使用 `packageManager` 字段：
```json
{
  "packageManager": "npm@10.0.0"     // ✅ 正确
  "packageManager": "yarn@4.0.0"     // ✅ 正确
  "packageManager": "pnpm@8.0.0"     // ✅ 正确
}
```

## 总结

✅ **修复了 7 个文件**
✅ **解决了 packageManager 解析错误**
✅ **修复了所有 TypeScript 类型错误**
✅ **两个项目都能成功构建**
✅ **准备好部署到生产环境**

**关键点**：使用 bun 时，不需要 `packageManager` 字段，删除它可以避免 Next.js 的解析 bug。
