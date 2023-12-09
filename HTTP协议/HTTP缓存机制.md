缓存分为两种：强缓存 和 协商缓存

1.强缓存：不会向服务器发送请求，直接从缓存中读取资源，在 chrome 控制台的 Network 选项中可以看到该请求返回 200 的状态码，并且 size 显示 from disk cache 或 from memory cache 两种（灰色表示缓存）。

2.协商缓存：向服务器发送请求，服务器会根据这个请求的 request header 的一些参数来判断是否命中协商缓存，如果命中，则返回 304 状态码并带上新的 response header 通知浏览器从缓存中读取资源；

> 共同点：都是从客户端缓存中读取资源。
> 区别：强缓存不会发请求，协商缓存会发请求。

![loading](https://saber2pr.top/MyWeb/resource/image/http-cache.webp)

#### 强缓存

1. Expires

response header 里的过期时间，浏览器再次加载资源时，如果在这个过期时间内，则命中强缓存。

2. Cache-Control

当值设为 max-age=300 时，则代表在这个请求正确返回时间（浏览器也会记录下来）的 5 分钟内再次加载资源，就会命中强缓存。

> 区别：Expires 是 http1.0 的产物，Cache-Control 是 http1.1 的产物。两者同时存在的话，Cache-Control 优先级高于 Expires。
> Expires 其实是过时的产物，现阶段它的存在只是一种兼容性的写法。

#### 协商缓存

1. ETag 和 If-None-Match

Etag 是上一次加载资源时，服务器返回的 response header，是对该资源的一种唯一标识。

> 只要资源有变化，Etag 就会重新生成。

浏览器在下一次加载资源向服务器发送请求时，会将上一次返回的 Etag 值放到 request header 里的 If-None-Match 里。

服务器接受到 If-None-Match 的值后，会拿来跟该资源文件的 Etag 值做比较，如果相同，则表示资源文件没有发生改变，命中协商缓存。

2. Last-Modified 和 If-Modified-Since

Last-Modified 是该资源文件最后一次更改时间，服务器会在 response header 里返回。

同时浏览器会将这个值保存起来，下一次发送请求时，放到 request header 里的 If-Modified-Since 里。

服务器在接收到后也会做对比，如果相同则命中协商缓存。

两种方式区别：

1. 在精确度上，Etag 要优于 Last-Modified。

2. Last-Modified 的时间单位是秒，如果某个文件在 1 秒内改变了多次，那么他们的 Last-Modified 其实并没有体现出来修改。但是 Etag 每次都会改变确保了精度。

3. 在性能上，Etag 要逊于 Last-Modified，毕竟 Last-Modified 只需要记录时间，而 Etag 需要服务器通过算法来计算出一个 hash 值。在优先级上，服务器校验优先考虑 Etag。

4. 所以，两者互补。最好是配合在一起用，争取最大化的减少请求，利用缓存，节约流量。

### 浏览器缓存过程

1. 浏览器第一次加载资源，服务器返回 200，浏览器将资源文件从服务器上请求下载下来，并把 response header 及该请求的返回时间(要与 Cache-Control 和 Expires 对比)一并缓存；

2. 下一次加载资源时，先比较当前时间和上一次返回 200 时的时间差，如果没有超过 Cache-Control 设置的 max-age，则没有过期，命中强缓存，不发请求直接从本地缓存读取该文件（如果浏览器不支持 HTTP1.1，则用 Expires 判断是否过期）；

3. 如果时间过期，则向服务器发送 header 带有 If-None-Match 和 If-Modified-Since 的请求；

4. 服务器收到请求后，优先根据 Etag 的值判断被请求的文件有没有做修改，Etag 值一致则没有修改，命中协商缓存，返回 304；如果不一致则有改动，直接返回新的资源文件带上新的 Etag 值并返回 200；

5. 如果服务器收到的请求没有 Etag 值，则将 If-Modified-Since 和被请求文件的最后修改时间做比对，一致则命中协商缓存，返回 304；不一致则返回新的 last-modified 和文件并返回 200；

### 用户行为对浏览器缓存的控制

#### 地址栏访问

链接跳转是正常用户行为，将会触发浏览器缓存机制。

> 浏览器发起请求，按照正常流程，本地检查是否过期，或者服务器检查新鲜度，最后返回内容

#### F5 刷新

浏览器会设置 max-age=0，跳过强缓存判断，会进行协商缓存判断。

> 浏览器直接对本地的缓存文件过期，但是会带上 If-Modifed-Since，If-None-Match（如果上一次 response 带 Last-Modified, Etag）。这就意味着服务器会对文件检查新鲜度，返回结果可能是 304，也有可能是 200.

#### ctrl+F5 强制刷新

跳过强缓存和协商缓存，直接从服务器拉取资源。

> 浏览器不仅会对本地文件过期，而且不会带上 If-Modifed-Since，If-None-Match，相当于之前从来没有请求过，返回结果是 200.

### 如何不缓存

#### Cache-Control 其他字段

1. no-cache: 虽然字面意义是“不要缓存”。但它实际上的机制是，仍然对资源使用缓存，但每一次在使用缓存之前必须向服务器对缓存资源进行验证。
2. no-store: 不使用任何缓存。

禁止缓存：

```bash
Cache-Control: no-cache, no-store, must-revalidate
```

#### Expires：设为当前时间之前

### 前端开发设置不缓存

在引用 js、css 文件的 url 后边加上 ?+Math.random()

```html
<script type=“text/javascript” src=“/js/test.js?+Math.random()”></script>
```

设置 html 页面不让浏览器缓存的方法

```html
<meta http-equiv="pragma" content="no-cache" />
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate" />
<meta http-equiv="expires" content="Wed, 26 Feb 1997 00:00:00 GMT" />
```

### 其他

缓存存在两种形式：from memory cache 与 from disk cache。

![loading](https://saber2pr.top/MyWeb/resource/image/http-cache-code.webp)

在命中强缓存的情况下，进程会从内存读取资源(字体，图片，脚本)，从磁盘里读取 css 部分 js。
