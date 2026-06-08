Deployment of next.js mainly deals with routing through forwarding:
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
Front-end projects are typically deployed as docker daemons, followed by nginx reverse proxy plus optimizations such as HTTPS and gzip.
Full configuration:
> File path: / etc/nginx/sites-enabled/default
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
For the configuration of HTTPS, please see:
[Configure HTTPS for the server](/blog/HTTP协议/为服务器配置HTTPS)