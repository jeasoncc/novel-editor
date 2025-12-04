# 🚀 MSIX 构建快速指南

## 🎯 两种方案

### 方案 A: GitHub Actions 自动构建（推荐）✅

**优点**:
- ✅ 完全自动化
- ✅ 免费
- ✅ 无需本地 Windows
- ✅ Microsoft Store 自动签名

**缺点**:
- ⏱️ 构建需要 10-15 分钟

### 方案 B: 购买证书并签名

**优点**:
- ✅ 可以直接分发 EXE
- ✅ 用户信任度高

**缺点**:
- 💰 需要购买证书（$300-500/年）
- 🔧 需要管理证书
- ⚠️ 对 Microsoft Store 不是必需的

## 🚀 推荐方案：GitHub Actions

### 快速开始

#### 1. 手动触发构建

```bash
# 1. 进入 GitHub 仓库
# 2. 点击 Actions 标签
# 3. 选择 "Build MSIX for Microsoft Store"
# 4. 点击 "Run workflow"
# 5. 输入版本号: 0.1.6
# 6. 点击 "Run workflow"
```

#### 2. 自动触发构建

```bash
# 创建并推送 tag
git tag msix-v0.1.6
git push origin msix-v0.1.6

# GitHub Actions 自动构建
# 10-15 分钟后在 Releases 页面下载 MSIX
```

### 下载 MSIX 文件

构建完成后：

**方法 1: 从 Artifacts 下载**
1. 进入 Actions 页面
2. 点击构建任务
3. 下载 `msix-package` artifact
4. 解压得到 `.msix` 文件

**方法 2: 从 Releases 下载**
1. 进入 Releases 页面
2. 找到对应版本
3. 直接下载 `.msix` 文件

### 上传到 Microsoft Store

1. 登录 [Partner Center](https://partner.microsoft.com/dashboard)
2. 创建新提交
3. 上传 MSIX 文件
4. 填写应用信息
5. 提交审核

## 💰 关于代码签名证书

### 需要购买证书吗？

**对于 Microsoft Store**: ❌ **不需要**
- Microsoft Store 会自动签名
- 节省 $300-500/年

**对于直接分发**: ✅ **需要**
- 用户下载 EXE 时不会看到警告
- 提高用户信任度

### 如果要购买证书

#### 推荐的证书提供商

1. **DigiCert**
   - 价格: $474/年
   - 网站: https://www.digicert.com/code-signing/
   - 优点: 信誉好，支持好

2. **Sectigo**
   - 价格: $299/年
   - 网站: https://sectigo.com/ssl-certificates-tls/code-signing
   - 优点: 性价比高

3. **GlobalSign**
   - 价格: $299/年
   - 网站: https://www.globalsign.com/en/code-signing-certificate
   - 优点: 全球认可

#### 购买流程

1. **选择证书类型**
   - 个人: Individual Code Signing
   - 公司: Organization Validation (OV)

2. **提交验证材料**
   - 个人: 身份证明
   - 公司: 营业执照、公司证明

3. **等待审核**
   - 个人: 1-3 天
   - 公司: 3-7 天

4. **下载证书**
   - 通常是 `.pfx` 或 `.p12` 文件
   - 包含私钥，需要密码保护

#### 配置 GitHub Actions 签名

如果购买了证书，可以使用 `.github/workflows/build-signed-exe.yml`：

1. **转换证书为 Base64**
   ```powershell
   $bytes = [System.IO.File]::ReadAllBytes("cert.pfx")
   $base64 = [System.Convert]::ToBase64String($bytes)
   $base64 | Out-File cert-base64.txt
   ```

2. **添加 GitHub Secrets**
   - `CODE_SIGNING_CERT`: 证书的 Base64 编码
   - `CERT_PASSWORD`: 证书密码

3. **取消注释签名步骤**
   - 编辑 `.github/workflows/build-signed-exe.yml`
   - 取消注释签名相关步骤

4. **运行 workflow**
   ```bash
   # 手动触发
   # Actions → Build Signed EXE → Run workflow
   ```

## 📊 方案对比

| 特性 | MSIX (无证书) | MSIX (有证书) | 签名 EXE |
|------|---------------|---------------|----------|
| Microsoft Store | ✅ 推荐 | ✅ 可以 | ❌ 不推荐 |
| 直接分发 | ⚠️ 需开发者模式 | ✅ 可以 | ✅ 推荐 |
| 成本 | 💰 免费 | 💰 $300-500/年 | 💰 $300-500/年 |
| 自动更新 | ✅ Store 支持 | ✅ Store 支持 | ❌ 需自己实现 |
| 用户信任 | ✅ Store 签名 | ✅ 你的签名 | ✅ 你的签名 |

## 🎯 推荐策略

### 策略 A: 只发布到 Microsoft Store

```
✅ 使用 GitHub Actions 构建 MSIX
✅ 不购买证书（Store 自动签名）
✅ 成本: $0
```

### 策略 B: Store + 直接分发

```
✅ 使用 GitHub Actions 构建 MSIX（Store）
✅ 购买证书签名 EXE（直接分发）
✅ 成本: $300-500/年
```

### 策略 C: 只直接分发

```
✅ 购买证书
✅ 使用 GitHub Actions 构建并签名 EXE
✅ 成本: $300-500/年
```

## 💡 我的建议

### 对于你的项目（小说编辑器）

**推荐策略 A**:
1. ✅ 使用 GitHub Actions 构建 MSIX
2. ✅ 发布到 Microsoft Store
3. ✅ 不购买证书
4. ✅ 成本: $0

**理由**:
- Microsoft Store 提供自动签名
- 用户可以通过 Store 安装
- 自动更新支持
- 节省证书费用
- 提高应用可信度

### 如果需要直接分发

可以提供：
1. **Microsoft Store 版本**（推荐）
   - 自动签名
   - 自动更新
   - 用户信任

2. **GitHub Releases 版本**（备选）
   - 未签名的 EXE
   - 用户需要手动允许
   - 适合高级用户

## 🚀 立即开始

### 步骤 1: 触发构建

```bash
git tag msix-v0.1.6
git push origin msix-v0.1.6
```

### 步骤 2: 等待构建

- 进入 Actions 页面
- 查看构建进度
- 10-15 分钟后完成

### 步骤 3: 下载 MSIX

- 从 Releases 页面下载
- 或从 Artifacts 下载

### 步骤 4: 上传到 Store

- 登录 Partner Center
- 上传 MSIX
- 提交审核

## 📚 详细文档

- **GitHub Actions 指南**: [docs/github-actions-msix-guide.md](docs/github-actions-msix-guide.md)
- **Microsoft Store 指南**: [docs/microsoft-store-guide.md](docs/microsoft-store-guide.md)
- **快速修复**: [MICROSOFT_STORE_QUICK_FIX.md](MICROSOFT_STORE_QUICK_FIX.md)

## ❓ 常见问题

### Q: 必须购买证书吗？

A: **不需要**！Microsoft Store 会自动签名。

### Q: GitHub Actions 免费吗？

A: **是的**！Public 仓库无限制，Private 仓库有免费额度。

### Q: 构建需要多久？

A: 首次 15-20 分钟，后续 10-15 分钟（有缓存）。

### Q: 可以本地构建吗？

A: 可以，使用 `scripts/build-msix.ps1`（需要 Windows）。

### Q: MSIX 和 EXE 有什么区别？

A: 
- **MSIX**: 现代打包格式，Store 推荐，自动签名
- **EXE**: 传统格式，需要手动签名

---

**推荐**: 使用 GitHub Actions 构建 MSIX，发布到 Microsoft Store，无需购买证书！🎉
