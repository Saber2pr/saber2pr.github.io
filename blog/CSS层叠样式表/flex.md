### 容器属性(父元素)

1. flex-direction

定义 flex 布局的主轴方向(默认 row)

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

2. flex-wrap

默认情况下，flex 布局容器会把子元素排在同一行，设置 flex-wrap 可以决定是否允许溢出换行。

```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

3. justify-content

定义子元素沿主轴方向的对齐方式

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around;
}
```

(1) flex-start

默认值，贴主轴起点。

(2) flex-end

贴主轴终点。

(3) center

沿主轴方向居中。

(4) space-between

贴主轴两端，第一个子元素在主轴起点，最后一个子元素在主轴终点。

(5) space-around

沿主轴子元素之间均匀分布。

> 要注意的是子元素看起来间隙是不均匀的，第一个子元素和最后一个子元素离父元素的边缘有一个单位的间隙，但两个子元素之间有两个单位的间隙，因为每个子元素的两侧都有一个单位的间隙。

4. align-items

定义了子元素在交叉轴方向的对齐方向

```css
.container {
  align-items: flex-start | flex-end | center | baseline | stretch;
}
```

5. align-content

> 类似于 justify-content

> 当只有一行的时候，该属性并不起作用。

```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around |
    stretch;
}
```

### 子元素属性

1. order

默认情况下，子元素按照代码书写的先后顺序布局，但 order 属性可以更改子元素排列顺序。

```css
.item {
  order: 0;
}
```

2. flex-grow

决定在空间允许的情况下，子元素如何按照比例分配可用剩余空间。

如果设定为 1，则父元素中的剩余空间会分给子元素。

如果设定为 2，则在分配剩余空间时该子元素将获得其他元素二倍的空间。

> 默认值为 0，即使有剩余空间，子元素也不会放大。

```css
.item {
  flex-grow: 1;
}
```

3. flex-shrink

当空间不足时子元素的缩小比例。

4. align-self

> 可以覆盖父元素中 align-items 所设置的对齐方式

```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

> float,clear 和 vertical-align 对 flex 子元素无效。

5. flex-basis

如果 flex 容器子元素的内容为空，设置的占位空间。
