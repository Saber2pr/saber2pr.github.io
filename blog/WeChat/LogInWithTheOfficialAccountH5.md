Unlike Mini Program, Mini Program can obtain code directly through wx.login and use the decryption vector in the [open-type=getUserInfo] callback to obtain user information. H5 web page does not have the relevant interface, Wechat gives the oauth2 solution:
Visit the following address in H5, and after the user is authorized, the page will be redirected to the address specified by redirect_uri with the code parameter
```ts
const oauth2_authorize = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid={appid}&redirect_uri={redirect_uri}&response_type=code&scope=snsapi_userinfo#wechat_redirect'
```
> where appid is the official account application id
With code, you can go to the background to exchange user information.
### Pay attention
1. This url can not be called directly. The official account needs to configure the h5 oauth domain name at the backend. Before setting the domain name, you need to download the verification file txt certificate and place it in the root directory of the project (next.js is / public directory), and then save the domain name settings before h5 can access the authorize link.