部署 next.js 主要处理的就是路由透传转发：

```conf
server {
    location / {
        proxy_pass http://localhost:80; # nextjs服务访问入口
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

前端项目的部署方式一般都是 docker 守护进程，然后 nginx 反向代理加 HTTPS 和 gzip 等优化。

完整配置：

> 文件路径：/etc/nginx/sites-enabled/default

```conf
server {
    # listen 80 default_server;
    # listen [::]:80 default_server;

    # SSL configuration
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;
    # ssl
    ssl_certificate /etc/letsencrypt/live/blog.saber2pr.top/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/blog.saber2pr.top/privkey.pem;
    ssl_session_timeout 5m;

    root /var/www/html;

    # Add index.php to the list if you are using PHP
    index index.html index.htm index.nginx-debian.html;

    # cname
    server_name blog.saber2pr.top;

    location / {
        # proxy target
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
  }
}
```

HTTPS的配置请看：

[为服务器配置HTTPS](/blog/HTTP协议/为服务器配置HTTPS)
