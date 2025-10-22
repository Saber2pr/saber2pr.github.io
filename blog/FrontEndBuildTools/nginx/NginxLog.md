The log file storage path for nginx is defined in nginx.conf:
```conf
http {
  ##
	# Logging Settings
	##
	access_log /var/log/nginx/access.log;
	error_log /var/log/nginx/error.log;
}
```
Use the tail command to view real-time logs:
```bash
tail -f /var/log/nginx/access.log
```