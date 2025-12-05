# 📋 GitHub Workflows 总览

## 当前 Workflows 列表

你的项目目前有 **16 个 workflows**，分为以下几类：

### 🔵 核心 CI/CD（3 个）- 必需

| Workflow | 触发条件 | 用途 | 状态 |
|----------|----------|------|------|
| **ci.yml** | PR, push to develop | 代码检查、构建测试 | ✅ 保留 |
| **deploy-web.yml** | Push to main (apps/web) | 部署网站到 GitHub Pages | ✅ 保留 |
| **release-desktop.yml** | Tag: desktop-v*.*.* | 发布桌面应用 | ✅ 保留 |

### 🟢 发布管理（3 个）- 推荐保留

| Workflow | 触发条件 | 用途 | 状态 |
|----------|----------|------|------|
| **changelog.yml** | Release published | 自动更新 CHANGELOG | ✅ 保留 |
| **release-notes.yml** | Release created | 生成 Release Notes | ✅ 保留 |
| **aur-publish.yml** | Release published | 发布到 AUR | ✅ 保留 |

### 🟡 代码质量（4 个）- 可选

| Workflow | 触发条件 | 用途 | 状态 |
|----------|----------|------|------|
| **security.yml** | 每周一、依赖变更 | 安全扫描 | ⚠️ 可选 |
| **quality-gate.yml** | PR to main/develop | 代码质量检查 | ⚠️ 可选 |
| **bundle-size.yml** | PR (apps 变更) | Bundle 大小检查 | ⚠️ 可选 |
| **coverage.yml** | PR to main/develop | 代码覆盖率 | ⚠️ 可选 |

### 🟠 Issue/PR 管理（4 个）- 可选

| Workflow | 触发条件 | 用途 | 状态 |
|----------|----------|------|------|
| **issue-labeler.yml** | Issue opened/edited | 自动标记 Issues | ⚠️ 可选 |
| **pr-checks.yml** | PR opened/updated | PR 检查和统计 | ⚠️ 可选 |
| **stale.yml** | 每天定时 | 关闭过期 Issues/PRs | ⚠️ 可选 |
| **greetings.yml** | 首次 Issue/PR | 欢迎新贡献者 | ⚠️ 可选 |

### 🔴 其他（2 个）- 可删除

| Workflow | 触发条件 | 用途 | 状态 |
|----------|----------|------|------|
| **performance.yml** | PR to main, 每周一 | 性能测试 | ❌ 可删除 |
| **backup.yml** | 每周日 | 仓库备份 | ❌ 可删除 |

## 📊 统计

- **总计**: 16 个 workflows
- **必需**: 3 个（CI/CD）
- **推荐**: 3 个（发布管理）
- **可选**: 8 个（质量和管理）
- **可删除**: 2 个（性能和备份）

## 🎯 推荐配置

### 方案 A: 最小化配置（6 个）

**保留核心功能，删除可选功能**

保留：
- ✅ ci.yml
- ✅ deploy-web.yml
- ✅ release-desktop.yml
- ✅ changelog.yml
- ✅ release-notes.yml
- ✅ aur-publish.yml

删除：
- ❌ security.yml
- ❌ quality-gate.yml
- ❌ bundle-size.yml
- ❌ coverage.yml
- ❌ issue-labeler.yml
- ❌ pr-checks.yml
- ❌ stale.yml
- ❌ greetings.yml
- ❌ performance.yml
- ❌ backup.yml

**优点**:
- 减少 Actions 运行次数
- 降低复杂度
- 保留核心功能

**缺点**:
- 失去自动化质量检查
- 失去 Issue/PR 自动管理

### 方案 B: 标准配置（10 个）

**保留核心和质量检查**

保留：
- ✅ 核心 CI/CD（3 个）
- ✅ 发布管理（3 个）
- ✅ security.yml
- ✅ quality-gate.yml
- ✅ pr-checks.yml
- ✅ stale.yml

删除：
- ❌ bundle-size.yml
- ❌ coverage.yml
- ❌ issue-labeler.yml
- ❌ greetings.yml
- ❌ performance.yml
- ❌ backup.yml

**优点**:
- 保留重要的质量检查
- 保留 PR 管理
- 减少不必要的 workflows

**缺点**:
- 仍有一定复杂度

### 方案 C: 完整配置（16 个）

**保留所有 workflows**

**优点**:
- 完整的自动化
- 最大的代码质量保障

**缺点**:
- 复杂度高
- Actions 运行次数多
- 可能触发过多通知

## 💡 我的建议

### 对于你的项目（个人开发）

**推荐方案 A: 最小化配置（6 个）**

理由：
1. ✅ 你是唯一开发者，不需要复杂的 PR 管理
2. ✅ 保留核心 CI/CD 和发布功能
3. ✅ 减少不必要的 Actions 运行
4. ✅ 降低维护成本

### 如果有团队协作

**推荐方案 B: 标准配置（10 个）**

理由：
1. ✅ 保留代码质量检查
2. ✅ 保留 PR 管理功能
3. ✅ 适合小团队协作

## 🗑️ 删除不需要的 Workflows

### 立即删除（推荐）

```bash
# 删除性能测试（很少使用）
rm .github/workflows/performance.yml

# 删除备份（GitHub 已有备份）
rm .github/workflows/backup.yml

# 提交
git add .github/workflows/
git commit -m "chore: remove unused workflows"
git push
```

### 可选删除（如果采用最小化配置）

