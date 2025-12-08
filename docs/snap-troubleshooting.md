# Snap 构建故障排查

## 常见构建错误

### 错误 1: unzip is required to install bun

**错误信息：**
```
error: unzip is required to install bun
```

**原因：**
Bun 安装脚本需要 unzip 来解压下载的文件，但构建环境中没有安装。

**解决方案：**
在 `snapcraft.yaml` 的 `build-packages` 中添加 `unzip`：

```yaml
build-packages:
  - unzip
  - curl
  - wget
  # ... 其他包
```

**状态：** ✅ 已修复

---

### 错误 2: Frontend build failed - dist directory not found

**错误信息：**
```
ERROR: Frontend build failed - dist directory not found
```

**原因：**
- Bun 安装失败
- 依赖安装失败
- 构建脚本执行失败

**解决方案：**
1. 检查 Bun 是否正确安装
2. 确保 `bun install` 成功
3. 检查 `bun run build` 的输出

**调试：**
```bash
# 在构建脚本中添加调试信息
echo "=== Checking dist directory ==="
ls -la apps/desktop/
ls -la apps/desktop/dist/ || echo "dist not found"
```

---

### 错误 3: No deb file found

**错误信息：**
```
ERROR: No deb file found
```

**原因：**
- Tauri 构建失败
- 构建目标不正确
- 权限问题

**解决方案：**
1. 检查 Rust 和 Cargo 是否正确安装
2. 确保系统依赖已安装
3. 检查构建日志

**调试：**
```bash
# 查找所有 deb 文件
find . -name "*.deb" -type f
```

---

### 错误 4: Binary not found in expected locations

**错误信息：**
```
ERROR: Binary not found in expected locations
```

**原因：**
deb 包的目录结构与预期不同。

**解决方案：**
构建脚本会自动查找并显示二进制文件位置：
```bash
find $CRAFT_PART_INSTALL -name "novel-editor" -type f
```

---

## 构建环境问题

### 问题 1: 构建超时

**症状：**
构建运行超过 2 小时后被终止。

**原因：**
- 依赖下载慢
- 编译时间过长
- 网络问题

**解决方案：**
1. 使用 `--frozen-lockfile` 避免重新解析依赖
2. 优化构建脚本
3. 减少不必要的依赖

---

### 问题 2: 网络连接失败

**症状：**
```
Failed to download ...
Connection timeout
```

**原因：**
Snap Store 构建环境的网络限制。

**解决方案：**
1. 使用镜像源（如果可能）
2. 重试构建
3. 检查 Snap Store 状态

---

### 问题 3: 架构不匹配

**症状：**
```
error: linker `cc` not found
```

**原因：**
为错误的架构构建。

**解决方案：**
在 `snapcraft.yaml` 中明确指定架构：
```yaml
architectures:
  - build-on: amd64
  - build-on: arm64
```

---

## 调试技巧

### 1. 查看完整构建日志

在 Snap Store 网站上：
1. 访问 https://snapcraft.io/novel-editor/builds
2. 点击失败的构建
3. 查看完整日志

### 2. 本地测试构建

使用 Docker 模拟 Snap Store 环境：

```bash
# 使用 Ubuntu 22.04 (core22)
docker run -it --rm -v $(pwd):/build ubuntu:22.04 bash

# 在容器内
apt update
apt install -y snapcraft
cd /build
snapcraft
```

### 3. 分步测试

将构建脚本拆分成多个步骤，逐步测试：

```bash
# 测试 Bun 安装
curl -fsSL https://bun.sh/install | bash

# 测试依赖安装
bun install

# 测试前端构建
cd apps/desktop && bun run build

# 测试 Tauri 构建
cd src-tauri && cargo tauri build
```

### 4. 添加调试输出

在构建脚本中添加更多输出：

```bash
echo "=== Current directory ==="
pwd

echo "=== Environment variables ==="
env | grep -E "(PATH|HOME|CRAFT)"

echo "=== Disk space ==="
df -h

echo "=== Memory ==="
free -h
```

---

## 优化构建时间

### 1. 使用缓存

Snap Store 会缓存某些构建步骤，确保：
- 使用 `--frozen-lockfile` 锁定依赖
- 不要在每次构建时清理缓存

### 2. 并行构建

Cargo 默认会并行编译，确保没有限制：
```bash
cargo tauri build -j $(nproc)
```

### 3. 减少依赖

检查并移除不必要的依赖：
```bash
# 分析依赖大小
bun pm ls --all

# 检查 Rust 依赖
cargo tree
```

---

## 常见问题 FAQ

### Q: 为什么本地构建成功，但 Snap Store 构建失败？

A: 可能的原因：
1. 环境差异（本地 vs Ubuntu 22.04）
2. 依赖版本不同
3. 网络环境不同
4. 权限问题

**解决：** 使用 Docker 模拟 Snap Store 环境进行测试。

---

### Q: 如何加速构建？

A: 
1. 使用 `--frozen-lockfile`
2. 减少不必要的依赖
3. 优化构建脚本
4. 使用 Snap Store 的缓存

---

### Q: 构建失败后如何重试？

A: 
1. 修复问题后推送代码
2. Snap Store 会自动重新构建
3. 或在网站上手动触发重新构建

---

### Q: 如何查看构建环境的详细信息？

A: 在构建脚本中添加：
```bash
echo "=== System info ==="
uname -a
cat /etc/os-release
```

---

## 获取帮助

如果以上方法都无法解决问题：

1. **Snapcraft 论坛**
   - https://forum.snapcraft.io/

2. **GitHub Issues**
   - 在你的仓库创建 issue
   - 附上完整的构建日志

3. **Snap Store 支持**
   - 发邮件到 snapcraft@canonical.com

---

## 成功构建的标志

构建成功时，你会看到：

```
=== Build completed successfully ===
Snapping...
Snapped novel-editor_0.1.8_amd64.snap
```

然后在 Snap Store 网站上可以看到：
- ✅ Build successful
- 可以下载 .snap 文件
- 可以发布到 channel
