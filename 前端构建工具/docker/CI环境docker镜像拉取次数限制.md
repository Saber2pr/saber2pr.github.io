> 2020 年 11 月20 日，Docker Hub 基于个人IP 地址对匿名和免费认证的用户进行了镜像拉取次数的限制。对于匿名用户，限制设置为每个IP 地址每6 小时100 次拉取。 对于经过身份验证的用户，每6 小时200 次拉取。

一般在公司内部使用的 CI/CD 环境，内部的 dockerconfig.json 即 docker账户 为公司的账号，公司每个人在 CI 上构建镜像时，都是以同一个账号从 dockerhub 上拉取镜像，100/200次显然是不够的。大多数公司会使用私有docker镜像源来解决拉取频率限制的问题，如 harbor，将docker官方镜像源的镜像同步到私有harbor上，然后在 CI 中拉取私有harbor的镜像就可以不受次数限制了。

### 将docker官方镜像源推送到私有docker源

例如，先举例一个 dockerfile

```dockerfile
FROM node:lts-buster

WORKDIR /app
COPY . /app

RUN yarn install --network-timeout 600000
RUN yarn build
```

再构建200次后，再构建在CI中将会提示 429 Too Many Requests - Server message: toomanyrequests: You have reached your pull rate limit

这时需要将 `FROM node:lts-buster` 改为从私有镜像源拉取，但私有镜像源可能没有这个镜像，这时可以手动构建一个push到私有镜像源:

编写镜像文件，只需要写一行 FROM + 你想要的基础镜像

```dockerfile
# ./Dockerfile2
FROM node:lts-buster
```

预先登录好内外部docker账号：

```sh
# 登录官方源账号
docker login -u username -p token

# 登录内部源账号
docker login -u internal-username -p internal-token registry.xxx.xxx/xxx
```

然后执行构建推送：

```sh
image=node2:lts-buster
docker buildx build --platform linux/amd64 -t registry.xxx.xxx/xxx/$image . --load -f ./Dockerfile2
docker push registry.xxx.xxx/xxx/$image
```

推送完成后，将原来的 Dockerfile 的基础镜像修改：

```dockerfile
FROM registry.xxx.xxx/xxx/node2:lts-buster

WORKDIR /app
COPY . /app

RUN yarn install --network-timeout 600000
RUN yarn build
```

然后再提交 CI 构建即可不受拉取次数限制。