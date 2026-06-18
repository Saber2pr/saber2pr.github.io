```txt
.
├── conf.d # 这个目录下的*.conf都会被导入到nginx.conf
├── fastcgi.conf
├── fastcgi_params
├── koi-utf
├── koi-win
├── mime.types
├── modules-available
├── modules-enabled
├── nginx.conf # 执行nginx时的默认配置config配置文件（一般不需要修改）
├── proxy_params
├── scgi_params
├── sites-available # 这里放可用的server
│   └── default    # 默认的server
├── sites-enabled  # 这里是启用的server，这个目录下的所有文件会被导入到nginx.conf
│   └── default    # 这是一个软链接指向sites-available/default
├── snippets
│   ├── fastcgi-php.conf
│   └── snakeoil.conf
├── uwsgi_params
└── win-utf
```
When the nginx command is executed, it is equivalent to executing:
```bash
nginx # 等于下面
nginx -c /etc/nginx/nginx.conf
```
By default, nginx has a server configuration that listens to 80, which is the sites-available/default file.
If you want to add a new server, you can create a new file directly in the sites-enable directory and fill in the server configuration (see sites-available/default template)
Normally, after installing nginx, modify / etc/nginx/sites-enable/default directly.