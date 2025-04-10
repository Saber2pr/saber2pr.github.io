In the following structure, a split line is inserted between the li elements:
```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```
You can first use the: nth-child () selector to select the tail part, and then add a:: before element to each li in the tail to set the pseudo element to border-bottom to achieve the splitter line. The code is as follows:
```css
li:nth-child(n + 2)::before {
  content: " ";
  display: block;
  border-bottom: 1px solid black;
}
```
[Nth-child selector](/blog/CSS层叠样式表/CSS3选择器)