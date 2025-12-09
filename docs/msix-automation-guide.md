# MSIX 自动化打包指南

## 概述

我们创建了一个 GitHub Actions workflow 来自动将 Tauri 生成的 MSI 文件转换为 MSIX 格式。

## 工作原理

### Workflow: `.github/workflows/build-msix.yml`

**触发条件：**
1. 手动触发（workflow_dispatch）
2. 推送 `desktop-v*.*.*` tag

**构建流程：**

```
1. 构建 Tauri 应用 → 生成 .msi 文件
2. 提取 MSI 内容
3. 创建 MSIX 清单文件 (AppxManifest.xml)
4. 使用 MakeAppx.exe 打包为 MSIX
5. 使用自签名证书签名
6. 上传到 GitHub Release
```

## 使用方法

### 方式 1：自动触发（推荐）

当你推送 desktop tag 时，会自动触发：

```bash
git tag desktop-v0.1.12
git push origin desktop-v0.1.12
```

这会同时触发：
- `release-desktop.yml` - 构建所有平台
- `build-msix.yml` - 额外构建 MSIX

### 方式 2：手动触发

1. 访问 GitHub Actions
2. 选择 "Build MSIX Package" workflow
3. 点击 "Run workflow"
4. 等待构建完成

## 输出文件

构建完成后，你会得到：

- `novel-editor_0.1.11.msix` - MSIX 安装包
- 自动上传到 GitHub Release（草稿）

## 重要说明

### ⚠️ 签名问题

**当前状态：**
- Workflow 使用**自签名测试证书**
- 用户安装时会看到"未知发布者"警告
- 不能直接提交到 Microsoft Store

**解决方案：**

#### 选项 1：购买代码签名证书（推荐用于生产）

**价格：** $100-300/年

**提供商：**
- DigiCert
- Sectigo
- GlobalSign

**优点：**
- 消除 SmartScreen 警告
- 可以提交到 Microsoft Store
- 建立信任

**如何使用：**

1. 购买证书后，将 `.pfx` 文件添加到 GitHub Secrets
2. 修改 workflow，使用真实证书签名：

```yaml
- name: Sign MSIX with real certificate
  shell: pwsh
  run: |
    # 从 Secrets 解码证书
    $certBytes = [Convert]::FromBase64String("${{ secrets.SIGNING_CERT }}")
    [IO.File]::WriteAllBytes("cert.pfx", $certBytes)
    
    # 签名
    & signtool sign /fd SHA256 /f "cert.pfx" /p "${{ secrets.CERT_PASSWORD }}" novel-editor.msix
```

#### 选项 2：使用 Microsoft Store 签名（免费）

**前提：**
- 注册 Microsoft Store 开发者账号（$19/年）
- 提交应用到 Store

**优点：**
- Microsoft 自动签名
- 完全免费（除了开发者账号）
- 用户信任度高

**缺点：**
- 只能通过 Store 分发
- 需要通过审核

#### 选项 3：继续使用自签名（测试/开发）

**适用场景：**
- 内部测试
- 开发阶段
- 小范围分发

**用户安装步骤：**
1. 下载 `.msix` 文件
2. 右键 → 属性 → 数字签名 → 详细信息 → 查看证书
3. 安装证书到"受信任的根证书颁发机构"
4. 双击 `.msix` 安装

## 技术细节

### AppxManifest.xml

MSIX 的核心配置文件：

```xml
<Identity
  Name="NovelEditor"
  Publisher="CN=Lotus"
  Version="0.1.11.0" />
```

**重要字段：**
- `Name`: 应用标识符（提交 Store 时会分配正式的）
- `Publisher`: 必须与签名证书的 CN 匹配
- `Version`: 必须是 4 位数字（x.x.x.0）

### 图标要求

MSIX 需要特定尺寸的图标：

- `Square44x44Logo.png` - 44x44 像素
- `Square150x150Logo.png` - 150x150 像素
- `StoreLogo.png` - 50x50 像素

**当前方案：**
- 从 Tauri 的 `icon.png` 复制
- 可能需要手动调整尺寸

**改进建议：**
```bash
# 使用 ImageMagick 自动生成
convert icon.png -resize 44x44 Square44x44Logo.png
convert icon.png -resize 150x150 Square150x150Logo.png
convert icon.png -resize 50x50 StoreLogo.png
```

