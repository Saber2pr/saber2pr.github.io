官方对该特性的描述：

[高级特性: 自动静态文件优化 | Next.js](https://www.nextjs.cn/docs/api-reference/next.config.js/cdn-support-with-asset-prefix)

简单来说就是，如果页面中声明了 getServerSideProps，哪怕它是一个没有请求的空函数，也将不会触发此优化。反之，如果页面中没有声明 getServerSideProps，next 将会在 build 期间对页面进行预渲染编译，直接输出 html 文件而不是 js。

这里会存在一个问题，就是关于资源前缀（Asset Prefix），通常这个值我们是这样配置的：

```js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? 'https://cdn.xxx.com' : '',
}
```

以区分线上环境与测试环境

但是，next 的自动静态优化是在 build 期间进行的，build 期间为了进行 tree-shaking 等打包优化 process.env.NODE_ENV 被暂时写死设置了 production，导致 assetPrefix 判断成了 cdn 资源，也就是预编译输出的 html 里链接的资源总是指向 cdn 而不是本地服务器，这就导致测试环境会出现样式丢失的情况，检查控制台发现都是加载 cdn 资源 404. 而没有使用静态优化的页面正常，因为它们是异步渲染的。

> 只有发布线上会正常

如果一定需要 assetPrefix 根据环境变量来设置的话，建议放弃自动静态优化，即你应该为每个页面声明 getServerSideProps。
