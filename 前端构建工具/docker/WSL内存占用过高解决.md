docker使用wsl分配的内存默认没有限制，所以很容易将内存吃满。

退出dockers，编辑配置文件~/.wslconfig，填入以下内容：

```txt
[wsl2]
memory=8GB
swap=0
localhostForwarding=true
```

重启docker

> 注意memory设置太小可能docker无法启动
