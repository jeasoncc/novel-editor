# Novel Editor 图标文件

本目录包含 Novel Editor 桌面应用的所有图标文件。

## 📋 文件说明

### 必需图标

- `32x32.png` - 32x32 像素 PNG 图标
- `128x128.png` - 128x128 像素 PNG 图标  
- `128x128@2x.png` - 256x256 像素 PNG 图标（高 DPI）
- `icon.png` - 512x512 像素主图标
- `icon.ico` - Windows 图标文件（多尺寸）
- `icon.icns` - macOS 图标文件（需要生成）

### 源文件

- `new-icon.png` - 新图标源文件（960x960 像素）
- `icon.svg` - 旧 SVG 源文件（已弃用）

## 🎨 图标设计

图标采用蓝色背景，白色书本和金色笔的组合，代表小说编辑器的核心功能。

## 🔧 生成图标

### 自动生成所有图标

```bash
cd apps/desktop/src-tauri/icons
./generate-icons.sh
```

### 手动生成

#### 从 PNG 生成各种尺寸（使用 ImageMagick）

```bash
# 生成 32x32
magick new-icon.png -resize 32x32 32x32.png

# 生成 128x128
magick new-icon.png -resize 128x128 128x128.png

# 生成 256x256 (128x128@2x)
magick new-icon.png -resize 256x256 128x128@2x.png

# 生成 512x512
magick new-icon.png -resize 512x512 icon.png
```

#### 生成 ICO 文件（Windows）

```bash
magick icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

#### 生成 ICNS 文件（macOS）

**在 macOS 上执行：**

```bash
# 创建图标集目录
mkdir -p icon.iconset

# 复制所需尺寸
cp 32x32.png icon.iconset/icon_16x16.png
cp 32x32.png icon.iconset/icon_16x16@2x.png
cp 128x128.png icon.iconset/icon_32x32.png
cp 128x128@2x.png icon.iconset/icon_32x32@2x.png
cp 128x128.png icon.iconset/icon_128x128.png
cp 128x128@2x.png icon.iconset/icon_128x128@2x.png
cp icon.png icon.iconset/icon_256x256.png
cp icon.png icon.iconset/icon_256x256@2x.png
cp icon.png icon.iconset/icon_512x512.png
cp icon.png icon.iconset/icon_512x512@2x.png

# 转换为 ICNS
iconutil -c icns icon.iconset

# 清理临时目录
rm -rf icon.iconset
```

**或使用在线工具：**
- https://convertio.co/png-icns/
- https://cloudconvert.com/png-to-icns

### 生成 Windows Store 图标

```bash
# 生成各种 Windows Store 尺寸
magick new-icon.png -resize 30x30 Square30x30Logo.png
magick new-icon.png -resize 44x44 Square44x44Logo.png
magick new-icon.png -resize 71x71 Square71x71Logo.png
magick new-icon.png -resize 89x89 Square89x89Logo.png
magick new-icon.png -resize 107x107 Square107x107Logo.png
magick new-icon.png -resize 142x142 Square142x142Logo.png
magick new-icon.png -resize 150x150 Square150x150Logo.png
magick new-icon.png -resize 284x284 Square284x284Logo.png
magick new-icon.png -resize 310x310 Square310x310Logo.png
magick new-icon.png -resize 50x50 StoreLogo.png
```

## ✅ 验证

确保所有文件都已生成：

```bash
ls -lh 32x32.png 128x128.png 128x128@2x.png icon.png icon.ico icon.icns
```

## 📝 更新图标

1. 替换 `new-icon.png` 文件（建议使用 960x960 像素或更高分辨率）
2. 运行 `./generate-icons.sh` 重新生成所有尺寸
3. 重新构建应用查看效果

## 📋 备份

旧图标文件已备份到 `backup-old-icons/` 目录中。

## 🔗 相关文档

- [Tauri 图标指南](https://tauri.app/v1/guides/building/icons)
- [ImageMagick 文档](https://imagemagick.org/script/command-line-processing.php)

