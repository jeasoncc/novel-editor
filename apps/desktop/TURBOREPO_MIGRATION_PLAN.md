# Turborepo 迁移计划

## 🎯 目标结构

```
novel-editor-monorepo/
├── apps/
│   ├── desktop/          # 当前的 Tauri 应用
│   ├── web/              # 官网
│   └── api/              # 后端 API（统计、同步等）
├── packages/
│   ├── ui/               # 共享 UI 组件
│   ├── editor/           # 编辑器核心
│   ├── db/               # 数据库逻辑
│   └── shared/           # 共享工具函数
├── turbo.json
├── package.json
└── README.md
```

---

## 📦 迁移步骤

### 步骤 1: 创建 Turborepo 根目录

```bash
# 在当前项目的上一级目录
cd ..
mkdir novel-editor-monorepo
cd novel-editor-monorepo

# 初始化 Turborepo
npx create-turbo@latest
```

### 步骤 2: 移动现有项目

```bash
# 创建 apps 目录
mkdir -p apps

# 移动当前项目到 apps/desktop
mv ../novel-editor apps/desktop

# 清理不需要的文件
cd apps/desktop
rm -rf node_modules dist .turbo
```

### 步骤 3: 创建共享包

```bash
# 回到根目录
cd ../..

# 创建 packages 目录
mkdir -p packages/{ui,editor,db,shared}
```

---

## 📋 详细配置

见下一个文件...

