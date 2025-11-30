# 用户统计实现方案

## 🎯 目标

- 了解用户数量和活跃度
- 收集使用数据以改进产品
- **保护用户隐私**
- **符合开源精神**
- **可选择退出**

---

## ⚠️ 重要原则

### 必须遵守
1. **透明** - 明确告知用户收集什么数据
2. **可选** - 用户可以选择退出
3. **匿名** - 不收集个人身份信息
4. **最小化** - 只收集必要数据
5. **安全** - 数据传输加密
6. **合规** - 符合 GDPR/CCPA

### 不要做
- ❌ 收集用户内容（文章、笔记）
- ❌ 收集个人信息（姓名、邮箱）
- ❌ 追踪用户行为细节
- ❌ 强制收集数据
- ❌ 出售用户数据

---

## 📊 推荐方案

### 方案 1: 自建简单统计（推荐）

**优点**：
- 完全控制数据
- 成本低（几乎免费）
- 隐私友好
- 符合开源精神

**缺点**：
- 需要自己维护服务器
- 功能相对简单

#### 实现步骤

##### 1. 后端 API（简单版）

使用免费的 Cloudflare Workers 或 Vercel Serverless：

```javascript
// api/analytics.js (Vercel Serverless)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { event, data } = req.body;
  
  // 验证数据
  if (!event || !data) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  // 存储到数据库（如 Supabase、MongoDB Atlas 免费版）
  // 或者简单地存储到 KV 存储
  await storeEvent(event, data);

  return res.status(200).json({ success: true });
}

async function storeEvent(event, data) {
  // 存储逻辑
  // 可以使用 Supabase、MongoDB Atlas、或 Cloudflare KV
}
```

##### 2. 前端实现

```typescript
// src/services/analytics.ts
import { v4 as uuidv4 } from 'uuid';

interface AnalyticsEvent {
  event: string;
  data: Record<string, any>;
}

class Analytics {
  private enabled: boolean = true;
  private userId: string;
  private apiUrl: string = 'https://your-api.vercel.app/api/analytics';

  constructor() {
    // 从 localStorage 读取设置
    this.enabled = localStorage.getItem('analytics-enabled') !== 'false';
    
    // 生成匿名用户 ID（不是真实身份）
    let userId = localStorage.getItem('analytics-user-id');
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('analytics-user-id', userId);
    }
    this.userId = userId;
  }

  // 启用/禁用统计
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('analytics-enabled', enabled.toString());
  }

  // 发送事件
  async track(event: string, data: Record<string, any> = {}) {
    if (!this.enabled) return;

    try {
      const payload = {
        event,
        data: {
          ...data,
          userId: this.userId,
          version: '0.1.0',
          platform: navigator.platform,
          timestamp: new Date().toISOString(),
        },
      };

      // 使用 fetch 发送（不阻塞 UI）
      fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {
        // 静默失败，不影响用户体验
      });
    } catch (error) {
      // 静默失败
    }
  }

  // 应用启动
  trackAppStart() {
    this.track('app_start', {
      locale: navigator.language,
    });
  }

  // 应用关闭
  trackAppClose() {
    this.track('app_close', {});
  }

  // 功能使用
  trackFeatureUse(feature: string) {
    this.track('feature_use', { feature });
  }

  // 错误追踪
  trackError(error: string) {
    this.track('error', { error });
  }
}

export const analytics = new Analytics();
```

##### 3. 集成到应用

```typescript
// src/main.tsx
import { analytics } from '@/services/analytics';

// 应用启动时
analytics.trackAppStart();

// 应用关闭时
window.addEventListener('beforeunload', () => {
  analytics.trackAppClose();
});

// 错误追踪
window.addEventListener('error', (e) => {
  analytics.trackError(e.message);
});
```

##### 4. 用户设置界面

