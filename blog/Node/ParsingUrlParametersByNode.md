The URL object provides the parse method to cut the url. The query section is available.
The querystring library provides a parse method to parse url query into objects.
```ts
import querystring from "querystring"
import URL from "url"

const parseURLParams = (url: string) => querystring.parse(URL.parse(url).query)
```
[Manually parse url query](/blog/Javascript基础/实现URL参数parser)