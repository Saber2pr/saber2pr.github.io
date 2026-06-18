### : not (selector)
Inverse selector.
```css
/* 类名不是 `.fancy` 的 <p> 元素 */
p:not(.fancy) {
  color: green;
}

/* 非 <p> 元素 */
body :not(p) {
  text-decoration: underline;
}

/* 既不是 <div> 也不是 <span> 的元素 */
body :not(div):not(span) {
  font-weight: bold;
}
```
### : first-child
Matches the first element in a set of sibling elements
```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```
Match the first li element under ul:
```css
li:first-child {
  color: red;
}
```
>  first selector refers to the style of the first page when printing a document.
### : first-child
Matches the last element in a set of sibling elements
### First-of-type and: last-of-type
Represents the first / last element of the specified type under its parent.
Different from: first-child,: first-child:
For example:
```css
li:last-child {
  color: red;
}

li:last-of-type {
  background: blue;
}
```
DOM structure:
```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <div>4</div>
</ul>
```
li:last-child wanted to match the last element of ul and was li, but it didn't exist so the match failed.
What li:last-of-type wants to match is the last li element of ul, which exists.
### : nth-child (n)
Matches the Nth child element that belongs to its parent element.
```css
p:nth-child(2) {
  color: red;
}
```
Matches the second element p under the parent element.
Special usage:
1.: nth-child (2n) selects an even tag. 2n can also be even.
2. Nth-child (2n-1) Select an odd tag, and 2n-1 can be odd.
3.: nth-child (3n+1) Custom selection tag, 3n+1 means "take one every two"
4.: nth-child (nasty 4) Select tags greater than or equal to 4
5.: nth-child (- nasty 4) Select 4 tags less than or equal to
6.: last-child selects the last tag
7. Nth-last-child (3) Select the last tag, and 3 means the third.