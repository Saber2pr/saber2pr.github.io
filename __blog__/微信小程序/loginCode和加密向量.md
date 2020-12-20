微信小程序对用户敏感信息进行了加密，例如 button[open-type=getUserInfo]回调中的 event.detail，可以拿到 encryptedData 和 iv 需要后端去解密。这两个值加密是与 wx.login 给的 code 有关的，所以需要在 button 回调前获取 code 然后存起来，回调中读取之前的 code，而不要再去 wx.login 获取 code 了，否则会导致后台解密失败。

示例：

```js
Page({
  data: {
    code: null,
  },
  onLoad(options) {
    // login获取code方法必须在回调前使用
    wx.login({
      success: ({ code }) => {
        this.setData({ code })
      },
    })
  },
  async getUserInfo(event) {
    const { encryptedData, iv } = event.detail
    const options = {
      encryptedData,
      iv,
      // 回调前的code
      code: this.data.code,
    }
    await login(options)
  },
})
```
