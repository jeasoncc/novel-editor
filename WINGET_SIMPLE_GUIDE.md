# Winget 最简单发布方法（网页操作）

## 适用于 Arch Linux 用户

你不需要克隆任何仓库到本地！全部在 GitHub 网页上完成。

## 步骤 1：Fork winget-pkgs

1. 访问：https://github.com/microsoft/winget-pkgs
2. 点击右上角的 **Fork** 按钮
3. 等待几秒，fork 完成

## 步骤 2：在你的 Fork 中创建文件

### 2.1 进入你的 Fork

访问：https://github.com/jeasoncc/winget-pkgs

### 2.2 创建目录结构

1. 点击 **Add file** → **Create new file**
2. 在文件名输入框中输入：
   ```
   manifests/j/Jeason/NovelEditor/0.1.11/Jeason.NovelEditor.yaml
   ```
   （输入 `/` 会自动创建目录）

### 2.3 粘贴第一个文件内容

复制以下内容：

```yaml
# Created using wingetcreate 1.5.0.0
# yaml-language-server: $schema=https://aka.ms/winget-manifest.version.1.5.0.schema.json

PackageIdentifier: Jeason.NovelEditor
PackageVersion: 0.1.11
DefaultLocale: zh-CN
ManifestType: version
ManifestVersion: 1.5.0
```

3. 滚动到底部
4. 选择 **Create a new branch** 并命名为 `novel-editor-0.1.11`
5. 点击 **Propose new file**

### 2.4 添加第二个文件

1. 回到你的分支：https://github.com/jeasoncc/winget-pkgs/tree/novel-editor-0.1.11
2. 导航到：`manifests/j/Jeason/NovelEditor/0.1.11/`
3. 点击 **Add file** → **Create new file**
4. 文件名：`Jeason.NovelEditor.installer.yaml`
5. 粘贴内容：

```yaml
# Created using wingetcreate 1.5.0.0
# yaml-language-server: $schema=https://aka.ms/winget-manifest.installer.1.5.0.schema.json

PackageIdentifier: Jeason.NovelEditor
PackageVersion: 0.1.11
Platform:
  - Windows.Desktop
MinimumOSVersion: 10.0.0.0
InstallerType: wix
Scope: machine
InstallModes:
  - interactive
  - silent
  - silentWithProgress
UpgradeBehavior: install
Installers:
  - Architecture: x64
    InstallerUrl: https://github.com/jeasoncc/novel-editor/releases/download/desktop-v0.1.11/novel-editor_0.1.11_x64_zh-CN.msi
    InstallerSha256: 40BF5E5228AA183198DFD34F9BA48AE8A2B325EDF1EC230E4D32124257C42EDD
    ProductCode: "{BE47635A-D137-4EDE-9215-381509E69DB9}"
ManifestType: installer
ManifestVersion: 1.5.0
```

6. 选择 **Commit directly to the novel-editor-0.1.11 branch**
7. 点击 **Commit new file**

### 2.5 添加第三个文件

1. 继续在同一目录
2. 点击 **Add file** → **Create new file**
3. 文件名：`Jeason.NovelEditor.locale.zh-CN.yaml`
4. 粘贴内容：

```yaml
# Created using wingetcreate 1.5.0.0
# yaml-language-server: $schema=https://aka.ms/winget-manifest.defaultLocale.1.5.0.schema.json

PackageIdentifier: Jeason.NovelEditor
PackageVersion: 0.1.11
PackageLocale: zh-CN
Publisher: Lotus
PublisherUrl: https://github.com/jeasoncc
PublisherSupportUrl: https://github.com/jeasoncc/novel-editor/issues
Author: Jeason
PackageName: Novel Editor
PackageUrl: https://github.com/jeasoncc/novel-editor
License: MIT
LicenseUrl: https://github.com/jeasoncc/novel-editor/blob/main/LICENSE
Copyright: Copyright (c) 2024 Jeason
ShortDescription: 一个现代化的小说编辑器
Description: |-
  Novel Editor 是一个功能强大的小说编辑器，提供丰富的编辑功能和直观的用户界面。
  
  主要特性：
  - 富文本编辑器，支持 Markdown
  - 章节管理和大纲视图
  - 角色管理
  - 场景管理
  - 自动保存
  - 跨平台支持
Moniker: novel-editor
Tags:
  - editor
  - novel
  - writing
  - markdown
  - 小说
  - 编辑器
  - 写作
ManifestType: defaultLocale
ManifestVersion: 1.5.0
```

5. 选择 **Commit directly to the novel-editor-0.1.11 branch**
6. 点击 **Commit new file**

## 步骤 3：创建 Pull Request

1. 访问：https://github.com/jeasoncc/winget-pkgs
2. 你会看到一个黄色提示框，显示你的新分支
3. 点击 **Compare & pull request** 按钮
4. 填写 PR 信息：

**Title:**
```
New package: Jeason.NovelEditor version 0.1.11
```

**Description:**
```
Novel Editor - 一个现代化的小说编辑器

**Package Information:**
- Package: Jeason.NovelEditor
- Version: 0.1.11
- Publisher: Lotus
- License: MIT

**Description:**
Novel Editor 是一个功能强大的小说编辑器，提供丰富的编辑功能和直观的用户界面。

**Features:**
- 富文本编辑器，支持 Markdown
- 章节管理和大纲视图
- 角色管理
- 场景管理
- 自动保存
- 跨平台支持

**Links:**
- Homepage: https://github.com/jeasoncc/novel-editor
- Release: https://github.com/jeasoncc/novel-editor/releases/tag/desktop-v0.1.11
```

5. 点击 **Create pull request**

## 步骤 4：等待审核

### 自动验证（几分钟）

机器人会自动检查：
- ✅ 清单格式
- ✅ SHA256 校验
- ✅ URL 可访问性

如果有错误，机器人会留言告诉你。

### 人工审核（1-3天）

维护者会审核你的 PR。

### 合并

通过后会自动合并，几小时后用户就可以安装了！

## 完成！

就这么简单！完全不需要在本地操作。

## 验证

PR 合并后，Windows 用户可以：

```powershell
winget install Jeason.NovelEditor
```

## 如果出错

如果机器人报错，你可以：

1. 在 GitHub 网页上直接编辑文件
2. 修改后提交到同一个分支
3. PR 会自动更新

## 优点

- ✅ 不需要克隆仓库
- ✅ 不需要命令行
- ✅ 在 Arch Linux 上完全可行
- ✅ 简单直观

## 下一步

1. 完成上述步骤
2. 等待 PR 合并
3. 更新你的 README，告诉用户可以用 Winget 安装
4. 开始推广！

---

**提示：** 所有文件内容都在上面，直接复制粘贴即可！
