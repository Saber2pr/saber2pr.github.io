# 1. Background
When the business scale expands rapidly, more and more projects need to be deployed. In order to reduce OPS costs, an automated deployment process is generally set up to quickly release deployment by submitting code, also known as CI/CD or DevOps, which belongs to engineering / effectiveness / infrastructure.
# two。 Technical principle
## 2.1 gitlab and drone
At present, the mainstream enterprise code management is git + private gitlab, which submits the code to the cloud remote warehouse for collection and management. Gitlab provides listening for code submission events, and a webhook can be triggered when the developer submits the code. We provide a webhook address to receive messages, such as push messages, as shown below:
![](https://cdn.jsdelivr.net/gh/Saber2pr/MyWeb@master/resource/image/webhook.png)
When the code is submitted, gitlab notifies drone through webhook to synchronize the code. After drone synchronizes the code, it checks if there is a drone.yml file in the project code, and then performs the pipeline task described in the yml file.
## 2.2 drone runs pipeline
In the process of executing the yml file task, drone first compiles yml to json, and then gives it to pipeline for execution. As shown below:
![](https://cdn.jsdelivr.net/gh/Saber2pr/MyWeb@master/resource/image/drone.png)
In the process, we can intercept the json. For example, instead of writing drone.yml in the project repository, you can manually provide a json after the code is synchronized in the drone, and then manually trigger the process to run the extension/custom. Then this json can also be reused in different projects, that is, json is similar to a general component, which can be called a process component.
## 2.3 implementation of pipeline platform based on pipeline.json
For the manual json and manual running processes mentioned in the previous step, you can implement a platform that provides a json save and editing management, and then provides json docking to which warehouse to run. As shown below:
![](https://cdn.jsdelivr.net/gh/Saber2pr/MyWeb@master/resource/image/pipeline2.png)
The pipeline platform is responsible for creating / maintaining process components, then associating process components with repositories, and running processes.
Pipe.json for example:
```json
[
  {
    "step: "compile",
    "commands": ["yarn install", "yarn build"]
  },
  {
    "step: "deploy",
    "commands": ["yarn start"]
  }
]
```
## 2.4 docker Container deployment based on pipe.json
In the previous deploy phase, yarn start can choose a better way, such as using docker containerization to run and improve the pipe.json above:
> e advantage of docker containerized operation is that it uses virtual machines to isolate the environment of each published application and avoid polluting environmental variables, ports, file systems, etc.
```json
[
  {
    "step": "compile",
    "commands": ["yarn install", "yarn build"， "docker build ..."]
  },
  {
    "step": "deploy",
    "commands": [
      "docker pull ...",
      "docker run ..."
    ]
  }
]
```
Here, an enterprise docker generally needs to build a private dockerhub, for example, using harbor.
To further improve, when docker is deployed to switch between new and old containers, it is easy to cause the service to be temporarily unavailable. You can use K8s for container orchestration and scrolling updates.
> K8s requires multiple server deployment, which is not discussed too much here
# 3. Overall design
To summarize the above process, it can be summarized as follows: local git Code submission-> gitlab webhook-> drone synchronization Code-> pipeline Select release process-> docker Construction Image-> K8s scrolling update container instance, as shown below:
![](https://cdn.jsdelivr.net/gh/Saber2pr/MyWeb@master/resource/image/cicd.png)