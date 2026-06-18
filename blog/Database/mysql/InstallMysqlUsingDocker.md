Mysql is also a server, set up the database, and then the code connects to server according to the ip port account password. Docker installation is recommended for software like this server type:
### pull images from the nearest region
```bash
docker pull mysql/mysql-server:8.0.25-1.2.3-server
```
### Create a container
```bash
docker run --name=mysql1 -d -p 3306:3306 mysql/mysql-server:8.0.25-1.2.3-server --default-authentication-plugin=mysql_native_password
```
### Get the initial password
```bash
docker logs mysql1 2>&1 | grep GENERATED
```
### Log in
```bash
docker exec -it mysql1 mysql -uroot -p
```
### Modify the password
```bash
alter user 'root'@'localhost' identified by '密码';
```
### Modify permissions
```bash
use mysql;
update user set host='%' where user='root';
flush privileges;
```
### Log into the database
```sh
mysql -u root -p
```
### Create a database
```sql
CREATE DATABASE your_db_name;
```
> tice that there is a semicolon at the end
Then the rest of the table is directly linked with typeorm.