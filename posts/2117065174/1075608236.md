Official description of the feature:
[Advanced features: automatic static file optimization | Next.js](https://www.nextjs.cn/docs/api-reference/next.config.js/cdn-support-with-asset-prefix)
To put it simply, if getServerSideProps is declared on the page, even if it is an empty function without a request, this optimization will not be triggered. Conversely, if the page does not declare that getServerSideProps,next will pre-render the page during build, the html file will be output directly instead of js.
There is a problem here, which is about the resource prefix (Asset Prefix), which is usually configured as follows:
```js
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: isProd ? 'https://cdn.xxx.com' : '',
}
```
To distinguish the online environment from the test environment
However, the automatic static optimization of next is carried out during the build period. During the build period, the production is temporarily set up for packaging optimization such as tree-shaking, which causes assetPrefix to judge as cdn resources, that is, the linked resources in the precompiled output html always point to the cdn rather than the local server, which leads to the loss of style in the test environment. The inspection console found that all the cdn resources were loaded. Pages that do not use static optimization are normal because they are rendered asynchronously.
> ly publishing will be normal online
If it is necessary for assetPrefix to be set according to environment variables, it is recommended to abandon automatic static optimization, that is, you should declare getServerSideProps for each page.