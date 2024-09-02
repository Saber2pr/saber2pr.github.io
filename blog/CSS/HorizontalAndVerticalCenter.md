### 1. Text-align + (table + vertical-align)
```css
.parent {
  text-align: center;
  display: table;
}

.child {
  display: table-cell;
  vertical-align: middle;
  /* 文本恢复左对齐 */
  text-align: left;
}
```
### 2. transform
```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  /*absolute定位参照物是父容器*/
  left: 50%;
  top: 50%;
  /*translate的参照物是自身*/
  transform: translate(-50%, -50%);
}
```
> if the width of the child element is known, you can also replace translate with (margin-left + margin-top) negative margin (offset by half of itself)
### 3. justify-content + align-items
Flex container
> t compatible with below IE10
```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```