# 编辑器用户体验改进设计文档

## 概述

本设计文档详细描述了桌面小说编辑器的用户体验改进方案。这些改进包括添加手动保存快捷键、优化侧边栏布局、重新组织功能按钮以及修复场景创建功能的bug。改进基于React + TypeScript + Tauri技术栈，使用Zustand进行状态管理，Radix UI提供组件基础。

## 架构

### 技术栈
- **前端框架**: React 19 + TypeScript
- **路由**: TanStack Router
- **状态管理**: Zustand
- **UI组件**: Radix UI + Tailwind CSS + Shadcn UI
- **数据库**: Dexie (IndexedDB)
- **桌面框架**: Tauri 2.0

### 核心架构模式
- **组件化架构**: 使用React组件进行UI模块化
- **状态管理**: 使用Zustand store进行全局状态管理
- **事件驱动**: 使用自定义事件和键盘事件处理用户交互
- **服务层**: 使用服务函数封装业务逻辑和数据操作

## 组件和接口

### 1. 手动保存功能

#### 组件结构
```typescript
// 保存服务接口
interface SaveService {
  saveDocument(documentId: string): Promise<SaveResult>;
  hasUnsavedChanges(documentId: string): boolean;
}

// 保存结果类型
interface SaveResult {
  success: boolean;
  error?: string;
  timestamp: Date;
}

// 键盘快捷键处理器
interface KeyboardShortcutHandler {
  registerShortcut(key: string, handler: () => void): void;
  unregisterShortcut(key: string): void;
}
```

#### 实现组件
- **SaveIndicator**: 显示保存状态的UI组件
- **KeyboardShortcutManager**: 管理全局键盘快捷键
- **SaveService**: 处理文档保存逻辑

### 2. 侧边栏合并功能

#### 状态管理接口
```typescript
interface UnifiedSidebarState {
  activePanel: 'search' | 'books' | null;
  searchState: SearchPanelState;
  booksState: BooksPanelState;
  isOpen: boolean;
}

interface SearchPanelState {
  query: string;
  results: SearchResult[];
  filters: SearchFilters;
}

interface BooksPanelState {
  selectedProject: string | null;
  expandedChapters: Record<string, boolean>;
  selectedChapter: string | null;
  selectedScene: string | null;
}
```

#### 实现组件
- **UnifiedSidebar**: 统一的侧边栏容器组件
- **SearchPanel**: 搜索功能面板
- **BooksPanel**: 书籍管理面板
- **PanelSwitcher**: 面板切换控制器

### 3. 活动栏重组功能

#### 菜单结构接口
```typescript
interface ActivityBarConfig {
  primaryActions: ActivityBarAction[];
  moreMenuActions: ActivityBarAction[];
}

interface ActivityBarAction {
  id: string;
  icon: React.ComponentType;
  label: string;
  onClick: () => void;
  tooltip: string;
}

interface MoreMenuState {
  isOpen: boolean;
  actions: MenuAction[];
}
```

#### 实现组件
- **ActivityBar**: 重新设计的活动栏组件
- **MoreMenu**: 更多功能下拉菜单
- **ActionButton**: 统一的操作按钮组件

### 4. 场景创建bug修复

#### 场景管理接口
```typescript
interface SceneCreationState {
  isCreating: boolean;
  lastCreatedSceneId: string | null;
  creationCount: number;
}

interface SceneCreationService {
  createScene(chapterId: string, sceneData: SceneData): Promise<Scene>;
  resetCreationState(): void;
  canCreateScene(chapterId: string): boolean;
}
```

#### 实现组件
- **SceneCreator**: 场景创建组件
- **SceneList**: 场景列表显示组件
- **ChapterManager**: 章节管理组件

## 数据模型

### 保存状态模型
```typescript
interface SaveState {
  documentId: string;
  hasUnsavedChanges: boolean;
  lastSaveTime: Date | null;
  isSaving: boolean;
  autoSaveEnabled: boolean;
}
```

### 侧边栏状态模型
```typescript
interface SidebarState {
  unified: {
    activePanel: 'search' | 'books' | null;
    isOpen: boolean;
    width: number;
  };
  search: {
    query: string;
    results: SearchResult[];
    isLoading: boolean;
  };
  books: {
    selectedProjectId: string | null;
    expandedChapters: Set<string>;
    viewMode: 'tree' | 'list';
  };
}
```

### 场景创建状态模型
```typescript
interface SceneCreationState {
  chapterId: string;
  isCreating: boolean;
  createdScenes: string[];
  lastOperation: 'create' | 'rename' | 'delete' | null;
  operationTimestamp: Date | null;
}
```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上是关于系统应该做什么的正式声明。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 手动保存功能属性

**属性 1: 快捷键触发保存**
*对于任何*编辑器状态，当按下Ctrl+S快捷键时，保存操作应该被触发
**验证: 需求 1.1**

**属性 2: 保存成功反馈**
*对于任何*成功的保存操作，系统应该显示成功反馈并更新保存状态
**验证: 需求 1.2**

