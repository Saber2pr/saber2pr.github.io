要求：

输入 https://saber2pr.top/?code=123456#/links

输出 { code: 123456 }

```ts
export const parseUrlParam = (url: string) => {
  if (!url || !url.includes('?')) return {}
  url = url.split('#')[0]
  const isNumber = /^\d+$/
  return decodeURIComponent(url)
    .split('?')[1]
    .split('&')
    .reduce((out, s) => {
      const union = s.split('=')
      const key = union[0]
      const value = isNumber.test(union[1])
        ? Number(union[1])
        : union[1] || true
      if (key in out) {
        out[key] = [out[key], value]
        return out
      }
      return {
        ...out,
        [key]: value,
      }
    }, {})
}
```

> 或者使用 DOM API 的 new URLSearchParams(new URL(url).search).get

```ts
export const toQueryStr = (obj: any) => {
  if (obj) {
    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key]
      }
    }
    return new URLSearchParams(obj).toString()
  } else {
    return ''
  }
}
```
