```sh
# 创建一个builder
docker buildx create --name builder --driver docker-container
docker buildx use builder
# --platform linux/amd64 构建目标平台镜像
docker buildx build --platform linux/amd64 -t <image>:<tag> . --load
```