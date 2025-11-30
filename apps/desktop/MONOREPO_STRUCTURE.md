# Monorepo 完整结构

## 📁 目录结构

```
novel-editor-monorepo/
├── apps/
│   ├── desktop/                    # Tauri 桌面应用
│   │   ├── src/
│   │   ├── src-tauri/
│   │   ├── package.json
│   │   └── ...
│   │
│   ├── web/                        # 官网
│   │   ├── app/
│   │   │   ├── page.tsx           # 首页
│   │   │   ├── features/          # 功能介绍
│   │   │   ├── download/          # 下载页面
│   │   │   ├── docs/              # 文档
│   │   │   └── blog/              # 博客
│   │   ├── components/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.js
│   │
│   └── api/                        # 后端 API
│       ├── src/
│       │   ├── routes/
│       │   │   ├── analytics.ts   # 统计 API
│       │   │   ├── download.ts    # 下载统计
│       │   │   └── feedback.ts    # 用户反馈
│       │   ├── db/
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── ui/                         # 共享 UI 组件
│   │   ├── src/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── editor/                     # 编辑器核心
│   │   ├── src/
│   │   │   ├── lexical/
│   │   │   ├── plugins/
│   │   │   └── themes/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── db/                         # 数据库逻辑
│   │   ├── src/
│   │   │   ├── schema.ts
│   │   │   ├── crud.ts
│   │   │   └── migrations/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared/                     # 共享工具
│   │   ├── src/
│   │   │   ├── utils.ts
│   │   │   ├── constants.ts
│   │   │   └── types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/                     # 共享配置
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── turbo.json                      # Turborepo 配置
├── package.json                    # 根 package.json
├── pnpm-workspace.yaml             # pnpm workspace 配置
└── README.md
```

---

## 📝 核心配置文件

### 1. 根 package.json

```json
{
  "name": "novel-editor-monorepo",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "turbo run format",
    "clean": "turbo run clean",
    "desktop:dev": "turbo run dev --filter=desktop",
    "web:dev": "turbo run dev --filter=web",
    "api:dev": "turbo run dev --filter=api"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "@biomejs/biome": "^2.3.2",
    "typescript": "^5.8.3"
  },
  "packageManager": "pnpm@9.0.0",
  "engines": {
    "node": ">=20"
  }
}
```

### 2. turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "target/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "format": {},
    "clean": {
      "cache": false
    }
  }
}
```

### 3. pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 🌐 官网技术栈

### 推荐：Next.js 14 + Tailwind CSS

**优点**：
- SEO 友好
- 性能优秀
- 部署简单（Vercel 免费）
- 与桌面应用共享组件

### 官网页面结构

```
web/app/
├── page.tsx                 # 首页
├── features/
│   └── page.tsx            # 功能介绍
├── download/
│   └── page.tsx            # 下载页面
├── docs/
│   ├── page.tsx            # 文档首页
│   ├── getting-started/
│   ├── features/
│   └── api/
├── blog/
│   ├── page.tsx            # 博客列表
│   └── [slug]/
│       └── page.tsx        # 博客文章
├── pricing/
│   └── page.tsx            # 定价（如果有付费版）
└── about/
    └── page.tsx            # 关于我们
```

---

## 🎨 官网设计要点

### 首页必备元素
1. **Hero Section** - 大标题 + 演示 GIF
2. **功能亮点** - 3-6 个核心功能
3. **截图展示** - 实际界面截图
4. **下载按钮** - 醒目的 CTA
5. **社会证明** - GitHub Stars、用户数
6. **特性对比** - vs 竞品

### 视觉风格
- 与桌面应用一致的设计语言
- 使用相同的主题色
- 现代、简洁、专业
- 响应式设计

---

## 🚀 实施计划

### 阶段 1: 创建 Monorepo（1-2 小时）
1. 创建 Turborepo 结构
2. 移动现有项目到 apps/desktop
3. 配置 turbo.json
4. 测试构建

### 阶段 2: 提取共享包（2-3 小时）
1. 提取 UI 组件到 packages/ui
2. 提取编辑器到 packages/editor
3. 提取数据库到 packages/db
4. 更新导入路径

### 阶段 3: 创建官网（3-4 小时）
1. 初始化 Next.js 项目
2. 创建页面结构
3. 设计首页
4. 添加功能介绍

### 阶段 4: 创建 API（1-2 小时）
1. 初始化 Express/Fastify 项目
2. 实现统计 API
3. 实现下载统计
4. 部署到服务器

---

## 📊 预计时间

- **Monorepo 迁移**: 1-2 小时
- **官网开发**: 3-4 小时
- **API 开发**: 1-2 小时
- **测试部署**: 1 小时
- **总计**: 6-9 小时

---

## 🎯 下一步

我现在可以帮你：

1. **创建 Turborepo 结构**
2. **生成官网骨架**
3. **实现统计 API**

你准备好了吗？我们从哪个开始？

