# 使用独立 releases 分支存储安装包

## 为什么不用 main 分支？

❌ **不要在 main 分支存储安装包**：
- 会让仓库体积快速膨胀
- 克隆速度变慢
- Git 不适合二进制文件

## 推荐方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **GitHub Releases** | 专业、不占空间、有统计 | 需要创建 tag | ⭐⭐⭐⭐⭐ |
| **Artifacts** | 临时存储、适合测试 | 90天过期 | ⭐⭐⭐⭐ |
| **releases 分支** | 在 Git 中、可追踪 | 仍会增大仓库 | ⭐⭐⭐ |
| **gh-pages 分支** | 可通过 URL 访问 | 不是设计用途 | ⭐⭐ |
| **main 分支** | 无 | 严重膨胀仓库 | ❌ |

## 如果必须用 Git 分支

### 创建独立的 releases 分支

```bash
# 创建孤立分支（没有历史）
git checkout --orphan releases
git rm -rf .

# 创建 README
cat > README.md << 'EOF'
# Novel Editor Releases

此分支仅用于存储发布的安装包。

## 下载

请访问 [Releases 页面](https://github.com/jeasoncc/novel-editor/releases) 下载最新版本。

## 文件结构

```
releases/
├── v0.1.15/
│   ├── novel-editor_0.1.15_x64.msix
│   ├── novel-editor_0.1.15_x64_zh-CN.msi
│   └── SHA256SUMS
├── v0.1.14/
│   └── ...
└── latest -> v0.1.15
```
EOF

git add README.md
git commit -m "Initial releases branch"
git push origin releases
```

### 自动上传到 releases 分支

修改工作流：

```yaml
# 上传到 releases 分支
- name: Upload to releases branch
  if: startsWith(github.ref, 'refs/tags/')
  shell: bash
  run: |
    # 获取版本号
    VERSION=$(cat apps/desktop/src-tauri/tauri.conf.json | jq -r '.version')
    
    # 克隆 releases 分支
    git clone --branch releases --depth 1 git@github.com:jeasoncc/novel-editor.git releases-branch
    
    # 创建版本目录
    mkdir -p "releases-branch/v${VERSION}"
    
    # 复制文件
    cp *.msix "releases-branch/v${VERSION}/"
    cp *.msi "releases-branch/v${VERSION}/" 2>/dev/null || true
    
    # 生成 SHA256
    cd "releases-branch/v${VERSION}"
    sha256sum * > SHA256SUMS
    cd ../..
    
    # 更新 latest 链接
    cd releases-branch
    rm -f latest
    ln -s "v${VERSION}" latest
    
    # 提交
    git config user.name "github-actions[bot]"
    git config user.email "github-actions[bot]@users.noreply.github.com"
    git add .
    git commit -m "Release v${VERSION}"
    git push
```

## 使用 Git LFS（大文件存储）

如果必须在 Git 中存储大文件：

### 安装 Git LFS

```bash
# Ubuntu/Debian
sudo apt-get install git-lfs

# macOS
brew install git-lfs

# 初始化
git lfs install
```

### 配置 LFS

```bash
# 跟踪 MSIX 和 MSI 文件
git lfs track "*.msix"
git lfs track "*.msi"
git lfs track "*.exe"

# 提交 .gitattributes
git add .gitattributes
git commit -m "Add Git LFS tracking"
```

### 优点
- ✅ Git 仓库保持小巧
- ✅ 大文件存储在 LFS 服务器
- ✅ 克隆时可选择不下载大文件

### 缺点
- ❌ GitHub LFS 有配额限制（1GB 免费）
- ❌ 超出配额需要付费
- ❌ 增加复杂度

## 最佳实践建议

### ✅ 推荐：使用 GitHub Releases

**你的工作流已经配置好了！**

```bash
# 查看 releases
gh release list

# 下载最新版本
gh release download desktop-v0.1.15

# 用户访问
https://github.com/jeasoncc/novel-editor/releases
```

### 文件组织

在 README.md 中添加下载链接：

```markdown
## 下载

### Windows
- [MSIX 包](https://github.com/jeasoncc/novel-editor/releases/latest/download/novel-editor_x64.msix) - Microsoft Store 格式
- [MSI 安装包](https://github.com/jeasoncc/novel-editor/releases/latest/download/novel-editor_x64_zh-CN.msi) - 传统安装程序

### Linux
- [AppImage](https://github.com/jeasoncc/novel-editor/releases/latest/download/novel-editor_amd64.AppImage)
- [DEB 包](https://github.com/jeasoncc/novel-editor/releases/latest/download/novel-editor_amd64.deb)

### 所有版本
查看 [Releases 页面](https://github.com/jeasoncc/novel-editor/releases) 获取所有版本。
```

## 总结

| 需求 | 推荐方案 |
|------|----------|
| 正式发布 | ⭐ GitHub Releases |
| 测试版本 | GitHub Actions Artifacts |
| 必须用 Git | releases 分支 + Git LFS |
| **不要使用** | ❌ main 分支 |

**你的当前配置已经是最佳实践！** 继续使用 GitHub Releases 即可。
