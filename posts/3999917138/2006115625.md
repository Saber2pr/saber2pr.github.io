1. Similar to Zhihu's layout, the content is wide and centered horizontally, with a minimum width limit.
```html
<div class="container">
  <div class="content">text</div>
</div>
```
```css
.container {
  min-width: 1440px;
}

.container > .content {
  width: 1440px;
  margin: 0 auto;
}
```