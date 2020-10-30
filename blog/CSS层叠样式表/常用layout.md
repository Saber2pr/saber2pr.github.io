1. 类似知乎的 layout，内容定宽并水平居中，有最小宽度限制

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
