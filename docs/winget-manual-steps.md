# Winget 手动发布步骤（适用于 Linux/macOS）

## 简介

这是一个完全手动的步骤指南，适合在 Linux（包括 Arch Linux）或 macOS 上发布到 Winget。

**优点：**
- 完全控制每一步
- 避免自动化脚本的权限问题
- 更容易理解流程

## 前置要求

1. GitHub 账号
2. Git
3. GitHub CLI (`gh`) - 可选，用于创建 PR

## 步骤 1：Fork winget-pkgs 仓库

### 方式 A：使用 GitHub 网页

1. 访问：https://github.com/microsoft/winget-pkgs
2. 点击右上角的 "Fork" 按钮
3. 等待 fork 完成

### 方式 B：使用 GitHub CLI

```bash
gh repo fork microsoft/winget-pkgs --clone=false
```

## 步骤 2：克隆你的 Fork

```bash
# 替换 YOUR_USERNAME 为你的 GitHub 用户名
# 使用 --depth=1 浅克隆，更快，占用空间更小
git clone --depth=1 https://github.com/YOUR_USERNAME/winget-pkgs.git
cd winget-pkgs

# 添加上游仓库
git remote add upstream https://github.com/microsoft/winget-pkgs.git
```

**为什么使用 `--depth=1`？**
- winget-pkgs 仓库非常大（几 GB）
- 浅克隆只下载最新的提交
- 速度快 10-20 倍
- 节省磁盘空间

## 步骤 3：创建目录结构

```bash
# 创建版本目录
mkdir -p manifests/j/Jeason/NovelEditor/0.1.11
```

**目录结构说明：**
- `manifests/` - 所有包的根目录
- `j/` - 首字母（Publisher 的首字母）
- `Jeason/` - Publisher 名称
- `NovelEditor/` - 包名称
- `0.1.11/` - 版本号

## 步骤 4：复制清单文件

```bash
# 回到你的项目目录
cd /path/to/novel-editor

# 复制清单文件到 winget-pkgs
cp winget-manifests/* /path/to/winget-pkgs/manifests/j/Jeason/NovelEditor/0.1.11/
```

或者手动复制三个文件：
- `Jeason.NovelEditor.yaml`
- `Jeason.NovelEditor.installer.yaml`
- `Jeason.NovelEditor.locale.zh-CN.yaml`

## 步骤 5：验证文件

```bash
cd /path/to/winget-pkgs

# 检查文件是否存在
ls -la manifests/j/Jeason/NovelEditor/0.1.11/

# 应该看到三个文件：
# Jeason.NovelEditor.yaml
# Jeason.NovelEditor.installer.yaml
# Jeason.NovelEditor.locale.zh-CN.yaml
```

## 步骤 6：创建分支

```bash
# 确保在 winget-pkgs 目录
cd /path/to/winget-pkgs

# 更新 master 分支
git checkout master
git pull upstream master

# 创建新分支
git checkout -b novel-editor-0.1.11
```

## 步骤 7：提交更改

```bash
# 添加文件
git add manifests/j/Jeason/NovelEditor/

# 查看状态
git status

# 提交
git commit -m "New package: Jeason.NovelEditor version 0.1.11"
```

## 步骤 8：推送到你的 Fork

```bash
# 推送到你的 fork
git push origin novel-editor-0.1.11
```

## 步骤 9：创建 Pull Request

### 方式 A：使用 GitHub CLI（推荐）

```bash
gh pr create \
  --repo microsoft/winget-pkgs \
  --title "New package: Jeason.NovelEditor version 0.1.11" \
  --body "Novel Editor - 一个现代化的小说编辑器

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
- Release: https://github.com/jeasoncc/novel-editor/releases/tag/desktop-v0.1.11"
```

### 方式 B：使用 GitHub 网页

1. 访问你的 fork：`https://github.com/YOUR_USERNAME/winget-pkgs`
2. 点击 "Compare & pull request" 按钮
3. 填写 PR 信息：
   - **Title:** `New package: Jeason.NovelEditor version 0.1.11`
   - **Description:** 复制上面的描述
4. 点击 "Create pull request"

## 步骤 10：等待审核

### 自动验证（几分钟）

机器人会自动检查：
- ✅ 清单格式
- ✅ SHA256 校验
- ✅ URL 可访问性
- ✅ 文件结构

### 人工审核（1-3天）

维护者会检查：
- ✅ 包信息准确性
- ✅ 描述清晰度
- ✅ 许可证正确性

### 合并

- PR 通过后会自动合并
- 几小时后包就可以使用了

## 验证安装

PR 合并后，在 Windows 上测试：

```powershell
# 搜索
winget search "Novel Editor"

# 查看信息
winget show Jeason.NovelEditor

# 安装
winget install Jeason.NovelEditor
```

## 常见问题

### Q: 我没有 Windows，怎么测试？

A: 
1. 请 Windows 用户帮忙测试
2. 或使用虚拟机
3. 或等 PR 合并后再测试

### Q: 如果 PR 被拒绝怎么办？

A: 
1. 查看机器人或维护者的反馈
2. 在同一个分支上修改文件
3. 提交并推送更新
4. PR 会自动更新

### Q: 可以删除本地的 winget-pkgs 目录吗？

A: 可以！PR 创建后就可以删除：
```bash
rm -rf /path/to/winget-pkgs
```

### Q: 如何更新版本？

A: 重复上述步骤，但使用新的版本号：
```bash
mkdir -p manifests/j/Jeason/NovelEditor/0.1.12
# 复制并更新清单文件
```

## 清理

PR 创建后，可以清理本地文件：

```bash
# 删除 winget-pkgs 目录
rm -rf /path/to/winget-pkgs

# 或者保留，下次更新时使用
```

## 完整示例

```bash
# 1. Fork（在 GitHub 网页上操作）

# 2. 克隆（使用浅克隆，更快）
git clone --depth=1 https://github.com/jeasoncc/winget-pkgs.git
cd winget-pkgs
git remote add upstream https://github.com/microsoft/winget-pkgs.git

# 3. 创建目录
mkdir -p manifests/j/Jeason/NovelEditor/0.1.11

# 4. 复制文件
cp ~/novel-editor/winget-manifests/* manifests/j/Jeason/NovelEditor/0.1.11/

# 5. 创建分支
git checkout -b novel-editor-0.1.11

# 6. 提交
git add manifests/j/Jeason/NovelEditor/
git commit -m "New package: Jeason.NovelEditor version 0.1.11"

# 7. 推送
git push origin novel-editor-0.1.11

# 8. 创建 PR（使用 gh 或网页）
gh pr create --repo microsoft/winget-pkgs \
  --title "New package: Jeason.NovelEditor version 0.1.11" \
  --body "Novel Editor - 一个现代化的小说编辑器"

# 9. 等待审核

# 10. 清理（可选）
cd ..
rm -rf winget-pkgs
```

## 提示

1. **清单文件已准备好**
   - 位置：`winget-manifests/`
   - 直接复制即可

2. **不需要 Windows**
   - 整个流程在 Linux 上完成
   - 只需要 Git 和 GitHub

3. **Fork 只需要一次**
   - 以后更新版本时可以重用

4. **保持耐心**
   - 审核需要 1-3 天
   - 这是正常的

## 相关资源

- [Winget 官方文档](https://docs.microsoft.com/windows/package-manager/)
- [winget-pkgs 仓库](https://github.com/microsoft/winget-pkgs)
- [贡献指南](https://github.com/microsoft/winget-pkgs/blob/master/CONTRIBUTING.md)

---

**记住：** 你在 Arch Linux 上可以完成整个流程！不需要 Windows。
