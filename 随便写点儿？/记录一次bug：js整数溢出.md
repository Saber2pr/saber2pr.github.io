菜，就得多加班。

---

中台node代理接受到java后台返回的数据，然后序列化返回给前端浏览器，然后json中的整数溢出被截断了，造成异步查询的时候拿了错的ID去调接口。

错误原因：js里整数变量的范围是 ±2**53 ，超出范围的整数在json序列化时会被截断，后面都是000这样的。在ES2020加入了第七种基本类型BigInt，之前大数字一般用string类型变量存储，

整个项目是nextjs框架做的ssr渲染(为什么不混合csr下文说)，浏览器带cookie去请求node代理，node代理用cookie中token作为jwt去请求java后台，java返回了BigInt，nodejs接收到大数字并以BigInt对象存储，然后交给nextjs渲染页面(getServerSideProps)，然后nextjs默认的序列化方法是JSON.stringify，这个方法在序列化含有值类型为BigInt的属性的对象时会报错。

解决办法：利用json-bigint库将对象中值类型为的BigInt属性在序列化时fallback到string类型。

```js
const JSONbigString = require('json-bigint')({ storeAsString: true });
```
然后用JSONbigString.parse解析一下，对象中的BigInt就全变成string了。(写一个axios response拦截器就好)

其实不用库也可以，遍历一遍对象树把BigInt转成string就好了(toString)。

---

因为用的antd按需加载，next/link跳转时只请求到了js chunk，没有请求到css chunk，所以会丢样式。也可能是我配置有问题，有点菜。等想好再优化这里。