项目代码更新后需要重新构建镜像运行，为了方便以及安全一般使用脚本，例如：

```shell
NAME="项目名称";
PORT=端口;
DATE=$(date +%Y%m%d%H%M%S);
VERSION=${1:-$DATE};

cd /home/项目路径 \
&& git pull \
&& docker image build -t ${NAME}:$VERSION . \
&& docker stop ${NAME} \
&& docker rm ${NAME} \
&& docker run --name=${NAME} -d -p ${PORT}:${PORT} ${NAME}:$VERSION
```
