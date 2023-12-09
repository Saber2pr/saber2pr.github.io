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

当执行 nginx 命令时，就相当于执行：

```bash
nginx # 等于下面
nginx -c /etc/nginx/nginx.conf
```

nginx 默认有一个监听 80 的 server 配置，就是 sites-available/default 文件。

如果想要添加一个新的 server，可以在 sites-enable 目录直接新建一个文件，填写 server 配置（可参考 sites-available/default 模板）

正常来说，安装完 nginx 后，直接修改/etc/nginx/sites-enable/default 就行了。
