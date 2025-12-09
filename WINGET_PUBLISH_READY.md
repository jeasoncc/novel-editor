# Winget 发布准备完成 ✅

## 概述

所有 Winget 发布所需的文件和脚本已经准备完毕！

## 已准备的文件

### 1. Winget 清单文件

位置：`winget-manifests/`

```
winget-manifests/
├── Jeason.NovelEditor.yaml                    # 版本文件
├── Jeason.NovelEditor.installer.yaml          # 安装器文件
└── Jeason.NovelEditor.locale.zh-CN.yaml       # 本地化文件
```

**关键信息：**
- Package ID: `Jeason.NovelEditor`
- Version: `0.1.11`
- Installer URL: GitHub Release
- SHA256: `40BF5E5228AA183198DFD34F9BA48AE8A2B325EDF1EC230E4D32124257C42EDD`
- ProductCode: `{BE47635A-D137-4EDE-9215-381509E69DB9}`

### 2. 自动化脚本

**`scripts/publish-winget.sh`** - 一键发布脚本

功能：
- ✅ 自动 fork winget-pkgs 仓库
- ✅ 创建正确的目录结构
- ✅ 复制清单文件
- ✅ 创建分支和提交
- ✅ 自动创建 PR

### 3. 文档

- **`docs/winget-quick-start.md`** - 5分钟快速发布指南
- **`docs/winget-publish-guide.md`** - 详细发布指南（已存在）
- **`WINGET_PUBLISH_READY.md`** - 本文档

## 发布方法

### 方法 1：使用自动化脚本（推荐）⭐

```bash
./scripts/publish-winget.sh
```

脚本会自动：
1. 检查必要的工具（gh, git）
2. Fork winget-pkgs 仓库（如果需要）
3. 创建正确的目录结构
4. 复制清单文件
5. 创建分支并提交
6. 创建 PR 到 microsoft/winget-pkgs

### 方法 2：手动发布

#### 步骤 1：Fork 仓库

访问并 Fork：
https://github.com/microsoft/winget-pkgs

#### 步骤 2：克隆你的 Fork

```bash
git clone https://github.com/YOUR_USERNAME/winget-pkgs.git
cd winget-pkgs
```

#### 步骤 3：创建目录并复制文件

```bash
# 创建目录
mkdir -p manifests/j/Jeason/NovelEditor/0.1.11

# 复制清单文件
cp /path/to/novel-editor/winget-manifests/* manifests/j/Jeason/NovelEditor/0.1.11/
```

#### 步骤 4：提交 PR

```bash
# 创建分支
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

## 审核流程

### 1. 自动验证（几分钟）

机器人会自动检查：
- ✅ 清单格式正确
- ✅ SHA256 匹配
- ✅ URL 可访问
- ✅ 文件结构正确

### 2. 人工审核（1-3天）

维护者会检查：
- ✅ 包信息准确
- ✅ 描述清晰
- ✅ 许可证正确
- ✅ 没有恶意软件

### 3. 合并发布

- PR 合并后，包会在几小时内可用
- 用户可以使用 `winget install Jeason.NovelEditor` 安装

## 安装验证

PR 合并后，用户可以：

### 搜索包

```powershell
winget search "Novel Editor"
```

### 查看信息

```powershell
winget show Jeason.NovelEditor
```

### 安装

```powershell
winget install Jeason.NovelEditor
```

### 升级

```powershell
winget upgrade Jeason.NovelEditor
```

## 清单文件详解

### Jeason.NovelEditor.yaml

```yaml
PackageIdentifier: Jeason.NovelEditor  # 唯一标识符
PackageVersion: 0.1.11                 # 版本号
DefaultLocale: zh-CN                   # 默认语言
ManifestType: version                  # 清单类型
ManifestVersion: 1.5.0                 # 清单格式版本
```

### Jeason.NovelEditor.installer.yaml

```yaml
PackageIdentifier: Jeason.NovelEditor
PackageVersion: 0.1.11
InstallerType: wix                     # MSI 使用 wix
Scope: machine                         # 安装范围（machine/user）
Installers:
- Architecture: x64                    # 架构
  InstallerUrl: https://...            # 下载 URL
  InstallerSha256: 40BF5E...           # SHA256 校验
  ProductCode: '{BE476...}'            # MSI ProductCode
```

### Jeason.NovelEditor.locale.zh-CN.yaml

```yaml
PackageIdentifier: Jeason.NovelEditor
PackageVersion: 0.1.11
PackageLocale: zh-CN                   # 语言
Publisher: Lotus                       # 发布者
PackageName: Novel Editor              # 包名
ShortDescription: 一个现代化的小说编辑器  # 简短描述
Description: |-                        # 详细描述
  Novel Editor 是一个功能强大的小说编辑器...
