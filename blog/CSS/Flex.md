### Container properties (parent element)
1. Flex-direction
Define the principal axis direction of the flex layout (default row)
```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```
2. Flex-wrap
By default, flex layout containers line up child elements on the same line, and flex-wrap determines whether to allow overflow newlines.
```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```
3. justify-content
Define the alignment of child elements along the principal axis
```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```
(1) flex-start
Default value, affixed to the starting point of the spindle.
(2) flex-end
Stick to the end of the spindle.
(3) center
Centered along the principal axis.
(4) space-between
Stick to both ends of the principal axis, with the first child element at the beginning of the principal axis and the last child element at the end of the principal axis.
(5) space-around
Evenly distributed among subelements along the principal axis.
> it should be noted that the gap between the child elements appears to be uneven. The first and last child elements have a gap of one unit from the edge of the parent element, but there is a gap of two units between the two child elements, because there is a gap of one unit on both sides of each child element.
4. Align-items
Defines the alignment direction of child elements in the direction of the cross axis
```css
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```
5. Align-content
> milar to justify-content
> is property does not work when there is only one row.
```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around |
    stretch;
}
```
### child element attribute
1. Order
By default, child elements are laid out in the order in which the code is written, but the order attribute can change the order in which the child elements are arranged.
```css
.item {
  order: 0;
}
```
2. Flex-grow
Determines how the child elements allocate the available remaining space proportionally if space allows.
If set to 1, the remaining space in the parent element is allocated to the child element.
If set to 2, the child element will get twice as much space as the other elements when the remaining space is allocated.
> the default value is 0, and child elements will not be zoomed in even if there is space left.
```css
.item {
  flex-grow: 1;
}
```
3. Flex-shrink
The reduction of child elements when there is insufficient space.
4. Align-self
> u can override the alignment set by align-items in the parent element
```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```
> float,clear and vertical-align are not valid for flex child elements.
5. Flex-basis
If the content of the flex container child element is empty, the placeholder space is set.