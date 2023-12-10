URL 对象提供了 parse 方法，将 url 切割。可以获得 query 部分。

querystring 库提供了 parse 方法，将 url query 解析成对象。

```ts
import querystring from "querystring"
import URL from "url"

const parseURLParams = (url: string) => querystring.parse(URL.parse(url).query)
```

[手动解析 url query](/blog/Javascript基础/实现URL参数parser)
