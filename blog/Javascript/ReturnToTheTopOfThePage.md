### Positioning using Anchor Point
Below the body is a hidden anchor tag:
```html
<a id="top"></a>
```
Put an access link at the bottom of the page:
```html
<a href="#top">返回顶部</a>
```
Click `return to the top 'page to navigate to the a#top location.
### ScrollTop
```js
document.documentElement.scrollTop = 0
```
### ScrollTo
```js
scrollTo(0, 0)
```
### ScrollBy
```js
window.scrollBy({ top: -document.documentElement.scrollTop })
```
Options parameter
Smooth scrolling
```js
window.scrollBy({
  top: -document.documentElement.scrollTop,
  behavior: "smooth"
})
```