mysql也是一个server，建好数据库，然后代码根据ip端口账号密码连接server就可以了。像这种server类型的软件推荐使用docker安装：

### 拉取镜像

```bash
docker pull mysql/mysql-server:8.0.25-1.2.3-server
```

### 创建容器

```bash
docker run --name=mysql1 -d -p 3306:3306 mysql/mysql-server:8.0.25-1.2.3-server --default-authentication-plugin=mysql_native_password
```

### 获取初始密码

```bash
docker logs mysql1 2>&1 | grep GENERATED
```

### 登录

```bash
docker exec -it mysql1 mysql -uroot -p
```

### 修改密码

```bash
alter user 'root'@'localhost' identified by '密码';
```

### 修改权限

```bash
use mysql;
update user set host='%' where user='root';
flush privileges;
```

### 登录数据库

```sh
mysql -u root -p
```

### 创建数据库

```sql
CREATE DATABASE your_db_name;
```

> 注意结尾有分号

然后剩下的就直接用typeorm连接建表了。
