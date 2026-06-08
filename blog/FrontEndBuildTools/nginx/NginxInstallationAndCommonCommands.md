1. Installation
```bash
sodu su root
apt-get install nginx
```
2. start
```bash
nginx # 等于下面
nginx -c /etc/nginx/nginx.conf # 从一个配置文件启动
```
3. Refresh configuration
```bash
nginx -s reload
```