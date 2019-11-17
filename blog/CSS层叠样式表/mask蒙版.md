### mask-image

指定一张图片作为蒙版。

> 蒙版就是两张图叠在一起，蒙版图中透明部分的位置会变成白色，白色部分的位置显示底图。

---

可以配合 css 渐变图使用，例如：

```css
#scroll {
  mask-image: linear-gradient(
    to right,
    transparent,
    white 10px,
    white 90%,
    transparent
  );
}
```

表示在#scroll 元素上加一层蒙版，从左到右的渐变色，开始是透明，在 10px~90%的位置为白色，最右边是透明色。

效果就是，在 scroll 左右两端显示半隐藏，用于提示还有溢出内容。

可以在首页看到效果(调节分辨率为移动端)：

[查看效果](#/)
