Using white-space to implement
```css
.container {
  display: block;
  white-space: nowrap;
  overflow-x: auto;
}

.container > .item {
  display: inline-block;
  white-space: normal;
}
```
White-space defines whether an in-line element overflow wraps. Nowrap forces the overflow without line wrapping, and the elements in the container are arranged on the same line. Restore white-space to the default value of normal inside the container, which means normal line wrapping.
In this way, the elements in the container will be arranged on the same line and overflow, and the container only needs to set overflow-x: auto to generate a horizontal scrolling container.
> if inline element alignment is required, .item can set vertical-align: top.
> Since the elements in the row are separated by default, they can be cleared by font-size.