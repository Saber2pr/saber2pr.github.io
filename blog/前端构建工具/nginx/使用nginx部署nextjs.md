部署 next.js 主要处理的就是路由透传转发：

```conf
http {
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
