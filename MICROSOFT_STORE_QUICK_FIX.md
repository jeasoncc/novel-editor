# 🚑 Microsoft Store 审核失败快速修复

## ❌ 问题

你的应用审核失败，原因是：**Code sign check 失败**

错误信息：
> Your app does not have a digital signature which violates Microsoft Store Policy 10.2.9

## ✅ 解决方案

**不要直接上传 EXE 文件！** 使用 MSIX 格式，Microsoft Store 会自动签名。

## 🚀 快速修复步骤

### 方法 A: 使用自动化脚本（推荐）

#### 1. 在 Windows 上运行构建脚本

```powershell
# 打开 PowerShell
cd your-project-directory

# 运行构建脚本
.\scripts\build-msix.ps1 -Version "0.1.6"
```

#### 2. 脚本会自动：
- ✅ 构建 Tauri 应用
- ✅ 创建 MSIX 包
- ✅ 生成应用清单
- ✅ 打包所有文件

#### 3. 上传到 Microsoft Store

1. 登录 [Partner Center](https://partner.microsoft.com/dashboard)
2. 找到你的应用
3. 创建新的提交
4. 上传生成的 `NovelEditor_0.1.6.msix` 文件
5. 填写应用信息
6. 提交审核

### 方法 B: 使用 MSIX Packaging Tool（如果脚本失败）

#### 1. 安装 MSIX Packaging Tool

从 Microsoft Store 下载：
https://www.microsoft.com/store/productId/9N5LW3JBCXKF

#### 2. 构建你的应用

```bash
cd apps/desktop
bun run tauri build
```

#### 3. 使用 MSIX Packaging Tool

1. 打开 MSIX Packaging Tool
2. 选择 "Application package"
3. 选择 "Create package on this computer"
4. 选择你的 MSI 或 EXE 文件：
   - MSI: `apps/desktop/src-tauri/target/release/bundle/msi/novel-editor_0.1.6_x64_en-US.msi`
   - EXE: `apps/desktop/src-tauri/target/release/bundle/nsis/novel-editor_0.1.6_x64-setup.exe`

5. 填写包信息：
   - **Package name**: NovelEditor
   - **Publisher**: CN=YourName
   - **Version**: 0.1.6.0
   - **Package display name**: 小说编辑器
   - **Publisher display name**: Your Name

6. 选择安装位置（默认即可）

7. 完成打包

8. 保存 `.msix` 文件

#### 4. 上传到 Microsoft Store

同方法 A 的步骤 3

## 📋 必需的应用信息

在 Partner Center 中，确保填写：

### 基本信息
- ✅ 应用名称：小说编辑器 / Novel Editor
- ✅ 应用描述（中文和英文）
- ✅ 应用类别：生产力工具
- ✅ 版本号：0.1.6.0

### 应用资源
- ✅ 应用图标（已包含在 MSIX 中）
- ✅ 应用截图（至少 1 张，推荐 4-5 张）
  - 尺寸：1366x768 或更高
  - 格式：PNG 或 JPG
  - 展示主要功能

### 隐私政策
- ✅ 隐私政策 URL（必需）
  - 你已经有了：`PRIVACY.md`
  - 需要发布到网站上，例如：
    - GitHub Pages: `https://jeasoncc.github.io/novel-editor/privacy`
    - 或你的网站

### 支持信息
- ✅ 支持邮箱：xiaomiquan@aliyun.com
- ✅ 支持网站：https://github.com/jeasoncc/novel-editor

## 🎯 应用描述示例

### 中文描述

```
小说编辑器 - 专为小说创作者设计的现代化写作工具

【核心功能】
✨ 大纲管理 - 清晰的章节结构，支持拖拽排序
👥 角色管理 - 详细的角色档案，关系图谱
🎬 场景编辑 - 场景描述和时间线管理
📝 富文本编辑 - 强大的编辑器，支持 Markdown
💾 本地存储 - 数据完全本地化，保护隐私
🎨 主题切换 - 多种主题，护眼模式

【适用人群】
- 网络小说作者
- 传统文学创作者
- 剧本编剧
- 故事策划

【特色】
- 完全离线使用
- 数据本地存储
- 无需注册登录
- 免费使用
```

### English Description

```
Novel Editor - A Modern Writing Tool for Novel Writers

【Key Features】
✨ Outline Management - Clear chapter structure with drag-and-drop
👥 Character Management - Detailed character profiles and relationship maps
🎬 Scene Editing - Scene descriptions and timeline management
📝 Rich Text Editor - Powerful editor with Markdown support
💾 Local Storage - All data stored locally for privacy
🎨 Theme Switching - Multiple themes with eye-care mode

【Target Users】
- Web novel authors
- Traditional literature writers
- Screenwriters
- Story planners

【Highlights】
- Fully offline
- Local data storage
- No registration required
- Free to use
```

## 📸 截图建议

准备 4-5 张截图，展示：

1. **主界面** - 展示整体布局
2. **大纲管理** - 展示章节结构
3. **角色管理** - 展示角色档案
4. **编辑器** - 展示写作界面
5. **设置界面** - 展示主题和配置

截图要求：
- 尺寸：1366x768 或更高
- 格式：PNG（推荐）或 JPG
- 清晰度：高清
- 内容：展示实际功能，不要空白

## 🔍 审核检查清单

提交前确认：

### 技术要求
- [x] 使用 MSIX 格式（不是 EXE）
- [x] 版本号格式正确（x.x.x.x）
- [x] 应用可以正常安装和运行
- [x] 应用可以正常卸载

### 内容要求
- [ ] 应用名称和描述准确
- [ ] 提供隐私政策链接
- [ ] 提供支持联系方式
- [ ] 上传应用截图
- [ ] 应用分类正确

### 政策合规
- [x] 应用功能符合描述
- [x] 没有恶意代码
- [x] 尊重用户隐私
- [x] 没有误导性内容

## ⚠️ 常见错误

### 1. 直接上传 EXE
❌ **错误**: 上传 `.exe` 文件
✅ **正确**: 上传 `.msix` 文件

### 2. 缺少隐私政策
❌ **错误**: 没有提供隐私政策链接
✅ **正确**: 提供有效的隐私政策 URL

### 3. 版本号格式错误
❌ **错误**: 版本号 `0.1.6`
✅ **正确**: 版本号 `0.1.6.0`

### 4. 缺少截图
❌ **错误**: 没有上传截图
✅ **正确**: 上传 4-5 张高质量截图

## 💡 提示

### 关于代码签名

- ✅ MSIX 格式会被 Microsoft Store **自动签名**
- ✅ 不需要购买代码签名证书
- ✅ 不需要手动签名

### 关于审核时间

- 通常 1-3 个工作日
- 复杂应用可能需要更长时间
- 可以在 Partner Center 查看审核状态

### 关于更新

- 后续更新也使用 MSIX 格式
- 版本号必须递增
- 用户会自动收到更新通知

## 🔗 相关资源

- **详细指南**: [docs/microsoft-store-guide.md](docs/microsoft-store-guide.md)
- **Partner Center**: https://partner.microsoft.com/dashboard
- **MSIX Packaging Tool**: https://www.microsoft.com/store/productId/9N5LW3JBCXKF
- **Microsoft Store 政策**: https://docs.microsoft.com/en-us/windows/uwp/publish/store-policies

## 🆘 需要帮助？

如果遇到问题：

1. 查看 [详细指南](docs/microsoft-store-guide.md)
2. 检查 [Partner Center 文档](https://docs.microsoft.com/en-us/windows/uwp/publish/)
3. 联系 [Microsoft Store 支持](https://developer.microsoft.com/en-us/microsoft-store/support)

---

按照这个指南操作，你的应用应该能够通过审核！🎉
