# 启动问题修复指南

## 问题描述

启动时出现以下错误：
- `packageManager` 字段格式错误警告（`yarn@bun@1.1.0`）
- Next.js 尝试使用 yarn 修补 lockfile 失败
- 虽然显示 `✓ Ready`，但页面可能无法正常加载

## 根本原因

Next.js 在启动时会自动尝试修补 lockfile，它会检测并使用系统安装的 yarn，但项目实际使用的是 bun。这导致配置冲突。

## 已应用的修复

1. ✅ 移除了 `optimizeFonts` 配置（Next.js 15 已默认启用）
2. ✅ 在 `apps/web/package.json` 中添加了 `packageManager` 字段
3. ✅ 创建了 `.npmrc` 文件指定包管理器
4. ✅ 清除了 Next.js 缓存

## 立即修复步骤

### 方法 1: 使用修复脚本（推荐）

```bash
cd apps/web
./fix-startup.sh
```

### 方法 2: 手动修复

```bash
# 1. 清除所有缓存
cd apps/web
rm -rf .next node_modules/.cache
rm -f yarn.lock package-lock.json

# 2. 从根目录重新安装依赖
cd ../..
bun install

# 3. 重新启动
bun web:dev
```

### 方法 3: 完全清理重建

```bash
# 从项目根目录执行
cd apps/web
rm -rf .next node_modules
cd ../..
bun install
bun web:dev
```

## 验证修复

修复后，你应该看到：
- ✅ 没有 packageManager 相关的错误
- ✅ 没有 lockfile 修补错误
- ✅ 服务器正常启动
- ✅ 可以访问 http://localhost:3000

## 如果问题仍然存在

### 检查项

1. **确认使用正确的命令**
   ```bash
   # ✅ 正确
   bun web:dev
   
   # ❌ 错误
   npm run dev
   yarn dev
   ```

2. **检查端口占用**
   ```bash
   # 检查 3000 端口是否被占用
   lsof -i :3000
   # 或使用 netstat
   netstat -tulpn | grep 3000
   ```

3. **检查浏览器控制台**
   - 打开 http://localhost:3000
   - 按 F12 打开开发者工具
   - 查看 Console 标签页的错误信息

4. **查看 Next.js 构建日志**
   - 检查终端中的构建错误
   - 查看是否有组件导入错误
   - 检查 TypeScript 类型错误

### 临时解决方案

如果仍然无法启动，可以尝试：

```bash
# 使用 Next.js 的开发模式，禁用某些优化
cd apps/web
SKIP_ENV_VALIDATION=1 next dev
```

## 长期解决方案

为了避免将来的问题：

1. **使用 Bun 作为唯一的包管理器**
   - 不要在项目中使用 npm 或 yarn
   - 使用 `bun install` 安装依赖
   - 使用 `bun run` 执行脚本

2. **保持 packageManager 字段**
   - 确保根目录和子项目的 `package.json` 中都有正确的 `packageManager` 字段
   - 当前配置：`"packageManager": "bun@1.1.0"`

3. **定期清理缓存**
   ```bash
   # 定期清理 Next.js 缓存
   rm -rf apps/web/.next
   ```

## 相关文件

- `apps/web/package.json` - 包配置
- `apps/web/next.config.ts` - Next.js 配置
- `apps/web/.npmrc` - 包管理器配置
- `package.json` (根目录) - Monorepo 配置

## 联系支持

如果问题仍然存在，请提供：
1. 完整的错误日志
2. 执行的命令
3. Node.js/Bun 版本信息
4. 操作系统信息

---

**最后更新**: 2025年1月


