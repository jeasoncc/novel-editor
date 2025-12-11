# Implementation Plan

## Phase 1: 移除底部抽屉模块

- [x] 1. 清理底部抽屉相关代码
  - [x] 1.1 从 UI Store 中移除底部抽屉状态
    - 移除 `bottomDrawerOpen`, `bottomDrawerView`, `bottomDrawerHeight` 状态
    - 移除 `setBottomDrawerOpen`, `setBottomDrawerView`, `setBottomDrawerHeight`, `toggleBottomDrawer` 方法
    - 移除 `BottomDrawerView` 类型定义
    - _Requirements: 2.3_
  - [x] 1.2 从根布局中移除底部抽屉组件
    - 从 `__root.tsx` 中移除 `BottomDrawer` 和 `BottomDrawerContent` 组件引用
    - 移除相关 import 语句
    - _Requirements: 2.1_
  - [x] 1.3 从 Activity Bar 中移除底部抽屉按钮
    - 移除 `DrawerToggle` 组件
    - 移除底部抽屉相关的按钮（大纲面板、角色面板按钮）
    - 移除 `bottomDrawerOpen`, `bottomDrawerView`, `toggleBottomDrawer` 的使用
    - _Requirements: 2.2, 3.1_
  - [x] 1.4 删除底部抽屉组件文件
    - 删除 `apps/desktop/src/components/bottom-drawer.tsx`
    - 删除 `apps/desktop/src/components/bottom-drawer-content.tsx`
    - _Requirements: 2.4_

- [ ] 2. Checkpoint - 确保底部抽屉移除后应用正常运行
  - Ensure all tests pass, ask the user if questions arise.

## Phase 2: 扩展 Unified Sidebar

- [-] 3. 扩展 Unified Sidebar Store
  - [x] 3.1 添加新的面板类型
    - 扩展 `UnifiedSidebarPanel` 类型，添加 "drawings" 和 "wiki"
    - 添加 `DrawingsPanelState` 接口
    - 添加 `WikiPanelState` 接口
    - _Requirements: 1.1, 1.2_
  - [ ]* 3.2 编写属性测试：面板切换一致性
    - **Property 1: 绘图面板切换一致性**
    - **Property 2: Wiki面板切换一致性**
    - **Validates: Requirements 1.1, 1.2**

- [ ] 4. 创建绘图面板组件
  - [x] 4.1 创建 DrawingsPanel 组件
    - 基于现有 `DrawingList` 组件重构
    - 适配 Unified Sidebar 的样式和布局
    - 实现绘图选择回调
    - _Requirements: 1.1, 1.4_
  - [ ]* 4.2 编写属性测试：绘图选择状态同步
    - **Property 3: 绘图选择状态同步**
    - **Validates: Requirements 1.4**

- [ ] 5. 创建 Wiki 面板组件
  - [x] 5.1 创建 WikiPanel 组件
    - 创建世界观条目列表组件
    - 实现搜索和筛选功能
    - 实现条目选择回调
    - _Requirements: 1.2_

- [x] 6. 更新 Unified Sidebar 组件
  - [x] 6.1 添加新面板渲染逻辑
    - 在 `unified-sidebar.tsx` 中添加 DrawingsPanel 和 WikiPanel 的条件渲染
    - _Requirements: 1.1, 1.2_
  - [ ]* 6.2 编写属性测试：面板切换不影响编辑内容
    - **Property 4: 面板切换不影响编辑内容**
    - **Validates: Requirements 1.5**

- [ ] 7. Checkpoint - 确保侧边栏扩展正常工作
  - Ensure all tests pass, ask the user if questions arise.

## Phase 3: 修改 Activity Bar 和路由

