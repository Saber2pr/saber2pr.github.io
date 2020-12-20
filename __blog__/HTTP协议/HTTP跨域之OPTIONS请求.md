前几天在写一个前后端交互的项目，遇到个问题：Header 无法发送 Authorization 字段。

我明明用 RESTClient 发 POST 测试得好好的。。(后来知道 OPTIONS 请求是浏览器自动发的，RESTClient 要手动发)

后端 API 鉴权采用类 jwt 的方式，为什么说类 jwt 呢，因为我不是按标准格式编码的，直接利用 JSON.stringify 来序列化 json 数据（当然 token 属性我已经私钥加密了）。前端从 localStorage 里拿到了 jwt，放请求头 Authorization 字段里，firefox 抓包发现请求头没带上 jwt，请求变成了 OPTIONS 请求。

1. 什么是 OPTIONS 请求？

OPTIONS 请求又称预检请求，就是在正式请求服务端 API 前的一个"打招呼、询问"。

2. 为什么需要 OPTIONS 请求？

前端带了特殊的请求头去访问后端，就会触发 OPTIONS 请求，会先询问后端是否支持该请求头字段(对应响应头 Access-Control-Allow-Headers)，以及后端是否支持该请求方法(对应响应头 Access-Control-Allow-Methods)。

3. 那这样每次不得发两次请求？

OPTIONS 请求可以被缓存(对应响应头 Access-Control-Max-Age)，在缓存过期前，不会再发 OPTIONS 请求询问。
