# MSIX 快速开始指南

## 5 分钟快速上手

### 方案选择

我们使用 **cargo-packager** 方案（基于 Tauri Issue #4818）。

**为什么？**
- ✅ 官方推荐
- ✅ 配置简单
- ✅ 自动化程度高

## 本地构建（Windows）

### 1. 安装工具

```bash
# 安装 cargo-packager
cargo install cargo-packager --locked
```

### 2. 构建 MSIX

```bash
# 进入项目目录
cd apps/desktop

# 安装依赖
bun install

# 构建前端
bun run build

# 构建 MSIX
cd src-tauri
cargo packager --release --formats app
```

### 3. 查找 MSIX

```powershell
# 查找生成的 MSIX 文件
Get-ChildItem -Path target/release -Recurse -Filter "*.msix"
```

### 4. 安装测试

1. 右键 MSIX 文件 → 属性 → 数字签名
2. 详细信息 → 查看证书 → 安装证书
3. 选择"本地计算机" → "受信任的根证书颁发机构"
4. 双击 MSIX 安装

## GitHub Actions 自动构建

### 触发构建

```bash
# 方式 1：推送 tag（推荐）
git tag desktop-v0.1.12
git push origin desktop-v0.1.12

# 方式 2：手动触发
gh workflow run build-msix.yml
```

### 查看进度

访问：https://github.com/jeasoncc/novel-editor/actions

### 下载 MSIX

构建完成后：
1. 进入 Actions 页面
2. 点击最新的 workflow run
3. 下载 `msix-package` artifact
4. 解压得到 `.msix` 文件

## 配置文件

### Packager.toml

位置：`apps/desktop/src-tauri/Packager.toml`

```toml
[package]
product_name = "Novel Editor"
version = "0.1.11"  # 自动从 tauri.conf.json 同步
publisher = "Lotus"

[windows.msix]
enabled = true
publisher = "CN=Lotus"
display_name = "Novel Editor"
capabilities = ["runFullTrust"]
```

**需要修改的地方：**
- `publisher`: 你的名字或公司名
- `display_name`: 应用显示名称

## 签名选项

### 选项 1：自签名（免费，测试用）

**当前状态：** 已配置

**优点：** 免费，快速
**缺点：** 用户需要手动信任证书

### 选项 2：购买证书（$100-300/年）

**适用场景：** 用户 > 500

**步骤：**
1. 购买代码签名证书
2. 添加到 GitHub Secrets
3. 更新 workflow

### 选项 3：Microsoft Store（$19/年）

**适用场景：** 用户 > 1000

**步骤：**
1. 注册开发者账号
2. 提交 MSIX
3. Microsoft 自动签名

## 常见问题

### Q: 构建失败怎么办？

A: 检查：
1. 是否安装了 cargo-packager
2. 前端是否构建成功
3. 查看 GitHub Actions 日志

### Q: MSIX 安装时提示"未知发布者"？

A: 正常，因为使用了自签名证书。需要：
1. 安装证书到"受信任的根证书颁发机构"
2. 或购买真实的代码签名证书

### Q: 如何更新版本号？

A: 版本号自动从 `tauri.conf.json` 同步，不需要手动更新 `Packager.toml`。

### Q: 支持哪些平台？

A: cargo-packager 支持：
- Windows: MSIX, MSI, NSIS
- macOS: DMG, APP
- Linux: DEB, RPM, AppImage

但 MSIX 只能在 Windows 上构建。

## 下一步

### 立即行动

1. ✅ 测试本地构建（如果有 Windows）
2. ✅ 触发 GitHub Actions 构建
3. ✅ 下载并测试 MSIX

### 本周完成

4. ✅ 发布到 Winget（优先级最高）
5. ✅ 更新 README 添加安装说明
6. ✅ 开始推广

### 3 个月后评估

7. 📊 查看用户数据
8. 💰 决定是否购买代码签名证书
9. 📦 决定是否发布到 Microsoft Store

## 相关文档

- **详细指南：** `docs/msix-cargo-packager-guide.md`
- **自动化说明：** `docs/msix-automation-guide.md`
- **手动打包：** `docs/msix-packaging-guide.md`
- **完成总结：** `MSIX_AUTOMATION_COMPLETE.md`

## 获取帮助

- **Tauri Issue #4818:** https://github.com/tauri-apps/tauri/issues/4818
- **cargo-packager:** https://github.com/crabnebula-dev/cargo-packager
- **Tauri Discord:** https://discord.gg/tauri

---

**记住：** 先用 Winget 获得用户，MSIX 作为补充选项。
