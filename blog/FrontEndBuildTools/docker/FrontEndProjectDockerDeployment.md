1. Write Dockerfile, for example:
```dockerfile
# node
FROM node:14.18-alpine

# mirror
RUN echo 'http://mirrors.aliyun.com/alpine/v3.5/main' > /etc/apk/repositories
RUN echo 'http://mirrors.aliyun.com/alpine/v3.5/community' >>/etc/apk/repositories

# timeZone
RUN apk update && apk add tzdata
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo "Asia/Shanghai" > /etc/timezone

WORKDIR /app
COPY . /app

# npm
RUN yarn config set registry 'https://registry.npm.taobao.org' -g
RUN yarn config set sass_binary_site 'https://npm.taobao.org/mirrors/node-sass/' -g
RUN yarn install --network-timeout 600000
RUN yarn build

# script
CMD [ "yarn", "start" ]
```
two。 Execute the image build command:
```bash
docker image build -t myimage:v1 .
```
> Note that there is one last point that cannot be omitted
3. Run Mirror
```bash
docker run -d -p 3000:3000 -it myimage:v1
```
> d means running in the background. Port 3000 inside the container is mapped to port 3000 outside the container.
4. Run the container
> nning the container of the specified CONTAINER ID
```bash
docker start 684f23ec4ea9
```
5. List existing mirrors
```bash
docker images
```
6. Delete the mirror:
> lete the image of the specified IMAGE ID
```bash
docker rmi 597d72732244
```
7. View existing containers
```bash
docker ps -a
```
> do not add-a to list only running containers
8. Delete Container
> lete the container for the specified CONTAINER ID
```bash
docker rm dcf9dfaf355d
```
---
# Docker Container Update
1. Enter the container bash
```bash
docker exec -it 4637c19a2d3a sh
```
Or
```bash
docker exec -it 4637c19a2d3a /bin/sh
```
Or
```bash
docker exec -it 4637c19a2d3a bash
```
Or
```bash
docker exec -it 4637c19a2d3a /bin/bash
```
> ter exit to exit the container
two。 Modify within the container
For example, git update:
```bash
git pull
```
> date the container after modification
---
# Docker domestic accelerated image configuration
1. Create a docker configuration folder
```bash
sudo mkdir -p /etc/docker
```
two。 Create a docker profile
```bash
sudo vi /etc/docker/daemon.json
```
Write the following
```bash
{
"registry-mirrors": ["https://6kx4zyno.mirror.aliyuncs.com"]
}
```
> tEase docker accelerated image
3. Restart daemon
```bash
sudo systemctl daemon-reload
```
4. Restart docker
```bash
sudo systemctl restart docker
```
Windows:
```bash
Net stop com.docker.service
Net start com.docker.service
```