- [x] 8. 修改 Activity Bar 按钮行为
  - [x] 8.1 修改绘图按钮行为
    - 点击绘图按钮时切换 Unified Sidebar 到 drawings 面板
    - 移除导航到 /canvas 路由的行为
    - _Requirements: 1.1_
  - [x] 8.2 修改世界观按钮行为
    - 点击世界观按钮时切换 Unified Sidebar 到 wiki 面板
    - 移除导航到 /world 路由的行为
    - _Requirements: 1.2_
  - [x] 8.3 整理 Activity Bar 布局
    - 重新组织按钮分组
    - 调整间距和分隔线
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 9. 修改绘图页面
  - [x] 9.1 移除 Canvas 页面的右侧边栏
    - 从 `canvas.tsx` 中移除独立的右侧边栏
    - 使用 Unified Sidebar 中的 DrawingsPanel
    - _Requirements: 1.3_

- [ ] 10. Checkpoint - 确保 Activity Bar 和路由修改正常
  - Ensure all tests pass, ask the user if questions arise.

## Phase 4: 导出路径功能

- [x] 11. 添加 Tauri 插件和命令
  - [x] 11.1 更新 Cargo.toml 添加依赖
    - 添加 `tauri-plugin-dialog` 依赖
    - 添加 `tauri-plugin-fs` 依赖
    - _Requirements: 4.1_
  - [x] 11.2 实现 Rust 命令
    - 实现 `select_directory` 命令
    - 实现 `save_file` 命令
    - 实现 `get_downloads_dir` 命令
    - 注册插件和命令
    - _Requirements: 4.1, 4.2_

- [x] 12. 创建导出路径服务
  - [x] 12.1 创建 export-path.ts 服务
    - 实现 `selectExportDirectory` 方法
    - 实现 `saveToPath` 方法
    - 实现 `isTauriEnvironment` 检测
    - 实现浏览器环境降级处理
    - _Requirements: 4.1, 4.2, 4.3_
  - [ ]* 12.2 编写属性测试：目录选择取消处理
    - **Property 6: 目录选择取消处理**
    - **Validates: Requirements 4.3**

- [x] 13. 修改导出对话框
  - [x] 13.1 集成目录选择功能
    - 在 Tauri 环境中显示目录选择对话框
    - 使用选择的路径保存文件
    - 显示包含路径信息的成功提示
    - _Requirements: 4.1, 4.2, 4.4_

- [ ] 14. Checkpoint - 确保导出路径选择功能正常
  - Ensure all tests pass, ask the user if questions arise.

## Phase 5: 导出路径设置

- [x] 15. 创建导出设置存储
  - [x] 15.1 实现导出设置持久化
    - 创建 `ExportSettings` 接口
    - 实现 localStorage 存储和读取
    - 实现默认路径的 getter 和 setter
    - _Requirements: 5.3_
  - [ ]* 15.2 编写属性测试：导出路径持久化
    - **Property 7: 导出路径持久化**
    - **Validates: Requirements 5.3**
  - [ ]* 15.3 编写属性测试：默认路径应用
    - **Property 8: 默认路径应用**
    - **Validates: Requirements 5.4**
  - [ ]* 15.4 编写属性测试：默认路径清除恢复
    - **Property 9: 默认路径清除恢复**
    - **Validates: Requirements 5.5**

- [x] 16. 创建导出设置页面
  - [x] 16.1 创建 settings/export.tsx 页面
    - 显示当前默认导出路径
    - 实现选择路径按钮
    - 实现清除路径按钮
    - _Requirements: 5.1, 5.2, 5.5_
  - [x] 16.2 添加设置导航项
    - 在 settings.tsx 中添加导出设置的导航链接
    - _Requirements: 5.1_

- [x] 17. 集成默认路径到导出流程
  - [x] 17.1 修改导出服务使用默认路径
    - 导出时使用默认路径作为初始目录
    - 保存最后使用的路径
    - _Requirements: 5.4_

- [ ] 18. Final Checkpoint - 确保所有功能正常
  - Ensure all tests pass, ask the user if questions arise.
