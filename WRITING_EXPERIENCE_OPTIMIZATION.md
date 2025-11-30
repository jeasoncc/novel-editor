# 写作体验优化方案

## 📊 当前状态分析

### ✅ 已有功能
- 专注模式（全屏）
- 打字机模式（当前行居中）
- 写作目标追踪
- 会话统计
- Markdown 快捷键
- 浮动工具栏

### ❌ 可能的问题点
1. **编辑器响应速度** - 大文档可能卡顿
2. **视觉干扰** - 工具栏、侧边栏可能分散注意力
3. **输入流畅度** - 缺少智能辅助功能
4. **沉浸感不足** - 缺少环境音、背景等
5. **快捷键不够** - 常用操作需要鼠标
6. **自动保存提示** - 可能打断思路
7. **字数统计位置** - 可能过于显眼

---

## 🎯 优化方案（按优先级）

### 🔴 高优先级（立即改善）

#### 1. 编辑器性能优化
**问题**: 大文档（>5000字）可能卡顿
**方案**:
- 虚拟滚动
- 延迟渲染
- 节流保存

#### 2. 减少视觉干扰
**问题**: 工具栏、统计信息分散注意力
**方案**:
- 自动隐藏工具栏（鼠标移开后）
- 半透明统计信息
- 可关闭的字数统计

#### 3. 智能输入辅助
**问题**: 缺少智能提示
**方案**:
- 自动标点配对（""、《》）
- 智能空格（中英文之间）
- 段落自动缩进

#### 4. 更好的专注模式
**问题**: 专注模式还不够沉浸
**方案**:
- 渐变背景
- 可调节编辑区宽度
- 行间距调节
- 背景音乐/白噪音

#### 5. 快捷键增强
**问题**: 常用操作需要鼠标
**方案**:
- Ctrl+S 保存
- Ctrl+B 粗体
- Ctrl+I 斜体
- Ctrl+Shift+F 专注模式
- Ctrl+/ 快捷键帮助

---

### 🟡 中优先级（提升体验）

#### 6. 写作节奏提示
**方案**:
- 写作速度曲线
- 休息提醒（番茄钟）
- 写作热力图

#### 7. 智能保存
**方案**:
- 静默自动保存
- 版本快照
- 冲突检测

#### 8. 编辑器主题
**方案**:
- 纸张纹理背景
- 打字机音效
- 护眼模式（暖色调）

#### 9. 写作辅助
**方案**:
- 词频统计
- 重复词提示
- 句子长度分析

---

### 🟢 低优先级（锦上添花）

#### 10. 环境氛围
**方案**:
- 背景音乐播放器
- 白噪音（雨声、咖啡厅）
- 动态背景

#### 11. 写作激励
**方案**:
- 成就系统
- 连续写作天数
- 里程碑庆祝

#### 12. 协作功能
**方案**:
- 评论批注
- 版本对比
- 多人协作

---

## 🚀 立即可实施的优化

### 1. 自动隐藏工具栏

```typescript
// src/components/blocks/focus-mode.tsx
const [toolbarVisible, setToolbarVisible] = useState(true);
const timeoutRef = useRef<number>();

const handleMouseMove = () => {
  setToolbarVisible(true);
  clearTimeout(timeoutRef.current);
  timeoutRef.current = window.setTimeout(() => {
    setToolbarVisible(false);
  }, 3000);
};

<div 
  onMouseMove={handleMouseMove}
  className={cn(
    "focus-mode-toolbar transition-opacity duration-300",
    !toolbarVisible && "opacity-0"
  )}
>
```

### 2. 智能标点配对

```typescript
// 在编辑器中添加
const handleBeforeInput = (e: InputEvent) => {
  if (e.data === '"') {
    e.preventDefault();
    insertText('""');
    moveCursor(-1);
  }
  if (e.data === '《') {
    e.preventDefault();
    insertText('《》');
    moveCursor(-1);
  }
};
```

### 3. 可调节编辑区宽度

```typescript
// 添加到专注模式设置
const [editorWidth, setEditorWidth] = useState(700);

<div style={{ maxWidth: `${editorWidth}px` }}>
  {children}
</div>

// 设置面板
<Slider
  value={[editorWidth]}
  onValueChange={([value]) => setEditorWidth(value)}
  min={500}
  max={1000}
  step={50}
/>
```

### 4. 护眼模式

```typescript
// 添加到主题
const eyeCareTheme = {
  background: "#FBF8F3", // 暖色纸张
  foreground: "#3E3E3E", // 柔和黑色
  // ...
};
```

### 5. 番茄钟提醒

```typescript
// 添加到 writing store
pomodoroEnabled: boolean;
pomodoroInterval: number; // 25分钟
lastBreakTime: number;

// 定时检查
useEffect(() => {
  const interval = setInterval(() => {
    if (shouldTakeBreak()) {
      showBreakNotification();
    }
  }, 60000); // 每分钟检查
}, []);
```

---

## 📝 具体实现代码

### 优化 1: 自动隐藏工具栏

