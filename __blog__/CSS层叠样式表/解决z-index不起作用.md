### 场景：

添加背景图片时利用z-index使背景在主要内容的下层

```html
<div class="contain">
  <div class="bg"></div>  
  <div class="main"></div>  
<div>
```

```css
.contain {
  width: 100%;
  height: 100px;
  border: 1px solid;
  position: relative;
}

.bg {
  width: 100%;
  background-color: blue;
  height: 100px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

.main {
  /* position: relative; */
  background: red;
  width: 100%;
  height: 50px;
  z-index: 1;
}
```
z-index起作用的前提是元素要有定位absolute，fix或relative

所以.main加上relative即可