```typescript
// src/routes/settings/privacy.tsx
import { useState } from 'react';
import { analytics } from '@/services/analytics';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function PrivacySettings() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    localStorage.getItem('analytics-enabled') !== 'false'
  );

  const handleToggle = (enabled: boolean) => {
    setAnalyticsEnabled(enabled);
    analytics.setEnabled(enabled);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">隐私设置</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>匿名使用统计</Label>
            <p className="text-sm text-muted-foreground">
              帮助我们了解应用使用情况，改进产品。
              我们只收集匿名数据，不会收集您的个人信息或写作内容。
            </p>
          </div>
          <Switch
            checked={analyticsEnabled}
            onCheckedChange={handleToggle}
          />
        </div>

        <div className="p-4 bg-muted rounded-lg text-sm">
          <h3 className="font-semibold mb-2">我们收集什么？</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>应用启动和关闭次数</li>
            <li>功能使用频率（如导出、搜索）</li>
            <li>错误和崩溃信息</li>
            <li>操作系统和应用版本</li>
          </ul>
          
          <h3 className="font-semibold mt-4 mb-2">我们不收集什么？</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>您的写作内容</li>
            <li>个人身份信息</li>
            <li>文件名或项目名称</li>
            <li>具体的按键或鼠标操作</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
```

---

### 方案 2: 使用现成服务

#### 选项 A: Plausible Analytics（推荐）

**优点**：
- 开源
- 隐私友好（不使用 Cookie）
- 符合 GDPR
- 界面美观

**价格**：$9/月（10k 月访问量）

```typescript
// 集成 Plausible
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>

// 自定义事件
window.plausible('Feature Used', { props: { feature: 'export' } });
```

#### 选项 B: Umami（推荐）

**优点**：
- 开源
- 可自托管（免费）
- 隐私友好
- 简单易用

**部署**：
```bash
# 使用 Docker
docker run -d \
  --name umami \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  ghcr.io/umami-software/umami:postgresql-latest
```

#### 选项 C: PostHog（功能最强）

**优点**：
- 开源
- 功能强大（事件追踪、用户画像、A/B 测试）
- 可自托管

**缺点**：
- 相对复杂
- 自托管需要较多资源

---

### 方案 3: 简单的心跳检测

最简单的方案，只统计活跃用户数：

```typescript
// src/services/heartbeat.ts
class Heartbeat {
  private interval: number = 24 * 60 * 60 * 1000; // 24小时
  private apiUrl: string = 'https://your-api.vercel.app/api/heartbeat';

  start() {
    // 首次启动
    this.ping();

    // 定期发送
    setInterval(() => {
      this.ping();
    }, this.interval);
  }

  private async ping() {
    const enabled = localStorage.getItem('analytics-enabled') !== 'false';
    if (!enabled) return;

    try {
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          version: '0.1.0',
          platform: navigator.platform,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // 静默失败
    }
  }
}

export const heartbeat = new Heartbeat();
```

---

## 📊 收集的数据示例

### 推荐收集（匿名）

```json
{
  "event": "app_start",
  "userId": "uuid-anonymous",
  "version": "0.1.0",
  "platform": "Linux",
  "locale": "zh-CN",
  "timestamp": "2024-11-30T10:00:00Z"
}

{
  "event": "feature_use",
  "userId": "uuid-anonymous",
  "feature": "export_pdf",
  "timestamp": "2024-11-30T10:05:00Z"
}

{
  "event": "app_close",
  "userId": "uuid-anonymous",
  "sessionDuration": 3600,
  "timestamp": "2024-11-30T11:00:00Z"
}
```

### 不要收集

```json
// ❌ 不要这样做
{
  "event": "document_save",
  "content": "用户的小说内容...",  // ❌ 不要收集内容
  "filename": "我的小说.txt",      // ❌ 不要收集文件名
  "email": "user@example.com",    // ❌ 不要收集个人信息
  "ip": "192.168.1.1"             // ❌ 不要收集 IP
}
```

---

## 🔒 隐私保护措施

### 1. 首次启动提示

