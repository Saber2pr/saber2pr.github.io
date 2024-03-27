### Environment configuration
To deploy k8s on a stand-alone machine, you need to install minikube. Go to github release to download.
[Minikube](https://github.com/kubernetes/minikube/releases)
Macos:
```sh
brew install minikube
```
Initialize the k8s environment
```sh
minikube start
```
Install the vscode plug-in:
[Vscode-kubernetes-tools](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)
### Write deployment instance configuration
Examples:
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
### Deploy using k8s
Create an instance using apply:
```sh
kubectl apply -f ./nest-api-blog.yaml
```
### Pod common commands
```sh
kubectl get pod # 查看pod列表及运行状态
```
### Deployment common commands
```sh
kubectl get deployment # 查看部署应用列表
kubectl delete deployment <app-name> # 下线应用
```
### View the list of cluster services
```sh
kubectl get service # 查看集群内IP/外部IP/端口
```