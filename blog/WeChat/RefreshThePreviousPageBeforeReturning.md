Scene:
The user clicks to activate the member, and then "jumps" to the member page to activate. After successful activation, navigateBack returns to the previous page (usually the user information page), and then needs this page to refresh to display the latest user status, but Mini Program navigateTo is the routing stack, only pop the current page, the previous page is not refreshed.
> mmon in Mini Program implemented using webview
### Solution.
```js
const pages = getCurrentPages()
// 上一页
const prevPage = pages[pages.length - 2]
prevPage.setData({
  // webview重设url可以刷新
  url: '',
})
wx.navigateBack()
```