**属性 3: 保存失败处理**
*对于任何*失败的保存操作，系统应该显示错误信息并保持编辑状态不变
**验证: 需求 1.3**

**属性 4: 无更改时保存忽略**
*对于任何*没有未保存更改的文档，保存操作应该被安全忽略而不产生错误
**验证: 需求 1.4**

**属性 5: 自动保存兼容性**
*对于任何*手动保存操作，自动保存功能应该继续正常工作不受影响
**验证: 需求 1.5**

### 侧边栏合并功能属性

**属性 6: 搜索面板切换**
*对于任何*统一侧边栏状态，点击搜索按钮应该显示搜索面板内容
**验证: 需求 2.1**

**属性 7: 书籍面板切换**
*对于任何*统一侧边栏状态，点击书籍按钮应该显示书籍管理面板内容
**验证: 需求 2.2**

**属性 8: 面板状态持久性**
*对于任何*面板切换操作，当前面板的状态和数据应该被保持
**验证: 需求 2.3**

**属性 9: 编辑区域空间优化**
*对于任何*侧边栏合并后的布局，主编辑区域应该获得更多可用空间
**验证: 需求 2.4**

**属性 10: 活跃面板视觉指示**
*对于任何*面板切换操作，当前活跃的面板应该有清晰的视觉指示
**验证: 需求 2.5**

### 活动栏重组功能属性

**属性 11: 功能可访问性保持**
*对于任何*重新组织后的活动栏，所有原有功能应该保持可访问
**验证: 需求 3.4**

**属性 12: 更多菜单显示**
*对于任何*更多按钮点击操作，应该显示包含导入和导出选项的下拉菜单
**验证: 需求 3.5**

### 场景创建bug修复属性

**属性 13: 连续场景创建**
*对于任何*章节，在创建第一个场景后，场景创建功能应该保持可用状态
**验证: 需求 4.1**

**属性 14: 多场景创建成功**
*对于任何*章节，应该能够成功创建多个场景而不出现错误
**验证: 需求 4.2**

**属性 15: 场景创建UI更新**
*对于任何*场景创建操作，界面应该正确显示新创建的场景
**验证: 需求 4.3**

**属性 16: 场景列表状态维护**
*对于任何*包含多个场景的章节，场景列表的状态应该被正确维护
**验证: 需求 4.4**

**属性 17: 创建状态重置正确性**
*对于任何*场景创建功能重置操作，所有相关UI组件状态应该正确更新
**验证: 需求 4.5**

## 错误处理

### 保存操作错误处理
- **网络错误**: 当保存到远程服务失败时，显示重试选项
- **存储空间不足**: 当本地存储空间不足时，提示用户清理空间
- **权限错误**: 当文件权限不足时，提供权限修复指导
- **数据损坏**: 当检测到数据损坏时，尝试恢复或提供备份选项

### 侧边栏操作错误处理
- **状态同步失败**: 当面板状态同步失败时，重置到默认状态
- **搜索服务错误**: 当搜索服务不可用时，显示离线模式
- **数据加载失败**: 当书籍数据加载失败时，提供重新加载选项

### 场景创建错误处理
- **数据库操作失败**: 当场景创建的数据库操作失败时，回滚状态并显示错误
- **状态不一致**: 当检测到UI状态与数据状态不一致时，强制刷新
- **并发操作冲突**: 当多个创建操作冲突时，使用乐观锁机制处理

## 测试策略

### 单元测试方法

**组件测试**:
- 使用React Testing Library测试组件渲染和交互
- 模拟用户操作验证组件行为
- 测试组件的边界条件和错误状态

**服务测试**:
- 测试保存服务的各种场景
- 验证场景创建服务的状态管理
- 测试错误处理逻辑

**状态管理测试**:
- 测试Zustand store的状态变更
- 验证状态持久化和恢复
- 测试并发状态更新

### 属性基础测试方法

**测试库**: 使用fast-check进行JavaScript/TypeScript属性基础测试
**测试配置**: 每个属性测试运行最少100次迭代以确保充分的随机性覆盖
**测试标记**: 每个属性基础测试必须使用注释明确引用设计文档中的正确性属性

**快捷键属性测试**:
- 生成随机的编辑器状态和键盘事件
- 验证Ctrl+S快捷键在所有状态下都能正确触发保存

**侧边栏切换属性测试**:
- 生成随机的侧边栏状态和用户交互
- 验证面板切换的一致性和状态保持

**场景创建属性测试**:
- 生成随机的章节结构和创建操作序列
- 验证连续场景创建的正确性和状态一致性

**UI状态属性测试**:
- 生成随机的UI操作序列
- 验证UI状态与数据状态的一致性

### 集成测试

**端到端工作流测试**:
- 测试完整的用户工作流程
- 验证各功能模块之间的协作
- 测试数据持久化和恢复

**性能测试**:
- 测试大量数据下的性能表现
- 验证内存使用和渲染性能
- 测试响应时间和用户体验

**兼容性测试**:
- 测试不同操作系统下的行为
- 验证键盘快捷键的跨平台兼容性
- 测试不同屏幕尺寸下的UI适配