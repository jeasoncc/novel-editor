# 📚 MD 文件整理总结

本文档记录了项目中所有 Markdown 文件的整理情况。

## ✅ 整理完成

所有除了 README.md 之外的 MD 文件已统一整理到 `docs/` 目录下。

## 📁 文件组织架构

```
docs/
├── project/              # 项目级别的文档
│   ├── AUR发布完成总结.md
│   ├── BUILD_ERRORS_FIXED.md
│   ├── BUILD_ERRORS_FIX.md
│   └── 构建错误修复完成.md
│
├── development/          # 开发相关文档
│   ├── GITHUB_ACTIONS_ANALYSIS.md
│   ├── GITHUB_ACTIONS_STATUS.md
│   └── packageManager错误修复完成.md
│
├── desktop/              # Desktop 应用文档
│   ├── development/      # Desktop 开发文档
│   │   ├── GitHub_Workflow_分析报告.md
│   │   └── ICON_UPDATE_SUMMARY.md
│   └── README.zh-CN.md   # Desktop 中文 README
│
└── web/                  # Web 应用文档
    └── development/      # Web 开发文档
        ├── BUILD_FIX_COMPLETE.md
        ├── BUILD_FIX_SUMMARY.md
        └── DYNAMIC_IMPORT_FIX.md
```

## 📋 保留在原位置的文件

以下文件保留在原位置，不需要移动：

### README 文件
- `README.md` - 项目根目录主 README
- `README.zh-CN.md` - 项目根目录中文 README
- `apps/desktop/README.md` - Desktop 应用 README
- `apps/web/README.md` - Web 应用 README

### 特定位置的文档
- `apps/desktop/src-tauri/icons/README.md` - 图标相关文档，保留在图标目录
- `apps/desktop/src/components/editor/plugins/__tests__/search-replace.test.md` - 测试文档，保留在测试目录

## 🔄 已移动的文件清单

### 根目录 → docs/

#### → docs/project/
- ✅ `AUR发布完成总结.md`
- ✅ `BUILD_ERRORS_FIXED.md`
- ✅ `BUILD_ERRORS_FIX.md`
- ✅ `构建错误修复完成.md`

#### → docs/development/
- ✅ `GITHUB_ACTIONS_ANALYSIS.md`
- ✅ `GITHUB_ACTIONS_STATUS.md`
- ✅ `packageManager错误修复完成.md`

### apps/desktop → docs/desktop/

#### → docs/desktop/development/
- ✅ `GitHub_Workflow_分析报告.md`
- ✅ `ICON_UPDATE_SUMMARY.md`

#### → docs/desktop/
- ✅ `README.zh-CN.md` (Desktop 中文 README)

### apps/web → docs/web/

#### → docs/web/development/
- ✅ `BUILD_FIX_COMPLETE.md`
- ✅ `BUILD_FIX_SUMMARY.md`
- ✅ `DYNAMIC_IMPORT_FIX.md`

## �� 统计信息

- **总文档数**: 179+ 个 MD 文件在 docs 目录下
- **移动的文件数**: 12 个文件从根目录和 apps 目录移动到 docs
- **保留的 README 文件**: 4 个（根目录、Desktop、Web 各一个）

## 🎯 整理原则

1. **统一管理**: 所有文档集中在 `docs/` 目录
2. **保留 README**: 各项目的 README.md 保留在原位置，方便快速查看
3. **分类清晰**: 按照项目类型和文档类型进行分类
4. **便于查找**: 使用清晰的目录结构，便于查找和维护

## 📝 后续维护

当创建新的文档时，请遵循以下规则：

1. **项目级别文档** → `docs/project/`
2. **开发相关文档** → `docs/development/`
3. **Desktop 相关文档** → `docs/desktop/` 或子目录
4. **Web 相关文档** → `docs/web/` 或子目录
5. **README 文件** → 保留在各项目根目录

## 🔗 相关文档

- [项目文档索引](./README.md)
- [Desktop 文档](../apps/desktop/README.md)
- [Web 文档](../apps/web/README.md)

---

**整理日期**: $(date +"%Y-%m-%d")
**状态**: ✅ 完成

