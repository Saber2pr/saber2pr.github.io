There are three kinds of lists: ordered list ol, unordered list ul, and custom list dl.
### Application scenario
List display. A series of content that conforms to specific rules can be implemented using a list. (similar to arrays)
Common in: user list, product list, search results list, etc.
---
### Unordered list ul
> ul > li structure, internal list unordered number.
```html
<ul>
  <li>这是条目</li>
  <li>这是条目</li>
  <li>这是条目</li>
</ul>
```
### Ordered list ol
> ol > li structure, the sequence number is automatically added to the internal list.
Ol common properties:
1. start: serial number starting value
2. Type: serial number type (Arabic numeral, Roman, English abc)
```html
<ol>
  <li>这是1条目</li>
  <li>这是2条目</li>
  <li>这是3条目</li>
</ol>
```
### Custom list dl
> dl > dd structure, and dt represents the title of dd.
```html
<dl>
  <dt>《美好的每一天》</dt>
  <dd>一部很治愈人心的文字冒险游戏。</dd>
  <dt>《对你说再见》</dt>
  <dd>也是一部很治愈人心的文字冒险游戏。</dd>
</dl>
```