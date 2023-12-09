在PC端可以在点击事件event对象中直接拿到clientXY，但是移动端的touch事件event对象没有。主要原因是移动端存在多点触控，如图：


![MPclientXY](https://saber2pr.top/MyWeb/resource/image/MPclientXY.webp)


touch事件event对象中与坐标有关的属性有touches、targetTouches、changedTouches，它们都是数组类型。touches就是所有触摸点的集合，按照点击先后排列；targetTouches数组表示单个元素上的触摸点，例如两只手指对一个元素进行双指放大；changedTouches数组表示不同元素上的触摸。


再来说clientX，表示点击位置距离浏览器左端的距离，移动端可以利用touches[0].clientX表示。