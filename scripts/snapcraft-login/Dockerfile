# 使用官方 snapcraft 镜像，更快更稳定
FROM snapcore/snapcraft:latest

# 创建输出目录
RUN mkdir -p /output

WORKDIR /workspace

# 启动脚本
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
