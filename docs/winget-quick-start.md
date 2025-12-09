# Winget 快速发布指南

## 5 分钟发布到 Winget

### 前置要求

1. GitHub 账号
2. Fork winget-pkgs 仓库
3. Git 和 GitHub CLI

### 步骤 1：Fork winget-pkgs 仓库

访问并 Fork：
https://github.com/microsoft/winget-pkgs

```bash
# 或使用 GitHub CLI
gh repo fork microsoft/winget-pkgs --clone=false
```

### 步骤 2：克隆你的 Fork

```bash
git clone https://github.com/YOUR_USERNAME/winget-pkgs.git
cd winget-pkgs
```

### 步骤 3：创建清单文件

```bash
# 创建目录结构
mkdir -p manifests/j/Jeason/NovelEditor/0.1.11

# 复制我们准备好的清单文件
cp /path/to/novel-editor/winget-manifests/* manifests/j/Jeason/NovelEditor/0.1.11/
```

### 步骤 4：验证清单

```bash
# 安装 winget-create (Windows)
winget install Microsoft.WingetCreate

# 验证清单
winget validate manifests/j/Jeason/NovelEditor/0.1.11/
```

### 步骤 5：提交 PR

```bash
# 创建新分支
git checkout -b novel-editor-0.1.11

# 添加文件
git add manifests/j/Jeason/NovelEditor/

# 提交
git commit -m "New package: Jeason.NovelEditor version 0.1.11"

# 推送
git push origin novel-editor-0.1.11

# 创建 PR
gh pr create --repo microsoft/winget-pkgs \
  --title "New package: Jeason.NovelEditor version 0.1.11" \
  --body "Novel Editor - 一个现代化的小说编辑器"
```

### 步骤 6：等待审核

- 通常 1-3 天
- 机器人会自动验证
- 维护者会审核
- 通过后自动合并

## 清单文件说明

我们已经为你准备好了三个清单文件：

### 1. Jeason.NovelEditor.yaml (版本文件)

```yaml
PackageIdentifier: Jeason.NovelEditor
PackageVersion: 0.1.11
DefaultLocale: zh-CN
ManifestType: version
ManifestVersion: 1.5.0
```

### 2. Jeason.NovelEditor.installer.yaml (安装器文件)

```yaml
PackageIdentifier: Jeason.NovelEditor
PackageVersion: 0.1.11
InstallerType: wix
Installers:
- Architecture: x64
  InstallerUrl: https://github.com/jeasoncc/novel-editor/releases/download/desktop-v0.1.11/novel-editor_0.1.11_x64_zh-CN.msi
  InstallerSha256: 40BF5E5228AA183198DFD34F9BA48AE8A2B325EDF1EC230E4D32124257C42EDD
  ProductCode: '{BE47635A-D137-4EDE-9215-381509E69DB9}'
```

### 3. Jeason.NovelEditor.locale.zh-CN.yaml (本地化文件)

```yaml
PackageIdentifier: Jeason.NovelEditor
PackageVersion: 0.1.11
PackageLocale: zh-CN
Publisher: Lotus
PackageName: Novel Editor
ShortDescription: 一个现代化的小说编辑器
```

## 常见问题

### Q: 为什么需要三个文件？

A: Winget 使用多文件清单格式：
- `.yaml` - 版本信息
- `.installer.yaml` - 安装器信息
- `.locale.zh-CN.yaml` - 本地化信息

### Q: ProductCode 是什么？

A: MSI 文件的唯一标识符，用于卸载和升级。

### Q: 如何更新版本？

A: 创建新的版本目录，提交新的 PR。

### Q: 审核需要多久？

A: 通常 1-3 天，简单的包可能几小时。

### Q: 审核失败怎么办？

A: 查看机器人的反馈，修改后重新提交。

## 验证安装

PR 合并后，用户可以安装：

```powershell
winget install Jeason.NovelEditor
```

或搜索：

```powershell
winget search "Novel Editor"
```

## 下一步

1. ✅ 提交 PR 到 winget-pkgs
2. ✅ 等待审核通过
3. ✅ 更新 README 添加安装说明
4. ✅ 开始推广

## 相关资源

- [Winget 官方文档](https://docs.microsoft.com/windows/package-manager/)
- [winget-pkgs 仓库](https://github.com/microsoft/winget-pkgs)
- [清单规范](https://github.com/microsoft/winget-pkgs/tree/master/doc)

---

**提示：** 清单文件已经准备好在 `winget-manifests/` 目录中！