```typescript
// src/components/blocks/focus-mode-enhanced.tsx
import { useState, useRef, useEffect } from "react";

export function FocusModeEnhanced() {
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const [statsVisible, setStatsVisible] = useState(true);
  const hideTimeoutRef = useRef<number>();

  const showToolbar = () => {
    setToolbarVisible(true);
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = window.setTimeout(() => {
      setToolbarVisible(false);
    }, 3000);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 鼠标在顶部 100px 时显示工具栏
      if (e.clientY < 100) {
        showToolbar();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="focus-mode-enhanced">
      {/* 工具栏 */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "transition-all duration-300 ease-in-out",
          toolbarVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        {/* 工具栏内容 */}
      </div>

      {/* 统计信息 */}
      <div
        className={cn(
          "fixed bottom-4 right-4",
          "transition-opacity duration-300",
          statsVisible ? "opacity-100" : "opacity-20 hover:opacity-100"
        )}
      >
        {/* 统计内容 */}
      </div>
    </div>
  );
}
```

### 优化 2: 智能标点配对

```typescript
// src/components/editor/plugins/smart-punctuation-plugin.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_LOW } from "lexical";

const PAIR_MAP: Record<string, string> = {
  '"': '""',
  "'": "''",
  "（": "（）",
  "《": "《》",
  "【": "【】",
  """: """",
  "'": "''",
};

export function SmartPunctuationPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event: KeyboardEvent) => {
        const char = event.key;
        if (PAIR_MAP[char]) {
          event.preventDefault();
          
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertText(PAIR_MAP[char]);
              // 移动光标到中间
              selection.modify("move", "backward", "character");
            }
          });
          
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}
```

### 优化 3: 编辑器宽度调节

```typescript
// 添加到 writing store
interface WritingState {
  // ... 现有字段
  editorWidth: number;
  setEditorWidth: (width: number) => void;
  lineHeight: number;
  setLineHeight: (height: number) => void;
}

// 在专注模式中使用
const { editorWidth, lineHeight } = useWritingStore();

<div
  style={{
    maxWidth: `${editorWidth}px`,
    lineHeight: lineHeight,
  }}
  className="mx-auto"
>
  {children}
</div>
```

### 优化 4: 番茄钟功能

```typescript
// src/components/blocks/pomodoro-timer.tsx
import { useState, useEffect } from "react";
import { Timer, Coffee } from "lucide-react";
import { toast } from "sonner";

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25分钟
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // 时间到
          if (isBreak) {
            toast.success("休息结束，继续写作！");
            setIsBreak(false);
            return 25 * 60;
          } else {
            toast.info("写作时间到，休息一下吧！", {
              action: {
                label: "开始休息",
                onClick: () => {
                  setIsBreak(true);
                  setTimeLeft(5 * 60); // 5分钟休息
                },
              },
            });
            setIsRunning(false);
            return 25 * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isBreak]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isBreak ? (
        <Coffee className="size-4 text-orange-500" />
      ) : (
        <Timer className="size-4" />
      )}
      <span className="text-sm tabular-nums">{formatTime(timeLeft)}</span>
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        {isRunning ? "暂停" : "开始"}
      </button>
    </div>
  );
}
```

---

## 🎨 视觉优化建议

### 1. 纸张纹理背景

```css
.novel-editor-content {
  background-image: url('/textures/paper.png');
  background-size: 200px 200px;
  background-repeat: repeat;
}
```

### 2. 打字机音效

```typescript
// 添加音效
const typeSound = new Audio('/sounds/typewriter.mp3');
typeSound.volume = 0.1;

editor.registerCommand(
  KEY_DOWN_COMMAND,
  () => {
    if (soundEnabled) {
      typeSound.currentTime = 0;
      typeSound.play();
    }
    return false;
  },
  COMMAND_PRIORITY_LOW
);
```

### 3. 渐变背景

```css
.focus-mode-container {
  background: linear-gradient(
    135deg,
    hsl(var(--background)) 0%,
    color-mix(in srgb, hsl(var(--background)) 95%, hsl(var(--primary))) 100%
  );
}
```

---

## 📊 性能优化

### 1. 虚拟滚动（大文档）

```typescript
// 使用 react-window 或 react-virtualized
import { FixedSizeList } from "react-window";

<FixedSizeList
  height={600}
  itemCount={paragraphs.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>{paragraphs[index]}</div>
  )}
</FixedSizeList>
```

### 2. 节流保存

```typescript
import { debounce } from "lodash";

const debouncedSave = debounce((content) => {
  saveToDatabase(content);
}, 2000); // 2秒后保存

onChange={(editorState) => {
  debouncedSave(editorState.toJSON());
}}
```

---

## 🎯 推荐实施顺序

### 第一周
1. ✅ 自动隐藏工具栏
2. ✅ 智能标点配对
3. ✅ 编辑器宽度调节
4. ✅ 快捷键增强

### 第二周
5. ✅ 番茄钟功能
6. ✅ 护眼模式
7. ✅ 节流保存
8. ✅ 统计信息优化

### 第三周
9. ✅ 纸张纹理
10. ✅ 打字机音效
11. ✅ 写作热力图
12. ✅ 词频统计

---

## 💡 用户反馈收集

建议添加反馈入口：

```typescript
// 在专注模式中添加
<Button
  variant="ghost"
  size="sm"
  onClick={() => {
    // 打开反馈表单
  }}
>
  <MessageSquare className="size-4 mr-2" />
  反馈建议
</Button>
```

---

## 📚 参考资源

- [Notion 编辑器](https://notion.so) - 流畅的输入体验
- [Typora](https://typora.io) - 极简的 Markdown 编辑器
- [iA Writer](https://ia.net/writer) - 专注模式设计
- [Scrivener](https://www.literatureandlatte.com/scrivener) - 长文写作工具

---

**下一步**: 选择你最需要的功能，我可以帮你立即实现！