## 对比：MSIX vs MSI

| 特性 | MSIX | MSI |
|------|------|-----|
| Microsoft Store | ✅ 支持 | ❌ 不支持 |
| 自动更新 | ✅ 内置 | ❌ 需要自己实现 |
| 沙箱隔离 | ✅ 可选 | ❌ 无 |
| 卸载干净 | ✅ 完全干净 | ⚠️ 可能残留 |
| 安装速度 | ✅ 快 | ⚠️ 较慢 |
| 兼容性 | Windows 10+ | Windows 7+ |
| 签名要求 | ⚠️ 严格 | ⚠️ 推荐但非必需 |

## 发布策略建议

### 阶段 1：初期（现在）

**目标：** 快速获得用户反馈

**方案：**
- ✅ 发布 MSI/EXE 到 GitHub Releases
- ✅ 发布到 Winget（免费，官方）
- ⏸️ 暂不发布 MSIX（签名成本高）

**原因：**
- MSI 已经足够好用
- Winget 覆盖大部分 Windows 用户
- 节省成本

### 阶段 2：成长期（用户 > 500）

**目标：** 提升专业度和信任度

**方案：**
- 💰 购买代码签名证书（$100-300/年）
- ✅ 签名所有安装包（MSI + MSIX）
- ✅ 消除 SmartScreen 警告

**原因：**
- 用户增长证明了市场需求
- 投资回报率提高
- 提升品牌形象

### 阶段 3：成熟期（用户 > 1000）

**目标：** 最大化覆盖面

**方案：**
- 💰 注册 Microsoft Store（$19/年）
- ✅ 提交 MSIX 到 Store
- ✅ 利用 Store 的自动更新和分发

**原因：**
- 用户基数大，值得投入
- Store 提供额外曝光
- 自动更新提升用户体验

## 常见问题

### Q: 为什么不直接用 Tauri 生成 MSIX？

A: Tauri 2.0 目前不支持 MSIX。这是已知限制，团队在开发中。

### Q: 自签名证书安全吗？

A: 安全，但用户需要手动信任。不适合公开分发。

### Q: 必须用 MSIX 才能上 Store 吗？

A: 是的，Microsoft Store 只接受 MSIX/APPX 格式。

### Q: GitHub Actions 的 MSIX 能直接用吗？

A: 可以安装，但会有"未知发布者"警告。需要用户手动信任证书。

### Q: 如何测试 MSIX？

A: 
1. 从 Actions 下载 artifact
2. 右键 → 属性 → 数字签名 → 安装证书
3. 双击 MSIX 安装

### Q: 能在 Linux/Mac 上打包 MSIX 吗？

A: 不能。MakeAppx.exe 只能在 Windows 上运行。但 GitHub Actions 提供 Windows runner。

## 下一步

### 立即可做

1. ✅ 测试 MSIX workflow
   ```bash
   # 手动触发 workflow
   gh workflow run build-msix.yml
   ```

2. ✅ 下载并测试 MSIX 安装包

3. ✅ 继续发布到 Winget（优先级更高）

### 3 个月后评估

4. 📊 查看用户数据
   - GitHub Stars
   - 下载次数
   - 用户反馈

5. 💰 决定是否购买代码签名证书
   - 如果用户 > 500，值得投资
   - 如果用户 < 200，继续观察

6. 📦 决定是否发布到 Microsoft Store
   - 如果用户 > 1000，值得投资
   - 否则继续使用 Winget

## 参考资源

- [MSIX 官方文档](https://docs.microsoft.com/windows/msix/)
- [MakeAppx.exe 文档](https://docs.microsoft.com/windows/msix/package/create-app-package-with-makeappx-tool)
- [代码签名证书购买指南](https://docs.microsoft.com/windows/msix/package/signing-package-overview)
- [Microsoft Store 发布指南](https://docs.microsoft.com/windows/uwp/publish/)

## 总结

**MSIX 自动化已完成！** 🎉

但建议：
1. **现在：** 专注于 Winget 和 GitHub Releases
2. **未来：** 根据用户增长决定是否投资签名和 Store

记住：好的产品比完美的打包更重要。先获得用户，再优化分发。
