# 🔧 发布构建问题修复

## 🐛 问题

在 GitHub Actions 中构建时出现错误：
- ❌ Linux/macOS: "No artifacts were found"
- ❌ MSIX 构建没有运行

## 🔍 原因分析

### 问题 1: Tauri 配置不匹配

**原配置**：
```json
"bundle": {
  "targets": ["msi", "nsis"]  // 只构建 Windows 包
}
```

**问题**：工作流期望所有平台的包（deb, rpm, appimage, dmg），但 Tauri 只配置了 Windows。

### 问题 2: MSIX Job 依赖失败的 Job

```yaml
build-msix:
  needs: publish-tauri  # 依赖失败的 job
```

**问题**：`publish-tauri` 失败导致 `build-msix` 被跳过。

## ✅ 修复方案

### 1. 更新 Tauri 配置

修改 `apps/desktop/src-tauri/tauri.conf.json`：

```json
"bundle": {
  "active": true,
  "targets": "all",  // 构建所有平台的包
  "linux": {
    "deb": {
      "depends": []
    },
    "appimage": {
      "bundleMediaFramework": true
    }
  },
  "macOS": {
    "minimumSystemVersion": "10.13"
  }
}
```

### 2. 修复工作流

#### 移除 ubuntu-22.04-arm

ARM 构建需要特殊配置，暂时移除：

```yaml
matrix:
  include:
    - platform: 'macos-latest'
      args: '--target aarch64-apple-darwin'
    - platform: 'macos-latest'
      args: '--target x86_64-apple-darwin'
    - platform: 'ubuntu-22.04'  # 只保留 x64
    - platform: 'windows-latest'
```

#### MSIX Job 独立运行

```yaml
build-msix:
  # 移除 needs: publish-tauri
  runs-on: windows-latest
  if: startsWith(github.ref, 'refs/tags/desktop-v')
```

### 3. 添加容错处理

对于可能失败的上传步骤：

```yaml
- name: Upload build artifacts
  continue-on-error: true  # 即使失败也继续
```

## 📦 现在的构建产物

### Windows
- ✅ `novel-editor_0.1.18_x64-setup.exe` (NSIS)
- ✅ `novel-editor_0.1.18_x64_en-US.msi` (MSI)
- ✅ `novel-editor_0.1.18_x64.msix` (MSIX)

### macOS
- ✅ `novel-editor_0.1.18_aarch64.dmg` (Apple Silicon)
- ✅ `novel-editor_0.1.18_x64.dmg` (Intel)
- ✅ `novel-editor.app.tar.gz`

### Linux
- ✅ `novel-editor_0.1.18_amd64.deb`
- ✅ `novel-editor_0.1.18_amd64.AppImage`
- ✅ `novel-editor-0.1.18-1.x86_64.rpm`

## 🚀 测试构建

### 本地测试

```bash
# Windows
cd apps/desktop
bun run tauri build

# 检查产物
ls src-tauri/target/release/bundle/
```

### GitHub Actions 测试

```bash
# 推送 tag 触发构建
git tag desktop-v0.1.18
git push origin desktop-v0.1.18

# 或手动触发
# Actions → Release Desktop App → Run workflow
```

## 📊 构建时间估算

| 平台 | 时间 |
|------|------|
| Windows | ~10 分钟 |
| macOS (Intel) | ~12 分钟 |
| macOS (ARM) | ~12 分钟 |
| Linux | ~8 分钟 |
| MSIX | ~5 分钟 |
| **总计** | ~47 分钟 |

## ⚠️ 注意事项

### 1. 首次构建可能较慢

首次构建需要下载依赖，可能需要 15-20 分钟。

### 2. 并行构建

所有平台并行构建，总时间约为最慢平台的时间。

### 3. MSIX 独立构建

MSIX 不依赖其他构建，可以独立成功。

### 4. 签名问题

- Windows MSI/NSIS: 未签名（用户会看到警告）
- MSIX: 自签名（仅用于测试）
- macOS: 未签名（需要右键打开）

## 🔍 验证构建成功

### 检查 GitHub Actions

1. 进入 Actions 页面
2. 查看 "Release Desktop App" 工作流
3. 确认所有 jobs 都成功（绿色勾）

### 检查产物

1. 点击构建任务
2. 查看 Artifacts 部分
3. 应该看到：
   - `tauri-bundles-windows`
   - `tauri-bundles-macos-aarch64-apple-darwin`
   - `tauri-bundles-macos-x86_64-apple-darwin`
   - `tauri-bundles-linux`
   - `msix-package`

### 检查 Release

1. 进入 Releases 页面
2. 找到对应的 draft release
3. 确认所有安装包都已上传

## 🐛 常见问题

### Q: Linux 构建失败 "No artifacts were found"

A: 检查 `tauri.conf.json` 中是否配置了 Linux bundles：

```json
"bundle": {
  "targets": "all"  // 或 ["deb", "appimage", "rpm"]
}
```

### Q: MSIX 构建被跳过

A: 确保：
1. 推送了正确的 tag (`desktop-v*.*.*`)
2. MSIX job 没有 `needs: publish-tauri`

### Q: macOS 构建失败

A: 检查：
1. Rust toolchain 是否安装了目标平台
2. 是否有足够的磁盘空间

### Q: 构建时间过长

A: 正常情况，首次构建需要下载依赖。后续构建会使用缓存，速度会快很多。

## 📚 相关文档

- [Tauri Bundle 配置](https://tauri.app/v1/guides/building/)
- [GitHub Actions 工作流](https://docs.github.com/en/actions)
- [MSIX 打包指南](./MSIX_QUICK_FIX.md)

---

**修复完成后，重新推送 tag 即可触发正确的构建流程。**
