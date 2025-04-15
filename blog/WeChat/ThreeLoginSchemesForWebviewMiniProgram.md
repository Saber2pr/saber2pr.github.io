For Mini Program implemented with webview, there are three environments for h5 on mobile:
Get the environment where h5 is located:
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
1. Webview in Mini Program
Use jsdk to jump to the Mini Program login page and log in through user authorization
```ts
// h5跳转小程序
wx.miniProgram.navigateTo({ url: '/pages/login/login' })
```
two。 Wechat browser
Log in using the official account oauth2
```ts
/**
 * 微信H5登录 oauth2
 */
export const getWxLoginCode = () => {
  location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid={appid}&redirect_uri={redirect_uri}&response_type=code&scope=snsapi_userinfo#wechat_redirect'
}
```
> Note that the appid here is the official account appid.
3. Mobile phone browser
Log in using the mobile verification code