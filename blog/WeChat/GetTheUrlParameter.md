You can use WeChat Mini Programs url parameter to pass parameters between different pages, for example:
```js
wx.navigateTo({ url: '/pages/pay/pay?redirectPath=user' })
```
How to get the parameters in the pay page:
```js
Page({
  onLoad(options) {
    const redirectPath = options.redirectPath
  },
})
```
Is directly obtained from the onLoad parameter.