```bash
# 删除代码质量检查
rm .github/workflows/security.yml
rm .github/workflows/quality-gate.yml
rm .github/workflows/bundle-size.yml
rm .github/workflows/coverage.yml

# 删除 Issue/PR 管理
rm .github/workflows/issue-labeler.yml
rm .github/workflows/pr-checks.yml
rm .github/workflows/stale.yml
rm .github/workflows/greetings.yml

# 提交
git add .github/workflows/
git commit -m "chore: simplify workflows to minimal config"
git push
```

## 📝 Workflows 详细说明

### 核心 CI/CD

#### ci.yml
- **触发**: PR 到 main/develop，push 到 develop
- **作用**: Lint、类型检查、构建测试
- **重要性**: ⭐⭐⭐⭐⭐ 必需
- **运行频率**: 每次 PR 和 push

#### deploy-web.yml
- **触发**: Push 到 main（apps/web 变更）
- **作用**: 部署网站到 GitHub Pages
- **重要性**: ⭐⭐⭐⭐⭐ 必需
- **运行频率**: 每次 web 代码变更

#### release-desktop.yml
- **触发**: 推送 desktop-v*.*.* tag
- **作用**: 构建多平台桌面应用
- **重要性**: ⭐⭐⭐⭐⭐ 必需
- **运行频率**: 每次发布

### 发布管理

#### changelog.yml
- **触发**: Release published
- **作用**: 自动更新 CHANGELOG.md
- **重要性**: ⭐⭐⭐⭐ 推荐
- **运行频率**: 每次发布

#### release-notes.yml
- **触发**: Release created/edited
- **作用**: 生成详细的 Release Notes
- **重要性**: ⭐⭐⭐⭐ 推荐
- **运行频率**: 每次发布

#### aur-publish.yml
- **触发**: Release published
- **作用**: 自动发布到 AUR
- **重要性**: ⭐⭐⭐⭐ 推荐
- **运行频率**: 每次发布

### 代码质量

#### security.yml
- **触发**: 每周一、依赖文件变更
- **作用**: NPM 和 Cargo 安全扫描
- **重要性**: ⭐⭐⭐ 可选
- **运行频率**: 每周 + 依赖变更

#### quality-gate.yml
- **触发**: PR 到 main/develop
- **作用**: 检查 TODO、console、大文件
- **重要性**: ⭐⭐⭐ 可选
- **运行频率**: 每次 PR

#### bundle-size.yml
- **触发**: PR（apps 变更）
- **作用**: 分析 bundle 大小
- **重要性**: ⭐⭐ 可选
- **运行频率**: 每次 PR

#### coverage.yml
- **触发**: PR 到 main/develop
- **作用**: 代码覆盖率（待添加测试）
- **重要性**: ⭐ 可选
- **运行频率**: 每次 PR

### Issue/PR 管理

#### issue-labeler.yml
- **触发**: Issue opened/edited
- **作用**: 自动识别和标记 Issues
- **重要性**: ⭐⭐ 可选
- **运行频率**: 每次 Issue

#### pr-checks.yml
- **触发**: PR opened/updated
- **作用**: PR 标题检查、大小统计
- **重要性**: ⭐⭐⭐ 可选
- **运行频率**: 每次 PR

#### stale.yml
- **触发**: 每天定时
- **作用**: 关闭 30 天无活动的 Issues
- **重要性**: ⭐⭐ 可选
- **运行频率**: 每天

#### greetings.yml
- **触发**: 首次 Issue/PR
- **作用**: 欢迎新贡献者
- **重要性**: ⭐ 可选
- **运行频率**: 首次贡献

### 其他

#### performance.yml
- **触发**: PR 到 main、每周一
- **作用**: Lighthouse 性能测试
- **重要性**: ⭐ 很少使用
- **运行频率**: 每次 PR + 每周
- **建议**: ❌ 删除

#### backup.yml
- **触发**: 每周日
- **作用**: 创建仓库备份
- **重要性**: ⭐ GitHub 已有备份
- **运行频率**: 每周
- **建议**: ❌ 删除

## 🚀 快速清理

### 立即执行（推荐）

```bash
# 删除明显不需要的
rm .github/workflows/performance.yml
rm .github/workflows/backup.yml

git add .github/workflows/
git commit -m "chore: remove performance and backup workflows"
git push
```

### 结果

- 从 16 个减少到 14 个
- 减少每周 2 次不必要的运行
- 保留所有重要功能

## 📊 Actions 使用统计

### 当前配置（16 个）

估算每月运行次数：
- CI: ~20 次（每次 PR/push）
- Deploy: ~10 次（每次 web 变更）
- Release: ~2 次（每次发布）
- Quality: ~20 次（每次 PR）
- Issue/PR: ~10 次（每次 Issue/PR）
- 定时任务: ~12 次（每周/每天）

**总计**: ~74 次/月

### 最小化配置（6 个）

估算每月运行次数：
- CI: ~20 次
- Deploy: ~10 次
- Release: ~2 次
- 发布管理: ~2 次

**总计**: ~34 次/月

**节省**: 54% 的运行次数

## 💡 总结

### 推荐操作

1. **立即删除**（2 个）:
   - performance.yml
   - backup.yml

2. **考虑删除**（8 个，如果采用最小化）:
   - 代码质量检查（4 个）
   - Issue/PR 管理（4 个）

3. **必须保留**（6 个）:
   - 核心 CI/CD（3 个）
   - 发布管理（3 个）

### 下一步

```bash
# 查看当前 workflows
ls -la .github/workflows/

# 删除不需要的
rm .github/workflows/performance.yml
rm .github/workflows/backup.yml

# 提交
git add .github/workflows/
git commit -m "chore: clean up workflows"
git push
```

---

需要帮助决定删除哪些？告诉我你的需求！
