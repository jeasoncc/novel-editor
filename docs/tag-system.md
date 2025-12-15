# Tag 系统设计文档

## 概述

Tag 系统为小说编辑器提供标签管理功能，支持：
- 在编辑器中通过 `#[标签名]` 内联插入标签
- 标签管理面板（创建、编辑、删除）
- 标签关系图谱可视化
- 按类别分组（角色、地点、物品、事件、主题、自定义）

## 数据模型

### 1. tags 表 - 标签定义

```typescript
interface TagInterface {
  id: UUID;
  workspace: UUID;        // 所属工作区
  name: string;           // 标签名
  color: string;          // 颜色 (#RRGGBB)
  category: TagCategory;  // 类别
  icon?: string;          // 图标名
  description?: string;   // 描述
  metadata?: string;      // JSON 扩展字段
  createDate: ISODateString;
  lastEdit: ISODateString;
}

type TagCategory = "character" | "location" | "item" | "event" | "theme" | "custom";
```

### 2. nodeTags 表 - 节点与标签关联

```typescript
interface NodeTagInterface {
  id: UUID;
  nodeId: UUID;           // 关联的节点
  tagId: UUID;            // 关联的标签
  mentions: number;       // 出现次数
  positions?: string;     // JSON: 位置数组 [{start, end}]
  createDate: ISODateString;
}
```

### 3. tagRelations 表 - 标签间关系

```typescript
interface TagRelationInterface {
  id: UUID;
  workspace: UUID;
  sourceTagId: UUID;      // 源标签
  targetTagId: UUID;      // 目标标签
  relationType: RelationType;
  weight: number;         // 关系强度 0-100
  description?: string;
  createDate: ISODateString;
}

type RelationType = "related" | "parent" | "child" | "conflict" | "alias" | "belongs" | "owns" | "knows" | "custom";
```

## 数据库索引

```typescript
tags: "id, workspace, name, category"
nodeTags: "id, nodeId, tagId, [nodeId+tagId]"
tagRelations: "id, workspace, sourceTagId, targetTagId, [sourceTagId+targetTagId]"
```

## 文件结构

```
apps/desktop/src/
├── db/
│   ├── database.ts                    # 数据库定义 (v8)
│   └── models/
│       └── tag/
│           ├── index.ts               # 统一导出
│           ├── tag.interface.ts       # Tag 接口
│           ├── node-tag.interface.ts  # NodeTag 接口
│           ├── tag-relation.interface.ts # TagRelation 接口
│           ├── tag.schema.ts          # Zod 验证
│           ├── tag.builder.ts         # Builder 类
│           ├── tag.repository.ts      # CRUD 操作
│           └── tag.hooks.ts           # React hooks
├── services/
│   └── tags.ts                        # 标签服务层
├── components/
│   ├── editor/
│   │   ├── nodes/
│   │   │   └── tag-node.tsx           # Lexical TagNode
│   │   └── plugins/
│   │       └── tag-picker-plugin.tsx  # 标签选择器插件
│   └── panels/
│       ├── tags-panel.tsx             # 标签管理面板
│       ├── node-tags-panel.tsx        # 当前节点标签
│       ├── tag-graph-panel.tsx        # 标签图谱
│       ├── create-tag-dialog.tsx      # 创建标签对话框
│       └── edit-tag-dialog.tsx        # 编辑标签对话框
```

## 使用方式

### 1. 在编辑器中插入标签

输入 `#[` 触发标签选择器：
- 搜索现有标签
- 选择或创建新标签
- 标签显示为彩色 badge

### 2. 标签管理

通过 `TagsPanel` 组件：
- 查看所有标签（按类别分组）
- 创建新标签
- 编辑标签属性
- 删除标签

### 3. 标签图谱

通过 `TagGraphPanel` 组件：
- 可视化标签关系
- 力导向布局
- 支持拖拽、缩放

### 4. API 使用

```typescript
import {
  // Hooks
  useTagsByWorkspace,
  useNodeTags,
  useTagGraph,
  
  // Services
  createTag,
  updateTag,
  deleteTag,
  addTagToNode,
  removeTagFromNode,
  createTagRelation,
} from "@/services/tags";

// 创建标签
const tag = await createTag({
  workspace: workspaceId,
  name: "张三",
  category: "character",
  color: "#FF6B6B",
});

// 添加标签到节点
await addTagToNode(nodeId, tag.id);

// 获取标签图谱数据
const graphData = await fetchTagGraph(workspaceId);
```

## 默认颜色

| 类别 | 颜色 | 说明 |
|------|------|------|
| character | #FF6B6B | 红色 - 角色 |
| location | #4ECDC4 | 青色 - 地点 |
| item | #FFE66D | 黄色 - 物品 |
| event | #95E1D3 | 绿色 - 事件 |
| theme | #DDA0DD | 紫色 - 主题 |
| custom | #A8A8A8 | 灰色 - 自定义 |

## 性能优化

1. **独立表设计**：标签数据与内容分离，图谱加载不需要读取内容
2. **复合索引**：`[nodeId+tagId]` 加速关联查询
3. **懒加载**：标签详情按需加载
4. **缓存**：使用 `useLiveQuery` 自动缓存和更新
