### Standard (W3C) box model
width = content (element width = content width)
> th content as the boundary
> the content width remains the same and expands outward
```css
.contentBox {
  background-color: aquamarine;
  width: 100px;
  height: 100px;
  box-sizing: content-box;
  border: 10px solid blue;
  padding: 20px;
  margin: 20px;
}
```
So the width of the .contentBox element is 100px
### IE Box Model
Width = content + padding + border (element width = content width + inner margin width + border width)
> th border as the boundary
> tting padding and border will squeeze the content
```css
.borderBox {
  background-color: yellowgreen;
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  border: 10px solid blue;
  padding: 20px;
  margin: 20px;
}
```
So the width of the .borderBox element is 100px + 20px + 10px = 130px
---
#### border-box application
You often need to set padding in the input element, but after setting it, input cannot align vertically with the input:submit button by setting the input box border-box, so that when typesetting, padding will be calculated into the actual width of the element.