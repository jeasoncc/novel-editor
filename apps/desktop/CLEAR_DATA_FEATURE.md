# 清空数据功能实现

## 概述

为了方便测试和开发，我在设置页面的"数据管理"部分添加了完整的清空数据功能。用户现在可以选择性地或完全地清空应用中的各种数据存储。

## 功能特性

### 🗂️ **支持的存储类型**

1. **IndexedDB** - 应用的主要数据库
   - 项目、章节、场景数据
   - 角色、世界观设定
   - 附件和其他结构化数据

2. **localStorage** - 持久化设置
   - 应用偏好设置
   - 用户配置
   - 主题、字体等个性化设置

3. **sessionStorage** - 会话数据
   - 临时状态
   - 会话级别的缓存

4. **Cookies** - 浏览器cookies
   - 认证信息
   - 跟踪数据

5. **Cache API** - 应用缓存
   - 静态资源缓存
   - 离线数据

### 🎛️ **清空选项**

#### 1. 清空所有数据
- 删除所有类型的存储数据
- 完全重置应用状态
- 适合完全重新开始

#### 2. 仅清空数据库
- 只清空 IndexedDB 中的项目数据
- 保留应用设置和偏好
- 适合重置项目内容但保留个人配置

#### 3. 仅清空设置
- 只清空 localStorage、sessionStorage、cookies
- 保留项目数据
- 适合重置应用配置但保留工作内容

### 📊 **存储统计显示**

在数据管理页面现在显示：

**数据库内容统计**
- 项目数量
- 章节数量  
- 场景数量
- 总字数

**存储使用情况**
- IndexedDB 记录数
- localStorage 键数量
- sessionStorage 键数量
- Cookies 数量

## 技术实现

### 核心服务 (`services/clear-data.ts`)

```typescript
export class ClearDataService {
  // 清空 IndexedDB
  static async clearIndexedDB(): Promise<void>
  
  // 清空 localStorage
  static clearLocalStorage(): void
  
  // 清空 sessionStorage  
  static clearSessionStorage(): void
  
  // 清空 cookies
  static clearCookies(): void
  
  // 清空所有缓存
  static async clearCaches(): Promise<void>
  
  // 清空所有数据（可配置选项）
  static async clearAllData(options?: ClearDataOptions): Promise<void>
  
  // 获取存储统计
  static async getStorageStats(): Promise<StorageStats>
}
```

### 安全特性

1. **确认对话框** - 所有清空操作都需要用户确认
2. **详细说明** - 清楚说明每个操作会删除什么数据
3. **错误处理** - 完善的错误捕获和用户反馈
4. **备份提醒** - 建议用户在清空前导出备份

### UI 集成

- 集成到现有的 `/settings/data` 页面
- 与备份管理功能并列显示
- 统一的设计风格和交互模式
- 实时的存储统计更新

## 使用方法

### 1. 通过设置页面
1. 打开应用设置 (Ctrl+,)
2. 导航到"数据管理"页面
3. 在"危险操作"部分选择清空选项
4. 确认操作

### 2. 通过测试页面
访问 `/test-clear-data` 路由进行功能测试

### 3. 通过代码调用
```typescript
import { ClearDataService } from '@/services/clear-data';

// 清空所有数据
await ClearDataService.clearAllData();

// 只清空数据库
await ClearDataService.clearAllData({
  clearIndexedDB: true,
  clearLocalStorage: false,
  clearSessionStorage: false,
  clearCookies: false,
});

// 获取存储统计
const stats = await ClearDataService.getStorageStats();
```

## 测试建议

1. **创建测试数据** - 先创建一些项目、章节、场景
2. **检查统计** - 查看存储统计是否正确显示
3. **测试选择性清空** - 分别测试不同的清空选项
4. **验证效果** - 确认数据确实被清空
5. **测试恢复** - 使用备份功能恢复数据

## 注意事项

⚠️ **重要警告**
- 清空操作不可撤销
- 建议在清空前导出备份
- 清空所有数据会重置整个应用状态
- 某些系统设置可能需要重新配置

## 文件清单

### 新增文件
- `apps/desktop/src/services/clear-data.ts` - 核心清空数据服务
- `apps/desktop/src/routes/test-clear-data.tsx` - 测试页面
- `apps/desktop/CLEAR_DATA_FEATURE.md` - 功能文档

### 修改文件
- `apps/desktop/src/components/blocks/backup-manager.tsx` - 集成清空功能到数据管理页面

## 未来改进

1. **选择性清空** - 允许用户选择特定的项目或数据类型进行清空
2. **清空预览** - 在执行前显示将要删除的数据预览
3. **自动备份** - 在清空前自动创建备份
4. **恢复功能** - 提供撤销最近清空操作的功能
5. **批量操作** - 支持批量清空多个项目或章节