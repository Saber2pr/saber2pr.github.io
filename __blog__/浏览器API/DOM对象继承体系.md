### 对象构造器

document 是 Document 类的实例

> 在 html 里，document 是 HTMLDocument 实例，在 xml、svg 里是 XMLDocument 实例。

标签元素如 body 是 HTMLBodyElement 类的实例，div 是 HTMLDivElement 实例。

### 类继承体系

![loading](https://saber2pr.top/MyWeb/resource/image/dom-class.webp)

1. 所有类都继承自 Node。而 Node 继承自 EventTarget。(图中未画出)

> Window 继承自 EventTarget。

2. HTMLElement 继承自 Element，Element 继承自 Node。
3. Document 继承自 Node。

### EventTarget

> 基类。

三个方法：

1. addEventListener
2. removeEventListener
3. dispatchEvent

### Node

> 扩展了 EventTarget，成为新的基类。

常用的属性和方法：

1. childNodes
2. firstChild
3. lastChild
4. nextSibling
5. nodeType
6. nodeValue
7. ownerDocument
8. parentNode
9. parentElement
10. previousSibling
11. textContent

### Document

> 继承自 Node。描述了任何类型的文档的通用属性与方法。

常用的属性和方法：

1. cookie
2. domain
3. location
4. title
5. URL

### Element

> 继承自 Node。描述了所有相同种类的元素所普遍具有的方法和属性。

常用的属性和方法：

1. className
2. id
3. innerHTML
4. getElementsByClassName
5. scroll
