# ActivityBar 图标主题更新完成

## ✅ 更新内容

成功完成两项重要更新：

### 1. 预览窗口添加 ActivityBar

在图标设置页面的预览窗口中添加了 ActivityBar（左侧竖条），更真实地模拟应用界面。

**预览窗口布局**：
```
┌────────────────────────────────────┐
│ 🔴 🟡 🟢  图标预览 - 默认图标      │
├────┬────────┬──────────────────────┤
│ AB │ 文件树 │ ActivityBar 图标预览 │
│ AR │        │                      │
│    │ 📖项目 │ [书库] [搜索] [大纲] │
│ 📚 │ 📁章节 │ [角色] [世界观][绘图]│
│ 🔍 │ 📄场景 │ [统计] [设置] [新建] │
│ 📋 │ 👤角色 │                      │
│ 👥 │ 🌍世界 │                      │
│ ─  │        │                      │
│ ➕ │        │                      │
│ 📥 │        │                      │
│    │        │                      │
│ ⚙️ │        │                      │
└────┴────────┴──────────────────────┘
```

**ActivityBar 特点**：
- 宽度 48px（12 * 4px）
- 显示 8 个主要图标
- 当前选中项高亮（书库）
- 左侧蓝色指示条
- 分隔线分组
- 设置图标在底部

### 2. 实际 ActivityBar 组件使用图标主题

更新了 `apps/desktop/src/components/activity-bar.tsx`，使其使用图标主题系统。

**更新内容**：

#### 导入图标主题
```typescript
import { getActivityBarIcon, getCurrentIconTheme } from "@/lib/icon-themes";
```

#### 监听主题变化
```typescript
const [iconTheme, setIconTheme] = useState(getCurrentIconTheme());

useEffect(() => {
  const handler = () => {
    setIconTheme(getCurrentIconTheme());
  };
  window.addEventListener("icon-theme-changed", handler);
  return () => window.removeEventListener("icon-theme-changed", handler);
}, []);
```

#### 获取图标
```typescript
const LibraryIcon = iconTheme.icons.activityBar.library;
const SearchIcon = iconTheme.icons.activityBar.search;
const OutlineIcon = iconTheme.icons.activityBar.outline;
// ... 等等
```

#### 使用图标
```typescript
<NavItem
  to="/"
  icon={<LibraryIcon className="size-5" />}
  label="书库"
  active={isActive("/")}
/>
```

## 🎯 更新的图标

### 主导航
- ✅ 书库 (library)
- ✅ 搜索 (search)
- ✅ 大纲 (outline)
- ✅ 角色 (characters)
- ✅ 世界观 (world)
- ✅ 绘图 (canvas)

### 操作按钮
- ✅ 新建 (create)
- ✅ 导入 (import)
- ✅ 导出 (export)
- ✅ 统计 (statistics)

### 底部抽屉
- ✅ 大纲面板 (outline)
- ✅ 角色面板 (characters)
- ✅ 世界观面板 (world)

### 底部
- ✅ 更多 (more)
- ✅ 设置 (settings)

## 🌟 效果

现在当你切换图标主题时：

1. **预览窗口**：
   - 左侧 ActivityBar 立即更新
   - 文件树图标立即更新
   - 右侧图标网格立即更新

2. **实际 ActivityBar**：
   - 所有图标立即更新
   - 保持当前选中状态
   - 保持所有交互功能

## 📊 对比

### 之前
```typescript
// 硬编码图标
import { BookMarked, Search, ListTree, ... } from "lucide-react";

<NavItem
  icon={<BookMarked className="size-5" />}
  label="书库"
/>
```

### 现在
```typescript
// 使用图标主题
import { getCurrentIconTheme } from "@/lib/icon-themes";

const LibraryIcon = iconTheme.icons.activityBar.library;

<NavItem
  icon={<LibraryIcon className="size-5" />}
  label="书库"
/>
```

## 🎨 预览窗口组件

### ActivityBarIcon 组件
```typescript
function ActivityBarIcon({
  icon: Icon,
  isActive = false,
}: {
  icon: any;
  isActive?: boolean;
}) {
  return (
    <div className={cn(
      "relative flex size-10 items-center justify-center rounded-lg",
      isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
    )}>
      {isActive && (
        <div className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-primary" />
      )}
      <Icon className="size-5" />
    </div>
  );
}
```

**特点**：
- 支持选中状态
- 左侧指示条
- 悬停效果
- 使用当前颜色主题

## 🚀 使用方法

### 切换图标主题

1. 进入 **设置 → 图标**
2. 点击任意图标主题
3. 观察预览窗口和实际 ActivityBar 的变化

### 支持的主题

所有 6 种图标主题都完全支持：
- 默认图标
- 极简图标
- 经典图标
- 现代图标
- 优雅图标
- 作家图标

## 💡 技术细节

### 实时更新机制

```typescript
// 1. 用户点击主题
handleIconThemeChange(themeKey)
  ↓
// 2. 保存到 localStorage
applyIconTheme(themeKey)
  ↓
// 3. 触发事件
window.dispatchEvent(new Event("icon-theme-changed"))
  ↓
// 4. 所有组件监听并更新
useEffect(() => {
  const handler = () => setIconTheme(getCurrentIconTheme());
  window.addEventListener("icon-theme-changed", handler);
  return () => window.removeEventListener("icon-theme-changed", handler);
}, [])
```

### 性能优化

- ✅ 使用 `useState` 缓存图标主题
- ✅ 使用 `useEffect` 监听变化
- ✅ 组件卸载时清理事件监听
- ✅ 避免不必要的重渲染

## 🎉 完成状态

- ✅ 预览窗口添加 ActivityBar
- ✅ ActivityBar 组件使用图标主题
- ✅ 实时响应主题变化
- ✅ 所有图标类型支持
- ✅ 无语法错误
- ✅ 性能优化

## 📝 文件清单

### 更新的文件
1. `apps/desktop/src/routes/settings/icons.tsx` - 添加 ActivityBar 预览
2. `apps/desktop/src/components/activity-bar.tsx` - 使用图标主题

### 新增组件
- `ActivityBarIcon` - ActivityBar 图标组件（预览用）

## 🎯 测试建议

1. **切换主题**：在图标设置中切换不同主题
2. **查看预览**：观察预览窗口的 ActivityBar
3. **查看实际**：观察左侧实际的 ActivityBar
4. **验证图标**：确认所有图标都正确更新

现在刷新页面，进入 **设置 → 图标**，你会看到：
- 预览窗口中有完整的 ActivityBar
- 切换主题时，所有图标实时更新
- 实际的 ActivityBar 也会同步更新

🎉 图标主题系统现在完全集成到应用中了！
