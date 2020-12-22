由于原生小程序的开发过程过于上古，目前前端很多工具都用不了或者很难用，所以使用 webview 来实现小程序是很好的办法。

> 注意 webview 小程序只有企业认证的号才可以使用。个人独立开发者不行。

### 设计思路

1. 小程序加载时，判断 storage 里是否有 cookie，如果有表示用户已注册，则直接带 cookie 参数跳转到 webview，webview(h5)里判断 url 上是否有 cookie 参数，如果有则请求用户信息、初始化数据等操作，同时将 cookie 存到 document.cookie 中。

2. 如果 storage 里没有 cookie，表示用户未注册，则跳到注册/登录页面获取 cookie，获取成功后将 cookie 存入小程序 storage 中，同时带 cookie 参数跳到 webview。

3. token 过期处理：在第 1 步中，跳转 webview 前，先带 cookie 去访问一次后台接口，如果没有 401 等异常，表示 token 没有过期，可以跳转 webview，如果过期则跳到登陆页面重新获取新的 cookie 再跳转 webview。或者 webview 中拦截到 401 利用 jsdk 跳小程序登录页重新获取 token。

4. webview 中需要利用小程序能力：例如 webview 付费想使用微信支付，需要在小程序中新建一个 pay 页面，webview 中利用 jsdk 的 wx.navigateTo 跳到这个 pay 页面，同时将需要的参数通过 url 参数传给小程序，小程序获取 webview 传来的支付参数进行微信支付。

> 注意微信支付需要在后台申请开通才可以使用。

> webview中的h5需要在根目录下（next.js是/public）放校验文件txt(开发管理->开发设置->业务域名)

> 与webview中的h5不同，小程序中的请求不会跨域，但需要设置服务器域名(开发管理->开发设置->服务器域名)