```typescript
// 首次启动时显示
<Dialog open={isFirstLaunch}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>欢迎使用 Novel Editor</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <p>
        为了改进产品，我们希望收集匿名使用数据。
        我们承诺：
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li>不收集您的写作内容</li>
        <li>不收集个人身份信息</li>
        <li>数据完全匿名</li>
        <li>您可以随时关闭</li>
      </ul>
      <div className="flex gap-2">
        <Button onClick={() => acceptAnalytics()}>
          允许（推荐）
        </Button>
        <Button variant="outline" onClick={() => declineAnalytics()}>
          不允许
        </Button>
      </div>
    </div>
  </DialogContent>
</Dialog>
```

### 2. 数据加密

```typescript
// 使用 HTTPS
const apiUrl = 'https://your-api.vercel.app/api/analytics';

// 不使用 HTTP
// const apiUrl = 'http://...'; // ❌
```

### 3. 数据保留政策

```typescript
// 后端：自动删除 90 天前的数据
async function cleanOldData() {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  await db.events.deleteMany({
    timestamp: { $lt: ninetyDaysAgo }
  });
}
```

---

## 💰 成本估算

### 方案 1: 自建（推荐）

**免费方案**：
- Vercel Serverless: 免费（100k 请求/月）
- Cloudflare Workers: 免费（100k 请求/天）
- Supabase: 免费（500MB 数据库）
- MongoDB Atlas: 免费（512MB）

**成本**：$0/月（足够 10k 用户）

### 方案 2: Plausible

- $9/月（10k 月访问量）
- $19/月（100k 月访问量）

### 方案 3: Umami 自托管

- VPS: $5-10/月（DigitalOcean、Vultr）
- 或使用 Railway: $5/月

---

## 📈 统计指标

### 核心指标

1. **DAU/MAU** - 日活/月活用户
2. **留存率** - 7天/30天留存
3. **使用时长** - 平均会话时长
4. **功能使用** - 各功能使用频率
5. **错误率** - 崩溃和错误次数

### 实现示例

```typescript
// 统计功能使用
analytics.track('feature_use', { feature: 'export_pdf' });
analytics.track('feature_use', { feature: 'focus_mode' });
analytics.track('feature_use', { feature: 'global_search' });

// 统计会话时长
const sessionStart = Date.now();
window.addEventListener('beforeunload', () => {
  const duration = Date.now() - sessionStart;
  analytics.track('session_end', { duration });
});
```

---

## 🎯 我的推荐

### 第一阶段（MVP）

使用**方案 3（心跳检测）**：
- 最简单
- 只统计活跃用户数
- 完全免费
- 5 分钟实现

### 第二阶段（成长期）

升级到**方案 1（自建统计）**：
- 更详细的数据
- 完全控制
- 成本低
- 隐私友好

### 第三阶段（成熟期）

考虑**方案 2（Plausible/Umami）**：
- 专业的分析工具
- 美观的仪表板
- 省时省力

---

## 📝 实现清单

- [ ] 创建后端 API（Vercel Serverless）
- [ ] 实现前端 Analytics 服务
- [ ] 添加隐私设置页面
- [ ] 首次启动提示
- [ ] 集成到应用各处
- [ ] 创建统计仪表板
- [ ] 编写隐私政策
- [ ] 测试数据收集

---

## ⚖️ 法律合规

### 隐私政策（必须）

创建 `PRIVACY.md`：

```markdown
# 隐私政策

## 数据收集

我们收集以下匿名数据：
- 应用启动次数
- 功能使用频率
- 错误信息
- 操作系统版本

## 数据使用

数据仅用于：
- 改进产品
- 修复 Bug
- 了解用户需求

## 数据保护

- 所有数据完全匿名
- 使用 HTTPS 加密传输
- 90 天后自动删除
- 不会出售或分享数据

## 用户权利

您可以：
- 随时关闭数据收集
- 要求删除您的数据
- 查看我们收集的数据

## 联系方式

如有疑问，请联系：privacy@example.com
```

---

## 🎯 最终建议

1. **从简单开始** - 先用心跳检测
2. **透明沟通** - 明确告知用户
3. **可选退出** - 尊重用户选择
4. **保护隐私** - 只收集必要数据
5. **持续改进** - 根据数据优化产品

**记住**：用户信任比数据更重要！

