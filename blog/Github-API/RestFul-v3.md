## API 接口

```http
https://api.github.com
```

> 分页查询参数 page 和 per_page

### 1. 搜索项目

```http
/search/repositories
```

参数：

(1) q: 要搜索的仓库名

### 2. 读取用户活动

```http
/users/:userId/events
```

### 3. 读取用户仓库列表

```http
/users/:userId/repos
```

### 4. 读取用户跟随者列表

跟随者

```http
/users/:userId/followers
```

跟随

```http
/users/:userId/following
```

### 5. 读取用户 Star 列表

```http
/users/:userId/starred
```

### 6. 读取文件或文件夹

```http
/repos/:userId/:repo/contents/:path
```

如：

```http
GET https://api.github.com/repos/saber2pr/saber2pr.github.io/contents/blog
```

### 7. 新建文件

```http
PUT /repos/:userId/:repo/contents/:path
```

发送 body 格式：

```ts
type Commit = {
  message: string
  content: string
  sha?: string
}
```

其中 content 字段需要 base64 转码。commit 需要 JSON 序列化后作为 body 发送。

> commit 中的 sha 可省略。若更新已有文件，则 sha 字段为必需。

> 注意是 body，不是参数

### 8. 删除文件

```http
DELETE /repos/:userId/:repo/contents/:path
```

同样需要 body 发送，格式：

```ts
type Commit = {
  message: string
  sha: string
}
```

sha 字段为必须。

### 9. 读取文件提交

```http
/repos/:userId/:repo/commits?path=:path
```

如：

```http
GET https://api.github.com/repos/saber2pr/saber2pr.github.io/commits?path=/blog
```

> 通过 commit.committer.date 可得到提交时间

### 10. 读取仓库语言类型

```http
/repos/:userId/:repo/languages
```

> 返回值里不同语言有对应的字节数

### 11. 递归获取目录树

```ts
export const getContentTree = async (
  repo,
  root = { path: "", type: "dir" }
) => {
  if (root.type === "dir") {
    const children = await request(
      `https://api.github.com/repos/${username}/${repo}/contents/${root.path}`
    )
    root.children = await Promise.all(
      children.map(node => getContentTree(repo, node))
    )
  }
  return root
}
```
