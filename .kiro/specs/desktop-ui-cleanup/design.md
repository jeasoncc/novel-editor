# Design Document: Desktop UI Cleanup

## Overview

本设计文档描述了 Novel Editor 桌面应用的 UI 精简和改进方案。主要包括三个方面的改进：

1. **侧边栏合并** - 将绘图和wiki的文件管理集成到统一侧边栏（Unified Sidebar）
2. **底部抽屉移除** - 完全移除底部滑出面板及其相关组件和状态
3. **导出路径功能** - 利用 Tauri API 实现目录选择和路径配置

## Architecture

### 当前架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Root Layout                          │
├──────┬──────────────┬───────────────────────┬──────────────┤
│      │              │                       │              │
│  A   │   Unified    │     Main Content      │   Canvas     │
│  c   │   Sidebar    │       Area            │   Right      │
│  t   │  (books,     │                       │   Sidebar    │
│  i   │   search)    │                       │  (drawings)  │
│  v   │              │                       │              │
│  i   │              │                       │              │
│  t   │              │                       │              │
│  y   │              │                       │              │
│      │              │                       │              │
│  B   │              │                       │              │
│  a   │              │                       │              │
│  r   │              │                       │              │
│      ├──────────────┴───────────────────────┴──────────────┤
│      │              Bottom Drawer                          │
└──────┴─────────────────────────────────────────────────────┘
```

### 目标架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Root Layout                          │
├──────┬──────────────┬──────────────────────────────────────┤
│      │              │                                      │
│  A   │   Unified    │         Main Content                 │
│  c   │   Sidebar    │           Area                       │
│  t   │  (books,     │                                      │
│  i   │   search,    │                                      │
│  v   │   drawings,  │                                      │
│  i   │   wiki)      │                                      │
│  t   │              │                                      │
│  y   │              │                                      │
│      │              │                                      │
│  B   │              │                                      │
│  a   │              │                                      │
│  r   │              │                                      │
│      │              │                                      │
└──────┴──────────────┴──────────────────────────────────────┘
```

## Components and Interfaces

### 1. Unified Sidebar Store 扩展

扩展 `unified-sidebar.ts` store 以支持新的面板类型：

```typescript
// 扩展面板类型
export type UnifiedSidebarPanel = "search" | "books" | "drawings" | "wiki" | null;

// 新增绘图面板状态
interface DrawingsPanelState {
  selectedDrawingId: string | null;
}

// 新增wiki面板状态  
interface WikiPanelState {
  selectedEntryId: string | null;
}
```

### 2. 新增面板组件

#### DrawingsPanel

```typescript
// apps/desktop/src/components/panels/drawings-panel.tsx
interface DrawingsPanelProps {
  projectId: string | null;
  onSelectDrawing: (drawing: DrawingInterface) => void;
  selectedDrawingId: string | null;
}
```

#### WikiPanel

```typescript
// apps/desktop/src/components/panels/wiki-panel.tsx
interface WikiPanelProps {
  projectId: string | null;
  onSelectEntry: (entry: WorldEntryInterface) => void;
  selectedEntryId: string | null;
}
```

### 3. Activity Bar 简化

移除以下按钮：
- 底部抽屉切换按钮（大纲面板、角色面板）

修改以下按钮行为：
- 绘图按钮：切换 Unified Sidebar 到 drawings 面板
- 世界观按钮：切换 Unified Sidebar 到 wiki 面板

### 4. 导出路径服务

```typescript
// apps/desktop/src/services/export-path.ts
interface ExportPathService {
  // 选择导出目录
  selectExportDirectory(): Promise<string | null>;
  
  // 保存文件到指定路径
  saveToPath(path: string, filename: string, content: Blob): Promise<void>;
  
  // 获取默认导出路径
  getDefaultExportPath(): string | null;
  
  // 设置默认导出路径
  setDefaultExportPath(path: string | null): void;
  
  // 检查是否在Tauri环境
  isTauriEnvironment(): boolean;
}
```

### 5. Tauri 命令扩展

```rust
// apps/desktop/src-tauri/src/lib.rs

#[tauri::command]
async fn select_directory() -> Result<Option<String>, String>;

#[tauri::command]
async fn save_file(path: String, filename: String, content: Vec<u8>) -> Result<(), String>;

#[tauri::command]
fn get_downloads_dir() -> Result<String, String>;
```

## Data Models

### 导出设置存储

```typescript
// 存储在 localStorage 中
interface ExportSettings {
  defaultExportPath: string | null;
  lastUsedPath: string | null;
}

// localStorage key: "novel-editor-export-settings"
```

### UI Store 清理

