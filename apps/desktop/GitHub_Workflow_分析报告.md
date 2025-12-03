# GitHub Workflow 触发分析报告

## 当前状态

每次提交到 `main` 分支时，会触发 **2 个 workflows**：

### 1. CI Workflow (`.github/workflows/ci.yml`)
**触发条件**：
```yaml
on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop
```

**包含的 Jobs**：
- `lint-and-type-check` - 代码检查和类型检查
- `build-web` - 构建 Web 应用
- `build-desktop` - 构建 Desktop 前端

**运行时间**：约 5-10 分钟

---

### 2. Deploy Website Workflow (`.github/workflows/deploy-web.yml`)
**触发条件**：
```yaml
on:
  workflow_dispatch: 
  push:
    branches:
      - main
    paths:
      - 'apps/web/**'
      - '.github/workflows/deploy-web.yml'
```

**包含的 Jobs**：
- `deploy` - 构建并部署到 GitHub Pages

**运行时间**：约 3-5 分钟

**注意**：这个 workflow 有 `paths` 过滤，只有修改了 `apps/web/**` 时才会真正执行部署。

---

### 3. Release Desktop Workflow (`.github/workflows/release-desktop.yml`)
**触发条件**：
```yaml
on:
  workflow_dispatch:
  push:
    branches:
      - release
    tags:
      - "v*.*.*"
      - "desktop-v*.*.*"
```

**包含的 Jobs**：
- `publish-tauri` - 构建并发布桌面应用（多平台）

**运行时间**：约 30-60 分钟（多平台并行）

**状态**：✅ 配置正确，只在打 tag 或 push 到 release 分支时触发

---

## 问题分析

### 为什么每次提交都触发两个 workflow？

1. **CI workflow** 在每次 push 到 `main` 时都会运行
2. **Deploy Website workflow** 在 push 到 `main` 且修改了 `apps/web/**` 时运行

### 这是否是问题？

**不一定是问题**，取决于你的需求：

#### 优点：
- ✅ 每次提交都会进行代码检查（CI）
- ✅ Web 应用的修改会自动部署
- ✅ 提供了持续集成和持续部署

#### 缺点：
- ❌ 消耗 GitHub Actions 分钟数
- ❌ 即使只修改了 desktop 代码，也会运行 CI
- ❌ 可能造成不必要的资源浪费

---

## 优化方案

### 方案 1：CI 只在 PR 时运行（推荐）

**适用场景**：你使用 PR 工作流，所有代码都通过 PR 合并到 main

```yaml
# .github/workflows/ci.yml
on:
  pull_request:
    branches:
      - main
      - develop
  push:
    branches:
      - develop  # 只在 develop 分支运行
  workflow_dispatch:  # 保留手动触发
```

**优点**：
- ✅ 减少 main 分支的 workflow 运行次数
- ✅ PR 时仍然会进行代码检查
- ✅ 节省 Actions 分钟数

---

### 方案 2：添加路径过滤

**适用场景**：你希望只在相关代码修改时运行 CI

```yaml
# .github/workflows/ci.yml
on:
  push:
    branches:
      - main
      - develop
    paths:
      - 'apps/**'
      - 'packages/**'
      - '.github/workflows/ci.yml'
  pull_request:
    branches:
      - main
      - develop
```

**优点**：
- ✅ 只在代码修改时运行
- ✅ 文档修改不会触发 CI

---

### 方案 3：合并 CI 和 Deploy

**适用场景**：你希望简化 workflow 结构

```yaml
# .github/workflows/ci-and-deploy.yml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  ci:
    # ... CI jobs
  
  deploy-web:
    needs: ci
    if: github.ref == 'refs/heads/main'
    # ... Deploy job
```

**优点**：
- ✅ 只有一个 workflow
- ✅ Deploy 依赖 CI 成功
- ✅ 更清晰的依赖关系

---

### 方案 4：保持现状，添加并发控制

**适用场景**：你希望保持现有结构，但避免重复运行

```yaml
# 在每个 workflow 中添加
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**优点**：
- ✅ 新的提交会取消旧的运行
- ✅ 节省资源
- ✅ 不改变触发逻辑

---

## 推荐配置

基于你的需求（只在打 tag 时发布），我推荐：

### 1. 修改 CI workflow
```yaml
on:
  pull_request:
    branches:
      - main
      - develop
  push:
    branches:
      - develop
  workflow_dispatch:
```

### 2. 保持 Deploy Website workflow 不变
```yaml
on:
  workflow_dispatch: 
  push:
    branches:
      - main
    paths:
      - 'apps/web/**'
      - '.github/workflows/deploy-web.yml'
```

### 3. 保持 Release Desktop workflow 不变
```yaml
on:
  workflow_dispatch:
  push:
    branches:
      - release
    tags:
      - "v*.*.*"
      - "desktop-v*.*.*"
```

---

## 实施步骤

1. **备份当前配置**
   ```bash
   cp .github/workflows/ci.yml .github/workflows/ci.yml.backup
   ```

2. **修改 CI workflow**
   - 移除 `main` 分支的 push 触发
   - 保留 PR 和 develop 分支触发

3. **测试**
   - 创建一个 PR 到 main，验证 CI 运行
   - 合并 PR 到 main，验证只有 Deploy Website 运行（如果修改了 web）
   - 创建 tag，验证 Release Desktop 运行

4. **监控**
   - 观察几次提交，确认行为符合预期

---

## 当前 Workflow 运行情况总结

| Workflow | 触发条件 | 运行频率 | 是否需要优化 |
|---------|---------|---------|------------|
| CI | Push to main/develop | 每次提交 | ⚠️ 建议优化 |
| Deploy Website | Push to main (web 修改) | 按需 | ✅ 配置合理 |
| Release Desktop | Tag 或 release 分支 | 按需 | ✅ 配置正确 |

---

## 费用估算

假设每月 100 次提交到 main：

**当前配置**：
- CI: 100 次 × 10 分钟 = 1000 分钟
- Deploy: 30 次 × 5 分钟 = 150 分钟
- **总计**: 1150 分钟/月

**优化后**（CI 只在 PR）：
- CI: 50 次 × 10 分钟 = 500 分钟
- Deploy: 30 次 × 5 分钟 = 150 分钟
- **总计**: 650 分钟/月

**节省**: 约 43% 的 Actions 分钟数

---

## 结论

你的 Release Desktop workflow 配置是正确的，只在打 tag 时触发。

每次提交触发两个 workflow 是因为：
1. CI workflow 配置为在 push 到 main 时运行
2. Deploy Website workflow 配置为在 push 到 main 时运行（有路径过滤）

建议采用**方案 1**，将 CI 改为只在 PR 和 develop 分支运行，这样可以：
- ✅ 保持代码质量检查
- ✅ 减少不必要的 workflow 运行
- ✅ 节省 GitHub Actions 分钟数
- ✅ 符合你的工作流程（只在 tag 时发布）
