可以利用微信小程序 url 参数再不同页面之间传递参数，例如：

```js
wx.navigateTo({ url: '/pages/pay/pay?redirectPath=user' })
```

在 pay 页面中获取参数的方法：

```js
Page({
  onLoad(options) {
    const redirectPath = options.redirectPath
  },
})
```

就是 onLoad 参数中直接获取
