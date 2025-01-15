### 1. Text-align: center
To center inline elements (or class inline elements) in the block-level parent container, simply use text-align: center
> in-line element of class: inline/inline-block/inline-table/inline/flex
```css
.parent {
  text-align: center;
}

.child {
  display: inline-block;
  /* 文本会继承child类的居中，需要取消文本居中 */
  text-align: left;
}
```
When there are multiple inline elements in a child node, there will be gaps between each child node. This is not a bug, because gaps are needed between text.
Removal method:
(1) set font-size: 0 in the parent element (container) to remove the gap.
```css
.parent {
  font-size: 0;
}
.chilc {
  /* 注意子元素恢复 */
  font-size: 16px;
}
```
(2) use letter-spacing or word-spacing
### 2. Margin:0 auto
Child elements need to be block-level elements, but width needs to be set.
> e table element width is determined by the content
```css
.child {
  display: table;
  margin: 0 auto;
}
```
### 3. Transform
The son and the father.
> e absolute element width is determined by the content
```css
.parent {
  position: relative;
}

.child {
  position: absolute;
  left: 50%; /*absolute定位参照物是父容器*/
  transform: translateX(-50%); /*百分比的参照物是自身*/
}
```
> if the child element width is known, you can also change translateX to margin-left negative margin (offset by half of itself)
### 4. justify-content:center;
Flex container
> t compatible with below IE10
```css
.parent {
  display: flex;
  justify-content: center;
}
```