如果报错 OpenSSL SSL_connect: Connection was reset in connection to github.com:443，可以尝试使用密码登录 github

```bash
env GIT_SSL_NO_VERIFY=true git clone  https://github.com/xxx/xxx.git
```
