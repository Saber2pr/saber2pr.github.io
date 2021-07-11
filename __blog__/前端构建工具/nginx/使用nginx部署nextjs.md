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
