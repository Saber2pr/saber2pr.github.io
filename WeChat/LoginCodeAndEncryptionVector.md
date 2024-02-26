WeChat Mini Programs encrypts sensitive user information, such as event.detail in button [open-type=getUserInfo] callback. You can get encryptedData and iv to decrypt them. The encryption of these two values is related to the code given by wx.login, so you need to obtain the code before the button callback and save it. The previous code is read in the callback, and do not go to wx.login to obtain the code, otherwise the backend decryption will fail.
Examples:
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