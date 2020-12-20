### :not(selector)

反选择器。

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

### :first-child

匹配一组兄弟元素中的第一个元素

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
</ul>
```

匹配 ul 下第一个 li 元素：

```css
li:first-child {
  color: red;
}
```

> :first 选择器是指打印文档的时候，第一页的样式。

### :first-child

匹配一组兄弟元素中的最后一个元素

### :first-of-type 和:last-of-type

表示其父元素下的第一/最后一个指定类型的元素。

与:first-child、:first-child 的区别：

举个例子：

```css
li:last-child {
  color: red;
}

li:last-of-type {
  background: blue;
}
```

dom 结构：

```html
<ul>
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <div>4</div>
</ul>
```

li:last-child 想要匹配的是 ul 最后一个元素并且是 li，但不存在所以匹配失败。

li:last-of-type 想要匹配的是 ul 最后一个 li 元素，存在。

### :nth-child(n)

匹配属于其父元素的第 N 个子元素。

```css
p:nth-child(2) {
  color: red;
}
```

匹配父元素下第二个元素 p。

特殊用法：

1. :nth-child(2n)选取偶数标签，2n 也可以是 even

2. :nth-child(2n-1)选取奇数标签，2n-1 可以是 odd

3. :nth-child(3n+1)自定义选取标签，3n+1 表示“隔二取一”

4. :nth-child(n+4)选取大于等于 4 标签

5. :nth-child(-n+4)选取小于等于 4 标签

6. :last-child 选取最后一个标签

7. :nth-last-child(3)选取倒数第几个标签,3 表示选取第 3 个