Tags:                                  # 标签
- editor
- novel
- writing
```

## 更新版本

当发布新版本时：

### 1. 更新清单文件

```bash
# 更新版本号
sed -i 's/0.1.11/0.1.12/g' winget-manifests/*.yaml

# 更新 SHA256
# 下载新的 MSI 并计算 SHA256
sha256sum novel-editor_0.1.12_x64_zh-CN.msi

# 更新 installer.yaml 中的 SHA256 和 URL
```

### 2. 提交新的 PR

```bash
./scripts/publish-winget.sh
```

或手动创建新的版本目录：
```bash
mkdir -p manifests/j/Jeason/NovelEditor/0.1.12
cp winget-manifests/* manifests/j/Jeason/NovelEditor/0.1.12/
```

## 常见问题

### Q: 为什么需要 ProductCode？

A: ProductCode 是 MSI 的唯一标识符，Winget 用它来：
- 检测是否已安装
- 执行升级
- 执行卸载

### Q: SHA256 不匹配怎么办？

A: 
1. 重新下载 MSI 文件
2. 重新计算 SHA256：`sha256sum file.msi`
3. 更新 installer.yaml

### Q: 审核被拒绝怎么办？

A: 
1. 查看机器人或维护者的反馈
2. 修改清单文件
3. 推送更新到同一个 PR 分支

### Q: 可以发布 beta 版本吗？

A: 可以，但建议：
- 使用不同的 Package ID（如 `Jeason.NovelEditor.Beta`）
- 或在描述中明确标注

### Q: 支持多语言吗？

A: 支持！创建额外的 locale 文件：
- `Jeason.NovelEditor.locale.en-US.yaml`
- `Jeason.NovelEditor.locale.ja-JP.yaml`

## 发布后的推广

### 更新 README

添加 Winget 安装说明：

```markdown
## 安装

### Windows

**使用 Winget（推荐）：**
\`\`\`powershell
winget install Jeason.NovelEditor
\`\`\`

**直接下载：**
[下载 Windows 安装包](https://github.com/jeasoncc/novel-editor/releases/latest)
```

### 社交媒体

发布消息：
- ✅ 知乎
- ✅ V2EX
- ✅ Reddit
- ✅ Twitter/X

示例文案：
> 🎉 Novel Editor 现已上架 Windows Package Manager (Winget)！
> 
> 一键安装：`winget install Jeason.NovelEditor`
> 
> 功能强大的小说编辑器，支持 Markdown、章节管理、角色管理等。
> 
> GitHub: https://github.com/jeasoncc/novel-editor

## 监控数据

### Winget 统计

Winget 不提供公开的下载统计，但可以通过以下方式估算：

1. **GitHub Release 下载量**
   - 查看 MSI 文件的下载次数

2. **GitHub Stars 增长**
   - 监控 Stars 数量变化

3. **Issue 和 PR**
   - 用户反馈数量

### 分析工具

- GitHub Insights
- Google Analytics（如果有网站）
- 社交媒体分析

## 下一步

### 立即行动

1. ✅ 运行 `./scripts/publish-winget.sh`
2. ✅ 等待 PR 审核
3. ✅ 更新 README

### 本周完成

4. ✅ PR 合并后验证安装
5. ✅ 开始推广
6. ✅ 收集用户反馈

### 持续优化

7. ✅ 监控下载量和反馈
8. ✅ 定期更新版本
9. ✅ 改进产品功能

## 相关资源

### 官方文档

- [Winget 官方文档](https://docs.microsoft.com/windows/package-manager/)
- [winget-pkgs 仓库](https://github.com/microsoft/winget-pkgs)
- [清单规范](https://github.com/microsoft/winget-pkgs/tree/master/doc)
- [贡献指南](https://github.com/microsoft/winget-pkgs/blob/master/CONTRIBUTING.md)

### 工具

- [winget-create](https://github.com/microsoft/winget-create) - 清单生成工具
- [winget-pkgs-automation](https://github.com/vedantmgoyal2009/winget-pkgs-automation) - 自动化工具

### 社区

- [Winget Discord](https://discord.gg/microsoft)
- [GitHub Discussions](https://github.com/microsoft/winget-cli/discussions)

## 总结

**Winget 发布准备完成！** 🎉

**已完成：**
- ✅ 创建了完整的清单文件
- ✅ 提取了 MSI 的 ProductCode 和 SHA256
- ✅ 创建了自动化发布脚本
- ✅ 编写了详细的文档

**下一步：**
1. 运行 `./scripts/publish-winget.sh` 发布
2. 等待审核（1-3天）
3. 开始推广

**记住：**
> Winget 是 Windows 用户的首选安装方式
> 
> 免费、官方、自动更新
> 
> 投入时间值得！

---

**准备日期：** 2024-12-09
**版本：** 0.1.11
**状态：** ✅ 准备就绪
