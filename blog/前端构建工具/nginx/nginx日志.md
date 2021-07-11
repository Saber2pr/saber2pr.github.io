nginx 的日志文件存放路径在 nginx.conf 中定义：

```conf
http {
  ##
	# Logging Settings
	##
	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;
}
```

使用 tail 命令查看实时日志：

```bash
tail -f /var/log/nginx/access.log
```
