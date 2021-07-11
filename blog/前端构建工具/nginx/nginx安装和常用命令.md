1. 安装

```bash
sodu su root
apt-get install nginx
```

2. 启动

```bash
nginx # 等于下面
nginx -c /etc/nginx/nginx.conf # 从一个配置文件启动
```

3. 刷新配置

```bash
nginx -s reload
```
