### Scene:
When adding background pictures, use z-index to make the background in the lower layer of the main content
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
The premise that z-index works is that the element has a positioning absolute,fix or relative
So.main plus relative