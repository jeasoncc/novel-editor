# Snapcraft 登录工具

用于在 Docker 中获取 Snapcraft 凭证，避免在 Arch Linux 上安装 snapd。

## 使用方法

```bash
cd scripts/snapcraft-login

# 创建输出目录
mkdir -p output

# 构建并运行
docker-compose run --rm snapcraft
```

按提示输入 Ubuntu One 账号和密码，登录成功后凭证会保存到 `output/snapcraft-credentials.txt`。

## 配置 GitHub Secret

1. 打开 GitHub 仓库 → Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. Name: `SNAPCRAFT_TOKEN`
4. Value: 粘贴 `output/snapcraft-credentials.txt` 的全部内容
5. 点击 "Add secret"

## 清理

```bash
# 删除凭证文件（安全起见）
rm -rf output/

# 删除 Docker 镜像
docker-compose down --rmi all
```
