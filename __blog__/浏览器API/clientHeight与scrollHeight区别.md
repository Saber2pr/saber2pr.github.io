### clientHeight

(只读) 元素内部的高度(单位像素)，包含内边距，但不包括水平滚动条、边框和外边距。

### scrollHeight

(只读) 一个元素内容高度的度量，包括由于溢出导致的视图中不可见内容。

### 区别

对于 document.documentElement 元素来说，clientHeight 就是视口高度，scrollHeight 是内容总长度。

体现在滚动条上，scrollHeight 就是 [滚动条轨道总长度]，元素来说，clientHeight 就是 [滚动条长度]。

> scrollTop 就是 [滚动条上端] 到 [滚动条轨道顶端] 的距离。

> document.documentElement.scrollTop + document.documentElement.clientHeight === document.documentElement.scrollHeight 时就是滚到底部了
