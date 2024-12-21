### Image filling method object-fit
Img element
```html
<img src="./img.png" class="img" />
```
Object-fit attribute
```css
.img {
  object-fit: none;
}
```
Object-fit: fill | contain | cover | none | scale-down
> specifies how to populate the contents of alternative elements.
1. Fill
Content width and height stretch fill.
2. Contain
Keep the original proportion of the picture, zoom and fill. (but does not overflow)
3. Cover
Keep the original proportion of the picture, zoom and fill. (overflow)
4. None
Do not zoom. (the overflow part is cropped to show)
5. Scale-down
If it overflows, the image is scaled to its original scale. If it does not overflow, it is not scaled.
### Picture alignment object-position
> specifies the alignment of the contents of alternative elements.
```css
.img {
  object-position: top left;
}
```
Align the upper left corner.
### Different from background-position
Background-position is used to specify the alignment of the background image defined by the background-image property.
Img is a replacement element, and the content of the picture is not a background, so background-position is not valid for img (replacement elements).