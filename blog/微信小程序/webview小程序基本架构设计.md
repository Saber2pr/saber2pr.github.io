webview小程序主要内容是h5，但是h5又需要小程序的一些能力，所以不能光有一个webview页面，还要设计几个基本的能力页面：

1. 入口index，微信存储能力

需要微信保存用户的token，在每次启动时读取、校验，然后通过url传给webview中的h5进行登录。
同时除了保存token，index页面还要负责校验token是否过期（或是否存在），如果过期（或不存在），就跳到login页面。

2. 登录login，微信获取用户信息能力

在login页面中，通过用户点击button[open-type=getUserInfo]，得到用户的信息，然后进行登录、获取到token。
同时将token存入微信storage，然后跳到index页面。

3. 绑定手机bindphone，微信获取用户手机号能力

在bindphone页面中，通过用户点击button[open-type=getPhoneNumber]，得到用户的手机号，然后进行绑定。

4. 支付pay，微信支付能力

在pay页面中，接收到h5传来的支付参数，调用wx.requestPayment进行支付。