# 1. 背景

当业务规模快速扩大时，需要部署的项目就会越来越多，为了减少运维成本，一般会搭建一套自动化部署流程，提交代码即可快速发布部署，也叫 CI/CD 或 DevOps，属于工程化/效能/基础建设。

# 2. 技术原理

## 2.1 gitlab 和 drone

目前主流的企业代码管理是 git + 私有 gitlab，将代码提交到云端远程仓库收录管理。gitlab 提供了对代码提交事件的监听，当开发者提交代码后，可以触发一个 webhook。我们提供一个 webhook 地址用来接收消息，例如 push 消息，如下图：

![](https://cdn.jsdelivr.net/gh/Saber2pr/MyWeb@master/resource/image/webhook.png)

当提交代码后，gitlab 会通过 webhook 通知 drone 来同步代码。drone 同步完成代码后，会检查项目代码中是否有 drone.yml 文件，然后会执行 yml 文件描述的 pipeline 任务。

## 2.2 drone 运行 pipeline

drone 在执行 yml 文件任务过程中，首先将 yml 编译为 json，然后交给 pipeline 执行。如下图：

![](https://cdn.jsdelivr.net/gh/Saber2pr/MyWeb@master/resource/image/drone.png)

在这个过程中，我们可以对这个 json 进行拦截处理。例如在项目仓库中无需编写 drone.yml，当代码在 drone 同步完成后，可以手动提供一个 json，然后手动触发运行扩展/自定义的流程。然后这个 json 在不同项目也可以复用，即 json 类似一个通用的组件，可以叫它流程组件。

## 2.3 基于 pipeline.json 实现 pipeline 平台

针对上一步提到的手动提供 json 和手动运行流程，可以实现一个平台，提供一个 json 保存编辑管理，然后提供 json 对接哪个仓库来运行。如下图：

![](https://cdn.jsdelivr.net/gh/Saber2pr/MyWeb@master/resource/image/pipeline2.png)

pipeline 平台负责的任务就是：创建/维护流程组件，然后将流程组件和仓库关联，并运行流程。

pipe.json 例如：

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

## 2.4 基于 pipe.json 实现 docker 容器部署

在上一步 deploy 阶段，yarn start 可以选择更好的方式，例如使用 docker 容器化运行，改进上面的 pipe.json:

> docker 容器化运行的优点是，使用虚拟机隔离各个发布应用的环境，避免互相污染环境变量和端口、文件系统等

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

这里企业 docker 一般需要搭建私有 dockerhub，例如使用 harbor 搭建。

进一步改进，docker 部署在容器新旧切换时容易导致服务短暂不可用，可以使用 k8s 进行容器编排，滚动更新。

> k8s 需要多服务器部署，这里不过多讨论

# 3. 整体设计

总结上述流程，可以概括为：本地 git 代码提交 -> gitlab webhook -> drone 同步代码 -> pipeline 选择发布流程 -> docker 构建镜像 -> k8s 滚动更新容器实例，如下图：

![](https://cdn.jsdelivr.net/gh/Saber2pr/MyWeb@master/resource/image/cicd.png)
