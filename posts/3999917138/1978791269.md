### 1. Table + vertical-align
> sed on baseline (four lines and three lines)
```css
.parent {
  display: table;
}

.child {
  display: table-cell;
  vertical-align: middle;
}
```
### 2. Transform
```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  top: 50%; /* absolute定位参照物是父容器 */
  transform: translateY(-50%); /*translate的参照物是自身 */
}
```
> if the child element width is known, you can also change translateY to margin-top negative margin (offset by half of itself)
### 3. Align-items:center
Flex container
> t compatible with below IE10
```css
.parent {
  display: flex;
  align-items: center;
}

/*或者*/
.child {
  align-self: center;
}
```
### 4. Line-height
The child element row height is set to the parent element height
```css
.parent {
  height: 100px;
}

.child {
  line-height: 100px;
}
```