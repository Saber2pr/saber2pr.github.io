### basic auth

每次请求在 headers 中携带 Authorization 字段，值为 Basic + 空格 + base64("username:password")。

> 需要在本地保存用户的账户信息例如存入 localStorage。

### OAuth

每次请求在 headers 中携带 Authorization 字段，值为 token + 空格 + accessToken。

> 需要在本地保存用户的 access_token 例如存入 localStorage。

需要在服务端注册一个 client app，得到 client_id 和 client_secret。

利用 client_id 访问 /authorize 接口(可能需要声明 scope)，页面重定向并得到 access code。

利用 access code、client_id 和 client_secret 访问/login/oauth 接口，得到 access_token。
