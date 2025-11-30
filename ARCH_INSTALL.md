# Arch Linux 安装指南

## 🎯 推荐方法

### 方法 1: 使用 PKGBUILD（推荐）

这是 Arch Linux 的标准方式，最简单且符合系统规范。

#### 步骤：

1. **安装依赖**
```bash
sudo pacman -S webkit2gtk gtk3 libayatana-appindicator rust nodejs npm git
```

2. **构建并安装**
```bash
# 在项目根目录
makepkg -si
```

这会：
- 自动安装依赖
- 构建应用
- 安装到系统
- 创建桌面快捷方式

3. **运行**
```bash
novel-editor
```

或从应用菜单启动。

4. **卸载**
```bash
sudo pacman -R novel-editor
```

---

### 方法 2: 直接运行二进制文件

如果你只想快速测试，不想安装到系统：

```bash
# 构建
npm run tauri build

# 直接运行
./src-tauri/target/release/novel-editor
```

---

### 方法 3: 创建符号链接（开发模式）

适合开发时使用：

```bash
# 构建
npm run tauri build

# 创建符号链接
sudo ln -s "$(pwd)/src-tauri/target/release/novel-editor" /usr/local/bin/novel-editor

# 运行
novel-editor
```

---

## 📦 发布到 AUR

如果你想让其他 Arch 用户也能使用，可以发布到 AUR：

### 1. 创建 AUR 仓库

```bash
# 克隆 AUR 仓库模板
git clone ssh://aur@aur.archlinux.org/novel-editor.git aur-novel-editor
cd aur-novel-editor

# 复制 PKGBUILD
cp ../PKGBUILD .

# 生成 .SRCINFO
makepkg --printsrcinfo > .SRCINFO

# 提交到 AUR
git add PKGBUILD .SRCINFO
git commit -m "Initial commit: novel-editor 0.1.0"
git push
```

### 2. 用户安装（从 AUR）

使用 AUR helper：

```bash
# 使用 yay
yay -S novel-editor

# 使用 paru
paru -S novel-editor

# 手动安装
git clone https://aur.archlinux.org/novel-editor.git
cd novel-editor
makepkg -si
```

---

## 🔧 优化的 PKGBUILD（使用 Git）

如果你的项目在 GitHub 上，可以使用这个版本：

```bash
# PKGBUILD-git
pkgname=novel-editor-git
pkgver=r123.abc1234
pkgrel=1
pkgdesc="现代化的小说编辑器 (Git 版本)"
arch=('x86_64')
url="https://github.com/yourusername/novel-editor"
license=('MIT')
depends=('webkit2gtk' 'gtk3' 'libayatana-appindicator')
makedepends=('rust' 'cargo' 'nodejs' 'npm' 'git')
provides=('novel-editor')
conflicts=('novel-editor')
source=("git+https://github.com/yourusername/novel-editor.git")
sha256sums=('SKIP')

pkgver() {
    cd "$srcdir/novel-editor"
    printf "r%s.%s" "$(git rev-list --count HEAD)" "$(git rev-parse --short HEAD)"
}

build() {
    cd "$srcdir/novel-editor"
    npm install
    npm run build
    cd src-tauri
    cargo build --release
}

package() {
    cd "$srcdir/novel-editor"
    install -Dm755 "src-tauri/target/release/novel-editor" \
        "$pkgdir/usr/bin/novel-editor"
    install -Dm644 "src-tauri/novel-editor.desktop" \
        "$pkgdir/usr/share/applications/novel-editor.desktop"
    for size in 32 128; do
        install -Dm644 "src-tauri/icons/${size}x${size}.png" \
            "$pkgdir/usr/share/icons/hicolor/${size}x${size}/apps/novel-editor.png"
    done
    install -Dm644 "LICENSE" \
        "$pkgdir/usr/share/licenses/$pkgname/LICENSE"
}
```

---

## 🚀 快速开始（推荐流程）

