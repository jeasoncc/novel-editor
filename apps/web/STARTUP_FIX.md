# 启动问题修复说明

## 已修复的问题

### 1. ✅ Next.js 15 配置问题

**问题**: `optimizeFonts` 配置选项在 Next.js 15 中已被移除

**修复**: 已从 `next.config.ts` 中移除 `optimizeFonts: true` 配置

**原因**: Next.js 15 中字体优化已经默认启用，不再需要显式配置

### 2. ⚠️ packageManager 警告

**问题**: Next.js 在尝试修补 lockfile 时遇到 packageManager 配置警告

**说明**: 
- 这些是警告信息，不影响应用运行
- 服务器最终成功启动（`✓ Ready in 6.5s`）
- 根目录的 `package.json` 中已正确配置 `"packageManager": "bun@1.1.0"`

**可能的解决方案**（如果需要完全消除警告）:

#### 方案 1: 清除 Next.js 缓存并重新安装依赖

```bash
cd apps/web
rm -rf .next node_modules
cd ../..
bun install
```

#### 方案 2: 确保使用正确的包管理器

项目使用 Bun 作为包管理器，确保：
- 使用 `bun install` 而不是 `npm install` 或 `yarn install`
- 使用 `bun run dev` 启动开发服务器

#### 方案 3: 如果必须使用 yarn（不推荐）

如果需要使用 yarn，需要：
1. 在根目录运行 `corepack enable`
2. 或者从根目录 `package.json` 中移除 `packageManager` 字段

**建议**: 继续使用 Bun，这些警告不影响功能。

## 当前状态

✅ **应用已成功启动**
- 本地访问: http://localhost:3000
- 网络访问: http://192.168.5.4:3000
- 开发服务器运行正常

⚠️ **仍有警告信息**
- packageManager 相关警告（不影响使用）
- lockfile 修补警告（不影响使用）

## 验证

启动应用后，可以：
1. 访问 http://localhost:3000 查看网站
2. 检查文档页面是否正常：
   - http://localhost:3000/docs
   - http://localhost:3000/docs/manual
   - http://localhost:3000/docs/wiki

## 后续建议

如果警告信息影响开发体验，可以：
1. 清除 `.next` 缓存目录
2. 重新安装依赖
3. 确保使用 Bun 作为包管理器

但这些警告不影响应用功能，可以忽略。


