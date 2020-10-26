项目代码更新后需要重新构建镜像运行，为了方便以及安全一般使用脚本，例如：

```shell
# CONFIG
WORKSPACE="作者名";
NAME="项目名称";
PORT=端口;

# VERSION
DATE=$(date +%Y%m%d%H%M%S);
VERSION=$DATE;

# BRANCH
default_test_branch="testing";
test_branch=${1:-$default_test_branch};

cd /home/${WORKSPACE}/${NAME};
git checkout $test_branch;
git pull origin $test_branch;
docker image build -t ${NAME}:$VERSION . \
&& docker stop ${NAME} \
&& docker rm ${NAME} \
&& docker run --name=${NAME} -d -p ${PORT}:${PORT} ${NAME}:$VERSION;
```

---

### 切换运行版本

```shell
# CONFIG
NAME="项目名称";
PORT=端口;

docker stop ${NAME} \
&& docker rm ${NAME};
docker run --name=${NAME} -d -p ${PORT}:${PORT} ${NAME}:$1;
```

> 接受一个参数作为切换目标版本号

---

### 打包镜像

```shell
# CONFIG
WORKSPACE="作者名";
NAME="项目名称";

# VERSION
DATE=$(date +%Y%m%d%H%M%S);
VERSION=$DATE;

# BRANCH
default_test_branch="testing";
test_branch=${1:-$default_test_branch};

cd /home/${WORKSPACE}/${NAME};
git checkout $test_branch;
git pull origin $test_branch;
docker image build -t ${NAME}:$VERSION .
```
