```bash
docker pull mysql/mysql-server:8.0.25-1.2.3-server
```

加一堆参数：

```bash
docker run --restart=always --name=mysql1 -d -p 3306:3306 mysql/mysql-server:8.0.25-1.2.3-server --default-authentication-plugin=mysql_native_password --performance_schema=off --key_buffer_size=16M --tmp_table_size=1M --innodb_buffer_pool_size=1M --innodb_log_buffer_size=1M --max_connections=25 --sort_buffer_size=512M --read_buffer_size=256K --read_rnd_buffer_size=512K --join_buffer_size=128K --thread_stack=196K
```

参数生成：

```js
`performance_schema = off
key_buffer_size = 16M
tmp_table_size = 1M
innodb_buffer_pool_size = 1M
innodb_log_buffer_size = 1M
max_connections = 25
sort_buffer_size = 512M
read_buffer_size = 256K
read_rnd_buffer_size = 512K
join_buffer_size = 128K
thread_stack = 196K`.split('\n').map(item => '--'+item.split(' = ').join('=')).join(' ')
```
