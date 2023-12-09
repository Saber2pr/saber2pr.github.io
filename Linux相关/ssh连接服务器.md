以前做项目都是让运维帮忙添加 ssh，我觉得还是自己也总结一下好：

登录服务器：

> 可以直接 ssh root@ip，也可以用 xshell

```bash
cd /root

mkdir .ssh

cd .ssh

vim authorized_keys
```

然后把公钥 /user/.ssh/id_rsa.pub 中文本复制进去保存。

> 如果想要添加多个人的 ssh，就直接换行追加即可

### xshell

xshell 是一个加强版的终端，可以保存会话，用 ssh 私钥与服务器上添加的公钥进行验证登录。

### 其他

1. 安装/卸载 v2ray 代理

```bash
bash <(curl -s -L https://git.io/v2ray.sh)
```