```bash
# 1. 安装系统依赖
sudo pacman -S webkit2gtk gtk3 libayatana-appindicator rust nodejs npm

# 2. 构建并安装
makepkg -si

# 3. 运行
novel-editor

# 完成！
```

---

## 🔍 故障排除

### 问题 1: 缺少依赖

```bash
# 安装所有可能需要的依赖
sudo pacman -S base-devel webkit2gtk gtk3 libayatana-appindicator \
    rust cargo nodejs npm git openssl
```

### 问题 2: Rust 版本太旧

```bash
# 更新 Rust
rustup update stable
```

### 问题 3: Node.js 版本太旧

```bash
# 安装 nvm
yay -S nvm

# 安装最新 LTS
nvm install --lts
nvm use --lts
```

### 问题 4: 构建失败

```bash
# 清理并重新构建
rm -rf node_modules src-tauri/target
npm install
makepkg -sif  # -f 强制重新构建
```

---

## 📊 性能优化

### 使用 mold 链接器（更快的构建）

```bash
# 安装 mold
sudo pacman -S mold

# 配置 Cargo 使用 mold
mkdir -p ~/.cargo
cat >> ~/.cargo/config.toml << EOF
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=mold"]
EOF

# 重新构建（速度提升 2-3 倍）
makepkg -sif
```

### 使用 ccache（缓存编译）

```bash
# 安装 ccache
sudo pacman -S ccache

# 配置
export PATH="/usr/lib/ccache/bin:$PATH"

# 重新构建
makepkg -si
```

---

## 🎨 桌面集成

### 自定义图标

如果你想使用自定义图标：

```bash
# 复制图标到用户目录
mkdir -p ~/.local/share/icons/hicolor/128x128/apps
cp /path/to/your/icon.png ~/.local/share/icons/hicolor/128x128/apps/novel-editor.png

# 更新图标缓存
gtk-update-icon-cache ~/.local/share/icons/hicolor
```

### 自定义桌面文件

```bash
# 编辑桌面文件
cp /usr/share/applications/novel-editor.desktop ~/.local/share/applications/
nano ~/.local/share/applications/novel-editor.desktop

# 更新桌面数据库
update-desktop-database ~/.local/share/applications
```

---

## 📦 打包建议

### 分离调试符号

```bash
# 在 PKGBUILD 中添加
options=('strip' 'debug')

# 这会自动创建 novel-editor-debug 包
```

### 优化二进制大小

```bash
# 在 src-tauri/Cargo.toml 中添加
[profile.release]
opt-level = "z"     # 优化大小
lto = true          # 链接时优化
codegen-units = 1   # 更好的优化
strip = true        # 移除符号
```

---

## 🌟 推荐工具

### AUR Helper

```bash
# yay（推荐）
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

# paru（Rust 编写，更快）
sudo pacman -S --needed git base-devel
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
```

### 开发工具

```bash
# Rust 开发工具
rustup component add rust-analyzer rustfmt clippy

# Node.js 开发工具
npm install -g npm-check-updates

# Tauri CLI
cargo install tauri-cli
```

---

## 📝 维护

### 更新应用

```bash
# 拉取最新代码
git pull

# 重新构建并安装
makepkg -sif
```

### 清理旧版本

```bash
# 清理构建缓存
rm -rf src-tauri/target/release

# 清理 npm 缓存
npm cache clean --force

# 清理 Cargo 缓存
cargo clean
```

---

## 🎯 总结

**最简单的方式**：
```bash
sudo pacman -S webkit2gtk gtk3 libayatana-appindicator rust nodejs npm
makepkg -si
novel-editor
```

**最快的方式**（已有依赖）：
```bash
makepkg -si
```

**开发模式**：
```bash
npm run tauri dev
```

---

## 📚 相关资源

- [Arch Wiki - PKGBUILD](https://wiki.archlinux.org/title/PKGBUILD)
- [Arch Wiki - AUR](https://wiki.archlinux.org/title/Arch_User_Repository)
- [Tauri 文档](https://tauri.app/)
- [Rust 文档](https://www.rust-lang.org/)

---

**享受你的小说编辑器！** 📝✨

