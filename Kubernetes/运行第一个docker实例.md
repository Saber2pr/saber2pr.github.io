### 环境配置

单机部署 k8s 需要安装 minikube，前往 github release 下载

[minikube](https://github.com/kubernetes/minikube/releases)

macos:

```sh
brew install minikube
```

初始化k8s环境

```sh
minikube start
```

安装vscode插件：

[vscode-kubernetes-tools](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)

### 编写部署实例配置

示例：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nest-api-blog
  namespace: default
  labels:
    app: nest-api-blog
spec:
  selector:
    matchLabels:
      app: nest-api-blog
  replicas: 1
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
    type: RollingUpdate
  template:
    metadata:
      labels:
        app: nest-api-blog
    spec:
      containers:
        - name: nest-api-blog
          image: saber2pr/next-ssr-blog:v1.6.2
          resources:
            requests:
              cpu: 100m
              memory: 100Mi
            limits:
              cpu: 100m
              memory: 100Mi
          livenessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 5
            timeoutSeconds: 5
            successThreshold: 1
            failureThreshold: 3
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 3000
            initialDelaySeconds: 5
            timeoutSeconds: 2
            successThreshold: 1
            failureThreshold: 3
            periodSeconds: 10
          ports:
            - containerPort: 3000
              name: nest-api-blog
      restartPolicy: Always
```

### 使用 k8s 部署

使用 apply 创建实例：

```sh
kubectl apply -f ./nest-api-blog.yaml
```

### pod 常用命令

```sh
kubectl get pod # 查看pod列表及运行状态
```

### deployment 常用命令

```sh
kubectl get deployment # 查看部署应用列表
kubectl delete deployment <app-name> # 下线应用
```

### 查看集群服务列表

```sh
kubectl get service # 查看集群内IP/外部IP/端口
```
