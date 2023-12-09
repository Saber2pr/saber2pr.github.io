推荐使用Docker镜像+Vscode Remote Container插件开发：

Dockerfile

```dockerfile
FROM haskell:latest

# setup
RUN stack setup

# other tools
RUN apt update
RUN apt install curl
RUN apt install git

# git config
RUN git config --global http.sslBackend gnutls
# disable git ssl
ENV GIT_SSL_NO_VERIFY true

# proxy
ENV http_proxy "http://host.docker.internal:10809"
ENV https_proxy "http://host.docker.internal:10809"
```

[github仓库自动发布](https://github.com/Saber2pr/haskell)

> 注意这里使用了v2ray代理

haskell的包管理和构建执行工具使用stack，

创建一个项目：

```bash
stack new my-project
cd my-project
```

运行项目:

```bash
stack run
```
