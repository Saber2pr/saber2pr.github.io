### 注册 OAuth App

鉴权方式这里选择 OAuth。

打开 Github -> Settings -> Developer settings -> OAuth Apps -> New OAuth App 注册一个 app。

需要注意的是 Authorization callback URL 项：
当访问 /authorize 接口获取 access code 时，access code 会 以 url 参数的形式拼到这个 callback 后面（例如：'https://saber2pr.top/?code=xxxx'），并将页面重定向到此 url。

> 访问/authorize 接口获取 code 时，一定要带 scope=public_repo 参数！不能只带 client_id！

> 在页面的 js 脚本中，从 location.href 中解析出 code，然后利用 code 获取 access_token。

如果使用了 custom domain，获取 access_token 时可能会涉及到跨域问题，可以试试 cors-anywhere 方案。

### Issue Api

准备一个 repo，在 repo 中开启一个 issue。每个 issue 有一个序号，第一个 issue 序号就是 1。

issue 对应的评论 api 是 `https://api.github.com/repos/${username}/${repo}/issues/${issue_id}/comments`

访问这个 api 会得到该 issue 对应的评论。

> 如果需要可以带上 timestamp 时间戳，避免 api 被缓存无法更新。

GET(获取评论):

获取 saber2pr/rc-gitment 仓库中第一条 issue 的评论

```ts
fetch(
  `https://api.github.com/repos/saber2pr/rc-gitment/issues/1/comments?timestamp=${Date.now()}`,
  {
    headers: {
      Authorization: `token ${accessToken}`
    }
  }
).then(res => res.json())
```

POST(发送评论):

在 saber2pr/rc-gitment 仓库中第一条 issue 下面添加一条评论，内容是 test from api.

> 注意 body 格式，{ body: string }

```ts
fetch(
  `https://api.github.com/repos/saber2pr/rc-gitment/issues/1/comments?timestamp=${Date.now()}`,
  {
    method: "POST",
    body: JSON.stringify({
      body: "test from api."
    }),
    headers: {
      Authorization: `token ${accessToken}`
    }
  }
)
```

DELETE(删除评论):

删除地址是 commentToDeleteUrl 对应的评论。这个地址可在 GET 请求结果中得到，每条评论有一个对应的地址。

```ts
fetch(commentToDeleteUrl, {
  method: "DELETE",
  headers: {
    Authorization: `token ${accessToken}`
  }
})
```
