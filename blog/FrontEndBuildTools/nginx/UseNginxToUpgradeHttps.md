Using the nginx reverse proxy, you can upgrade the HTTPS to the website non-intrusively:
Modify the default file:
```bash
vim /etc/nginx/sites-available/default
```
```conf
server {
	# https使用443端口
	listen 443 ssl default_server;
	listen [::]:443 ssl default_server;
	# 配置HTTPS证书(这里是letsencrypt的示例)
	ssl_certificate /etc/letsencrypt/live/blog.saber2pr.top/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/blog.saber2pr.top/privkey.pem;
	ssl_session_timeout 5m;
	# 设置域名
	server_name blog.saber2pr.top;
}
```
About how to apply for a HTTPS certificate:
[Configure HTTPS for the server](/blog/HTTP协议/为服务器配置HTTPS)