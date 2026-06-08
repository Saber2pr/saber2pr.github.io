### Object constructor
document is an instance of the Document class
> Document is an HTMLDocument instance in html, XMLDocument instance in xml, svg.
Tag elements such as body are instances of the HTMLBodyElement class and div are HTMLDivElement instances.
### Class inheritance system
![loading](https://saber2pr.top/MyWeb/resource/image/dom-class.webp)
1. All classes inherit from Node. Node inherits from EventTarget. (not shown)
> Window inherits from EventTarget.
2. HTMLElement inherits from Element,Element, inherits from Node.
3. Document inherits from Node.
### EventTarget
> Base class.
There are three ways:
1. AddEventListener
2. RemoveEventListener
3. DispatchEvent
### Node
> extends EventTarget to become a new base class.
Commonly used properties and methods:
1. ChildNodes
2. FirstChild
3. LastChild
4. nextSibling
5. NodeType
6. NodeValue
7. OwnerDocument
8. parentNode
9. ParentElement
10. PreviousSibling
11. TextContent
### Document
> inherits from Node. Describes the common properties and methods of any type of document.
Common attributes and methods:
1. Cookie
2. Domain
3. Location
4. title
5. URL
### Element
> inherits from Node. Describes the methods and attributes common to all elements of the same kind.
Commonly used properties and methods:
1. ClassName
2. Id
3. InnerHTML
4. GetElementsByClassName
5. Scroll