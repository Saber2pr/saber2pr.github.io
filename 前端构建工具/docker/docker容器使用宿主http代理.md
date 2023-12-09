docker容器中有一个特殊的dns：host.docker.internal，它就是宿主的localhost！

如果宿主localhost:10809起了一个http代理服务，在docker容器中可以这样设置：

```bash
export http_proxy="http://host.docker.internal:10809"
export https_proxy="http://host.docker.internal:10809"
```
