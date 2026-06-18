The main content of webview Mini Program is H5, but H5 also needs some capabilities of Mini Program, so you can't just have a webview page, but also design several basic ability pages:
1. Import index, storage capacity of Wechat
Need Wechat to save the user's token, read it, verify it at each startup, and then pass it to h5 in webview through url to log in.
At the same time, in addition to saving the token,index page, it is also responsible for verifying whether the token expires (or exists), and if it expires (or does not exist), skip to the login page.
2. Login login, WeChat to obtain user information ability
In the login page, the user clicks button [open-type=getUserInfo] to get the user's information, and then log in and get the token.
At the same time, save the token into Wechat storage, and then jump to the index page.
3. Bind mobile phone bindphone, Wechat to obtain users' mobile phone number
In the bindphone page, click button[open-type=getPhoneNumber] to get the user's mobile phone number, and then bind it.
4. Pay pay, WeChat Pay's ability
In the pay page, receive the payment parameters from h5, and call wx.requestPayment to make payment.
5. Content webview
In the webview page, receive the token from the index page and pass it to h5 by argument.
The webview page is responsible for Mini Program-> h5 communication (that is, url parameter communication).
### flowchart
![loading](https://saber2pr.top/MyWeb/resource/image/0126wxmini.webp)