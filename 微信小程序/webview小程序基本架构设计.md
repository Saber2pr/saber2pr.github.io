webview 小程序主要内容是 h5，但是 h5 又需要小程序的一些能力，所以不能光有一个 webview 页面，还要设计几个基本的能力页面：

1. 入口 index，微信存储能力

需要微信保存用户的 token，在每次启动时读取、校验，然后通过 url 传给 webview 中的 h5 进行登录。
同时除了保存 token，index 页面还要负责校验 token 是否过期（或是否存在），如果过期（或不存在），就跳到 login 页面。

2. 登录 login，微信获取用户信息能力

在 login 页面中，通过用户点击 button[open-type=getUserInfo]，得到用户的信息，然后进行登录、获取到 token。
同时将 token 存入微信 storage，然后跳到 index 页面。

3. 绑定手机 bindphone，微信获取用户手机号能力

在 bindphone 页面中，通过用户点击 button[open-type=getPhoneNumber]，得到用户的手机号，然后进行绑定。

4. 支付 pay，微信支付能力

在 pay 页面中，接收到 h5 传来的支付参数，调用 wx.requestPayment 进行支付。

5. 内容 webview

在 webview 页面中，接收从 index 页面传来的 token，然后通过参数传给 h5。
webview 页面负责小程序->h5 的通信（就是 url 传参通信）。

### 流程图

![loading](https://saber2pr.top/MyWeb/resource/image/0126wxmini.webp)
