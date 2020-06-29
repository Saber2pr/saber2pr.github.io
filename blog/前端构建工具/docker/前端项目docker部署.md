1. 编写 Dockerfile ，示例：

```dockerfile
# node
FROM node:10-alpine

# mirror
RUN echo 'http://mirrors.aliyun.com/alpine/v3.5/main' > /etc/apk/repositories

WORKDIR /app
COPY . /app

# npm
RUN npm config set registry 'https://registry.npm.taobao.org'
RUN npm i
RUN npm run build

# script
CMD [ "npm", "start" ]
```

2. 执行镜像构建命令：

```bash
docker image build -t myimage:v1 .
```

> 注意最后有一个点不能省略

3. 运行镜像

```bash
docker run -d -p 3000:3000 -it myimage:v1
```

> -d表示后台运行. 容器内 3000 端口映射到容器外 3000 端口.

4. 运行容器

> 运行指定 CONTAINER ID 的容器

```bash
docker start 684f23ec4ea9
```

5. 列出已存在的镜像

```bash
docker images
```

6. 删除镜像：

> 删除指定 IMAGE ID 的镜像

```bash
docker rmi 597d72732244
```

7. 查看已存在的容器

```bash
docker ps -a
```

> 不加-a只列出运行中的容器

8. 删除容器

> 删除指定 CONTAINER ID 的容器

```bash
docker rm dcf9dfaf355d
```

---

# docker容器更新

1. 进入容器bash

```bash
docker exec -it 4637c19a2d3a sh
```
或者
```bash
docker exec -it 4637c19a2d3a /bin/sh
```
或者
```bash
docker exec -it 4637c19a2d3a bash
```
或者
```bash
docker exec -it 4637c19a2d3a /bin/bash
```

> 输入exit退出容器

2. 在容器内修改

例如git更新：
```bash
git pull
```

> 容器修改后即更新

---

# docker 国内加速镜像配置

1. 创建 docker 配置文件夹

```bash
sudo mkdir -p /etc/docker
```

2. 创建 docker 配置文件

```bash
sudo vi /etc/docker/daemon.json
```

写入以下内容

```bash
{
"registry-mirrors": ["http://hub-mirror.c.163.com"]
}
```

> 网易 docker 加速镜像

3. 重启 daemon

```bash
sudo systemctl daemon-reload
```

4. 重启 docker

```bash
sudo systemctl restart docker
```
