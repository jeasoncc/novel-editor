# 清空数据功能修复

## 问题描述
用户反馈：点击"清空所有数据"后，再次进入设置页面显示 "Hello '/settings'!" 而不是正常的设置界面。

## 问题分析
1. **缺少设置页面索引路由**：当用户访问 `/settings` 时，没有默认的子路由来显示内容
2. **关键设置被清空**：清空 localStorage 时，一些应用正常运行所需的基本设置也被删除

## 解决方案

### 1. 创建设置页面索引路由
- 文件：`apps/desktop/src/routes/settings/index.tsx`
- 功能：为 `/settings` 路径提供默认内容，显示设置概览页面

### 2. 改进清空数据逻辑
- 文件：`apps/desktop/src/services/clear-data.ts`
- 改进：
  - 添加 `initializeBasicSettings()` 函数
  - 在清空 localStorage 后重新初始化基本设置
  - 确保应用在数据清空后仍能正常运行

### 3. 初始化的基本设置
```javascript
{
  theme: 'system',           // 默认主题
  language: 'zh-CN',         // 默认语言
  'right-sidebar-open': 'false',  // 右侧边栏状态
  'unified-sidebar-state': {      // 统一侧边栏状态
    isOpen: true,
    activePanel: 'books'
  }
}
```

## 修复后的用户体验

### 访问 `/settings` 路径
- ✅ 显示设置概览页面
- ✅ 提供各设置分类的说明
- ✅ 引导用户选择具体设置项

### 清空所有数据后
- ✅ 应用保持正常运行
- ✅ 设置页面正常显示
- ✅ 基本功能可用
- ✅ 用户可以重新配置设置

## 测试步骤

1. **访问设置页面**
   - 点击活动栏的设置图标
   - 应该看到设置概览页面

2. **测试清空数据**
   - 导航到"数据管理"
   - 点击"清空所有数据"
   - 确认操作

3. **验证修复**
   - 页面刷新后应用正常运行
   - 再次访问设置页面应显示正常界面
   - 各项功能应该可用

## 文件变更
- ✅ `apps/desktop/src/routes/settings/index.tsx` - 新建
- ✅ `apps/desktop/src/services/clear-data.ts` - 修改
- ✅ `apps/desktop/src/routes/settings.tsx` - 已添加数据管理导航

## 状态
🟢 **已修复** - 清空数据后设置页面显示正常