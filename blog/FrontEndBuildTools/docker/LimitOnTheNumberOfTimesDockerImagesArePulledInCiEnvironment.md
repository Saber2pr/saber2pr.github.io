> on November 20, 2020, Docker Hub limited the number of images pulled by anonymous and free authenticated users based on their personal IP addresses. For anonymous users, the limit is set to 100 pulls per IP address every 6 hours. For authenticated users, pull 200 times every 6 hours.
In the CI/CD environment commonly used within the company, the internal dockerconfig.json account, that is, the docker account, is the company account. When everyone in the company builds an image on CI, they pull the image from the dockerhub under the same account. It is obviously not enough to use 100 dockerconfig.json 200 times. Most companies use private docker image sources to solve the pull frequency limit, such as harbor. Synchronize the image of the official docker image source to the private harbor, and then pull the image of the private harbor in the CI without any limit.
### Push the official docker image source to the private docker source
For example, first give an example of a dockerfile
```dockerfile
FROM node:lts-buster

WORKDIR /app
COPY . /app

RUN yarn install --network-timeout 600000
RUN yarn build
```
After 200 more builds, building in CI will prompt 429 Too Many Requests-Server message: toomanyrequests: You have reached your pull rate limit
In this case, you need to change `Buster` to pull from the private image source, but the private image source may not have this image. In this case, you can manually build a push to the private image source:
To write an image file, just write a line FROM + the base image you want
```dockerfile
# ./Dockerfile2
FROM node:lts-buster
```
Log in to your internal and external docker account in advance:
```sh
# 登录官方源账号
docker login -u username -p token

# 登录内部源账号
docker login -u internal-username -p internal-token registry.xxx.xxx/xxx
```
Then perform the build push:
```sh
image=node2:lts-buster
docker buildx build --platform linux/amd64 -t registry.xxx.xxx/xxx/$image . --load -f ./Dockerfile2
docker push registry.xxx.xxx/xxx/$image
```
After the push is completed, modify the basic image of the original Dockerfile:
```dockerfile
FROM registry.xxx.xxx/xxx/node2:lts-buster

WORKDIR /app
COPY . /app

RUN yarn install --network-timeout 600000
RUN yarn build
```
Then submit the CI build without the limit of the number of pulls.