# 🧹 Workflows 清理总结

## 📊 当前状态

你的项目有 **16 个 GitHub Workflows**，确实有点多。

## 🎯 推荐操作

### 立即删除（2 个）

这两个 workflow 很少使用，建议立即删除：

```bash
rm .github/workflows/performance.yml
rm .github/workflows/backup.yml
```

**理由**:
- **performance.yml**: Lighthouse 测试很少需要，可以手动运行
- **backup.yml**: GitHub 已经有完整的备份机制

**效果**: 16 个 → 14 个

### 使用清理脚本

```bash
./scripts/cleanup-workflows.sh
```

脚本提供 3 种清理级别：
1. **最小清理** - 删除 2 个（推荐）
2. **标准清理** - 删除 6 个
3. **最大清理** - 删除 10 个

## 📋 Workflows 分类

### ✅ 必须保留（6 个）

#### 核心 CI/CD（3 个）
1. **ci.yml** - 代码检查和构建
2. **deploy-web.yml** - 网站部署
3. **release-desktop.yml** - 桌面应用发布

#### 发布管理（3 个）
4. **changelog.yml** - 自动更新 CHANGELOG
5. **release-notes.yml** - 生成 Release Notes
6. **aur-publish.yml** - 发布到 AUR

### ⚠️ 可选保留（8 个）

#### 代码质量（4 个）
7. **security.yml** - 安全扫描（每周）
8. **quality-gate.yml** - 代码质量检查（每次 PR）
9. **bundle-size.yml** - Bundle 大小检查（每次 PR）
10. **coverage.yml** - 代码覆盖率（每次 PR）

#### Issue/PR 管理（4 个）
11. **issue-labeler.yml** - 自动标记 Issues
12. **pr-checks.yml** - PR 检查和统计
13. **stale.yml** - 关闭过期 Issues
14. **greetings.yml** - 欢迎新贡献者

### ❌ 建议删除（2 个）

15. **performance.yml** - 性能测试（很少使用）
16. **backup.yml** - 仓库备份（GitHub 已有）

## 🎯 推荐配置方案

### 方案 A: 最小化（6 个）⭐⭐⭐⭐⭐

**适合**: 个人开发者

**保留**:
- CI/CD（3 个）
- 发布管理（3 个）

**删除**:
- 所有可选 workflows（10 个）

**优点**:
- 简单清晰
- 减少 54% 的运行次数
- 保留核心功能

**执行**:
```bash
./scripts/cleanup-workflows.sh
# 选择: 3 (最大清理)
```

### 方案 B: 标准配置（10 个）⭐⭐⭐⭐

**适合**: 小团队协作

**保留**:
- CI/CD（3 个）
- 发布管理（3 个）
- security.yml
- quality-gate.yml
- pr-checks.yml
- stale.yml

**删除**:
- performance.yml
- backup.yml
- bundle-size.yml
- coverage.yml
- issue-labeler.yml
- greetings.yml

**优点**:
- 保留重要的质量检查
- 保留 PR 管理
- 减少 37% 的运行次数

**执行**:
```bash
./scripts/cleanup-workflows.sh
# 选择: 2 (标准清理)
```

### 方案 C: 最小清理（14 个）⭐⭐⭐

**适合**: 想保留大部分功能

**保留**:
- 所有核心和可选 workflows

**删除**:
- performance.yml
- backup.yml

**优点**:
- 保留几乎所有功能
- 只删除明显不需要的

**执行**:
```bash
./scripts/cleanup-workflows.sh
# 选择: 1 (最小清理)
```

## 💡 我的建议

### 对于你的项目

**推荐方案 A: 最小化配置（6 个）**

**理由**:
1. ✅ 你是个人开发者，不需要复杂的 PR 管理
2. ✅ 核心 CI/CD 和发布功能已足够
3. ✅ 减少 Actions 运行次数
4. ✅ 降低维护复杂度
5. ✅ 节省 GitHub Actions 配额

**保留的 6 个 workflows 已经提供**:
- ✅ 代码质量检查（CI）
- ✅ 自动部署（Web）
- ✅ 自动发布（Desktop）
- ✅ 自动更新 CHANGELOG
- ✅ 自动生成 Release Notes
- ✅ 自动发布到 AUR

**这已经是非常完善的自动化了！**

## 🚀 快速执行

### 推荐操作

```bash
# 运行清理脚本
./scripts/cleanup-workflows.sh

# 选择: 1 (最小清理)
# 或
# 选择: 3 (最大清理，推荐)

# 脚本会自动提交和推送
```

### 手动操作

如果你想手动删除：

```bash
# 最小清理
rm .github/workflows/performance.yml
rm .github/workflows/backup.yml

# 提交
git add .github/workflows/
git commit -m "chore: remove unused workflows"
git push
```

## 📊 清理效果

### 最小清理（删除 2 个）

- **之前**: 16 个 workflows，~74 次运行/月
- **之后**: 14 个 workflows，~70 次运行/月
- **节省**: 5% 运行次数

### 标准清理（删除 6 个）

- **之前**: 16 个 workflows，~74 次运行/月
- **之后**: 10 个 workflows，~50 次运行/月
- **节省**: 32% 运行次数

### 最大清理（删除 10 个）

- **之前**: 16 个 workflows，~74 次运行/月
- **之后**: 6 个 workflows，~34 次运行/月
- **节省**: 54% 运行次数

## 🔍 保留的核心 Workflows

### 最小化配置后保留的 6 个

1. **ci.yml** ⭐⭐⭐⭐⭐
   - 代码检查、类型检查、构建测试
   - 确保代码质量

2. **deploy-web.yml** ⭐⭐⭐⭐⭐
   - 自动部署网站到 GitHub Pages
   - 每次 web 代码变更自动部署

3. **release-desktop.yml** ⭐⭐⭐⭐⭐
   - 构建多平台桌面应用
   - 创建 GitHub Release

4. **changelog.yml** ⭐⭐⭐⭐
   - 自动更新 CHANGELOG.md
   - 记录版本历史

5. **release-notes.yml** ⭐⭐⭐⭐
   - 自动生成详细的 Release Notes
   - 按类型分组提交

6. **aur-publish.yml** ⭐⭐⭐⭐
   - 自动发布到 AUR
   - Linux 用户可以通过 yay/paru 安装

**这 6 个已经提供了完整的 CI/CD 和发布自动化！**

## 💡 额外建议

### 如果需要 MSIX 构建

添加我刚创建的 workflow：

```bash
# 已创建但未添加到列表
.github/workflows/build-msix.yml
```

这个只在手动触发或推送 msix-v tag 时运行，不会增加日常负担。

### 如果需要代码签名

```bash
# 已创建但未添加到列表
.github/workflows/build-signed-exe.yml
```

只在需要时手动触发。

## 🎉 总结

### 当前问题
- ❌ Workflows 太多（16 个）
- ❌ 每次提交触发过多 Actions
- ❌ 维护复杂

### 解决方案
- ✅ 删除不需要的 workflows
- ✅ 保留核心功能
- ✅ 简化维护

### 推荐操作

```bash
# 1. 运行清理脚本
./scripts/cleanup-workflows.sh

# 2. 选择最大清理（推荐）
# 选择: 3

# 3. 确认并提交

# 4. 享受简洁的 workflows！
```

---

**下一步**: 运行清理脚本，选择适合你的清理级别！🚀
