### document.documentElement
Returns the html element, the DOM root element.
### Document.body
Returns the body element.
```ts
document.body.parentElement === document.documentElement // true
```
### Document
Provides a global operation function, which can solve the problems of how to get the URL of the page, how to create a new element in the document and so on.
> as a general API, document can operate html, xml, svg and so on.
> document is subdivided into HTMLDocument (html), XMLDocument (xml and svg).