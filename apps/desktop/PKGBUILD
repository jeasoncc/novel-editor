# Maintainer: Your Name <your.email@example.com>
pkgname=novel-editor
pkgver=0.1.0
pkgrel=1
pkgdesc="现代化的小说编辑器 - 基于 Tauri 和 React"
arch=('x86_64')
url="https://github.com/yourusername/novel-editor"
license=('MIT')
depends=(
    'webkit2gtk'
    'gtk3'
    'libayatana-appindicator'
)
makedepends=(
    'rust'
    'cargo'
    'nodejs'
    'npm'
    'git'
)
source=()
sha256sums=()

build() {
    cd "$srcdir/../.."
    
    # 安装前端依赖
    npm install
    
    # 构建前端
    npm run build
    
    # 构建 Tauri 应用
    cd src-tauri
    cargo build --release
}

package() {
    cd "$srcdir/../.."
    
    # 安装二进制文件
    install -Dm755 "src-tauri/target/release/novel-editor" \
        "$pkgdir/usr/bin/novel-editor"
    
    # 安装桌面文件
    install -Dm644 "src-tauri/novel-editor.desktop" \
        "$pkgdir/usr/share/applications/novel-editor.desktop"
    
    # 安装图标
    for size in 32 128; do
        install -Dm644 "src-tauri/icons/${size}x${size}.png" \
            "$pkgdir/usr/share/icons/hicolor/${size}x${size}/apps/novel-editor.png"
    done
    
    # 安装许可证
    install -Dm644 "LICENSE" \
        "$pkgdir/usr/share/licenses/$pkgname/LICENSE"
}