移除以下状态：
```typescript
// 从 ui.ts 中移除
export type BottomDrawerView = "outline" | "characters" | "statistics" | "world" | null;

interface UIState {
  // 移除以下字段
  bottomDrawerOpen: boolean;
  bottomDrawerView: BottomDrawerView;
  bottomDrawerHeight: number;
  setBottomDrawerOpen: (open: boolean) => void;
  setBottomDrawerView: (view: BottomDrawerView) => void;
  setBottomDrawerHeight: (height: number) => void;
  toggleBottomDrawer: (view?: BottomDrawerView) => void;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: 绘图面板切换一致性
*For any* Activity Bar 状态，当用户点击绘图按钮时，Unified Sidebar 的 activePanel 状态应该变为 "drawings"，且 isOpen 应该为 true
**Validates: Requirements 1.1**

### Property 2: Wiki面板切换一致性
*For any* Activity Bar 状态，当用户点击世界观按钮时，Unified Sidebar 的 activePanel 状态应该变为 "wiki"，且 isOpen 应该为 true
**Validates: Requirements 1.2**

### Property 3: 绘图选择状态同步
*For any* 绘图文件，当在 Unified Sidebar 中选择该绘图时，selectedDrawingId 状态应该更新为该绘图的 ID
**Validates: Requirements 1.4**

### Property 4: 面板切换不影响编辑内容
*For any* 编辑器状态和面板切换操作，切换 Unified Sidebar 面板类型后，当前编辑的内容状态应该保持不变
**Validates: Requirements 1.5**

### Property 5: 底部抽屉状态清理
*For any* 应用状态，UI Store 中不应存在任何底部抽屉相关的状态字段
**Validates: Requirements 2.3**

### Property 6: 目录选择取消处理
*For any* 导出操作，当用户取消目录选择对话框时，导出操作应该被取消，且应用状态保持不变
**Validates: Requirements 4.3**

### Property 7: 导出路径持久化
*For any* 有效的目录路径，当用户设置默认导出路径后，该路径应该被持久化保存，重新加载应用后仍然可用
**Validates: Requirements 5.3**

### Property 8: 默认路径应用
*For any* 已配置默认导出路径的状态，当用户进行导出操作时，目录选择对话框应该以默认路径作为初始目录
**Validates: Requirements 5.4**

### Property 9: 默认路径清除恢复
*For any* 导出设置状态，当用户清除默认导出路径后，系统应该恢复使用系统下载目录作为默认值
**Validates: Requirements 5.5**

## Error Handling

### 目录选择错误

1. **用户取消选择**: 返回 null，不显示错误
2. **权限不足**: 显示错误提示，建议选择其他目录
3. **路径不存在**: 尝试创建目录，失败则显示错误

### 文件保存错误

1. **磁盘空间不足**: 显示错误提示，包含所需空间信息
2. **写入权限不足**: 显示错误提示，建议选择其他目录
3. **文件名冲突**: 自动添加数字后缀或提示用户

### Tauri 环境检测

```typescript
// 在非 Tauri 环境（如浏览器开发模式）中降级处理
if (!isTauriEnvironment()) {
  // 使用浏览器下载 API
  triggerBlobDownload(filename, blob);
  return;
}
```

## Testing Strategy

### 单元测试

1. **Store 测试**
   - 测试 Unified Sidebar Store 的面板切换逻辑
   - 测试导出设置的持久化和读取

2. **组件测试**
   - 测试 DrawingsPanel 的渲染和交互
   - 测试 WikiPanel 的渲染和交互
   - 测试 Activity Bar 按钮的点击行为

### 属性测试

使用 fast-check 进行属性测试：

1. **面板切换属性测试**: 验证任意面板切换序列后状态一致性
2. **导出路径属性测试**: 验证路径设置和清除的正确性
3. **状态持久化属性测试**: 验证设置保存和恢复的正确性

### 集成测试

1. **Tauri 命令测试**: 测试 Rust 命令的正确执行
2. **端到端导出测试**: 测试完整的导出流程

## Migration Notes

### 需要删除的文件

- `apps/desktop/src/components/bottom-drawer.tsx`
- `apps/desktop/src/components/bottom-drawer-content.tsx`

### 需要修改的文件

1. `apps/desktop/src/routes/__root.tsx` - 移除底部抽屉组件引用
2. `apps/desktop/src/components/activity-bar.tsx` - 移除底部抽屉按钮，修改绘图/wiki按钮行为
3. `apps/desktop/src/stores/ui.ts` - 移除底部抽屉相关状态
4. `apps/desktop/src/stores/unified-sidebar.ts` - 添加新面板类型
5. `apps/desktop/src/components/unified-sidebar.tsx` - 添加新面板渲染
6. `apps/desktop/src/routes/canvas.tsx` - 移除右侧边栏，使用 Unified Sidebar
7. `apps/desktop/src/services/export.ts` - 添加路径选择支持
8. `apps/desktop/src-tauri/src/lib.rs` - 添加目录选择命令
9. `apps/desktop/src-tauri/Cargo.toml` - 添加 dialog 插件依赖

### 需要新增的文件

- `apps/desktop/src/components/panels/drawings-panel.tsx`
- `apps/desktop/src/components/panels/wiki-panel.tsx`
- `apps/desktop/src/services/export-path.ts`
- `apps/desktop/src/routes/settings/export.tsx`
