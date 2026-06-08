After the project code is updated, the image needs to be rebuilt and run. Scripts are generally used for convenience and security, such as:
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
### Switch the running version
```shell
# CONFIG
NAME="项目名称";
PORT=端口;

docker stop ${NAME} \
&& docker rm ${NAME};
docker run --name=${NAME} -d -p ${PORT}:${PORT} ${NAME}:$1;
```
> Accept a parameter as the target version number for switching
---
### Package image
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