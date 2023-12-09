使用webview实现的小程序，其中的h5在移动端上会存在3种环境：

获取h5所在环境：

```ts
export const getProgramEnv = () =>
  new Promise<'mini' | 'wechat' | 'h5'>(resolve => {
    const ua = navigator?.userAgent?.toLowerCase() ?? ''
    if (ua.indexOf('micromessenger') !== -1) {
      //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
      wx.miniProgram.getEnv(res => {
        if (res.miniprogram) {
          // 在小程序里
          resolve('mini')
        } else {
          // 不在小程序里，在微信里
          resolve('wechat')
        }
      })
    } else {
      // 不在微信里
      resolve('h5')
    }
  })
```

1. 小程序内的webview

利用jsdk跳到小程序登陆页面，通过用户授权登录

```ts
// h5跳转小程序
wx.miniProgram.navigateTo({ url: '/pages/login/login' })
```

2. 微信浏览器

利用公众号oauth2登录

```ts
/**
 * 微信H5登录 oauth2
 */
export const getWxLoginCode = () => {
  location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid={appid}&redirect_uri={redirect_uri}&response_type=code&scope=snsapi_userinfo#wechat_redirect'
}
```

> 注意这里的appid是公众号appid

3. 手机浏览器

利用手机验证码登录