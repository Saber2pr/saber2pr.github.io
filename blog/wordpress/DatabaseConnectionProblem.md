Installation:
```sh
docker pull mysql/mysql-server:5.7.39-1.2.9-server
brew install shivammathur/php/php@5.6
```
When establishing-a-database-connection appears, first confirm that you can connect successfully with DBeaver and other database connection tools to ensure that the account password is correct. It is recommended that mysql5.7 + php5.6,mysql8 and php7 compatibility is not very good.
If the above confirmation or still cannot connect to the database, create a test.php file under the project:
```php
<?php
$link = mysqli_connect('127.0.0.1', 'root', '123456');
if (!$link) {
die('Could not connect: ' . mysqli_error());
}
echo 'Connected successfully';
mysqli_close($link);
?>
```
Then run the project (you can use the vscode plug-in [PHP Server] (https://marketplace.visualstudio.com/items?itemName=brapifra.phpserver)) to see if the page output is Connected successfully
---
Reference article: https://wpastra.com/guides-and-tutorials/error-establishing-a-database-connection/