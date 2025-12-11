# Requirements Document

## Introduction

本文档定义了 Novel Editor 桌面应用的 UI 精简和改进需求。主要目标是：
1. 合并冗余的侧边栏（绘图和wiki的文件管理合并到统一侧边栏）
2. 移除底部抽屉模块及其相关按钮
3. 改进导出功能，支持自定义导出路径

## Glossary

- **Activity Bar**: 应用左侧的垂直导航栏，包含主要功能入口按钮
- **Unified Sidebar**: 统一侧边栏，目前包含书库管理和搜索功能
- **Bottom Drawer**: 底部抽屉，从屏幕底部滑出的面板，包含角色、世界观、统计等功能
- **Drawing List**: 绘图列表，管理绘图文件的组件
- **Export Path**: 导出路径，用户指定的文件导出目标目录
- **Tauri**: 桌面应用框架，提供原生系统功能访问

## Requirements

### Requirement 1: 合并侧边栏

**User Story:** 作为用户，我希望绘图和wiki的文件管理能够集成到统一侧边栏中，这样我就不需要在点击不同功能时看到多个独立的侧边栏。

#### Acceptance Criteria

1. WHEN 用户点击 Activity Bar 中的绘图按钮 THEN Unified Sidebar SHALL 显示绘图文件列表面板
2. WHEN 用户点击 Activity Bar 中的 wiki/世界观按钮 THEN Unified Sidebar SHALL 显示 wiki 文件列表面板
3. WHEN Unified Sidebar 显示绘图面板时 THEN 绘图页面 SHALL 不再显示独立的右侧边栏
4. WHEN 用户在 Unified Sidebar 中选择一个绘图文件 THEN 系统 SHALL 在主内容区域打开该绘图进行编辑
5. WHEN 用户切换 Unified Sidebar 面板类型 THEN 系统 SHALL 保持当前编辑内容不变

### Requirement 2: 移除底部抽屉模块

**User Story:** 作为用户，我希望移除底部抽屉模块，因为我暂时不需要这个功能，它占用了界面空间。

#### Acceptance Criteria

1. WHEN 应用启动 THEN 系统 SHALL 不渲染底部抽屉组件
2. WHEN 用户查看 Activity Bar THEN 系统 SHALL 不显示底部抽屉相关的切换按钮（大纲面板、角色面板按钮）
3. WHEN 底部抽屉相关代码被移除 THEN 系统 SHALL 保持其他功能正常运行
4. WHEN 用户使用应用 THEN 系统 SHALL 不存在任何底部抽屉相关的 UI 元素

### Requirement 3: 整理 Activity Bar 图标

**User Story:** 作为用户，我希望 Activity Bar 更加整洁，移除不必要的按钮后布局更加合理。

#### Acceptance Criteria

1. WHEN 底部抽屉按钮被移除 THEN Activity Bar SHALL 重新组织剩余按钮的布局
2. WHEN 用户查看 Activity Bar THEN 系统 SHALL 显示清晰的功能分组（主导航、操作按钮、设置）
3. WHEN Activity Bar 布局调整后 THEN 系统 SHALL 保持按钮间距和视觉一致性

### Requirement 4: 导出路径选择功能

**User Story:** 作为用户，我希望在导出文件时能够选择保存路径，而不是只能导出到下载目录。

#### Acceptance Criteria

1. WHEN 用户在 Tauri 打包的应用中点击导出 THEN 系统 SHALL 显示系统原生的目录选择对话框
2. WHEN 用户选择导出目录 THEN 系统 SHALL 将文件保存到用户指定的路径
3. WHEN 用户取消目录选择 THEN 系统 SHALL 取消导出操作并保持当前状态
4. WHEN 导出操作完成 THEN 系统 SHALL 显示成功提示并包含导出路径信息

### Requirement 5: 导出路径设置

**User Story:** 作为用户，我希望能够在设置中配置默认的导出路径，这样每次导出时可以使用预设的目录。

#### Acceptance Criteria

1. WHEN 用户访问设置页面 THEN 系统 SHALL 显示导出设置模块
2. WHEN 用户在导出设置中点击选择路径按钮 THEN 系统 SHALL 显示目录选择对话框
3. WHEN 用户选择默认导出路径 THEN 系统 SHALL 持久化保存该路径配置
4. WHEN 用户进行导出操作且已配置默认路径 THEN 系统 SHALL 使用默认路径作为初始目录
5. WHEN 用户清除默认导出路径设置 THEN 系统 SHALL 恢复使用系统下载目录作为默认值
