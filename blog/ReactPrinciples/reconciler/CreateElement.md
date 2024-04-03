## JsxFactory function
The React.createElement function, which is used to generate VNode nodes and link them into VNode trees
### Function declaration
```typescript
function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]>,
  ...childNodes: JSX.Element[]
): JSX.Element
```
K generic parameters are constrained to keyof HTMLElementTagNameMap, such as "div", "a", "button" and so on. You can take a look at the definition of HTMLElementTagNameMap in the TS standard library:
```typescript
interface HTMLElementTagNameMap {
  a: HTMLAnchorElement;
  abbr: HTMLElement;
  address: HTMLElement;
  applet: HTMLAppletElement;
  area: HTMLAreaElement;
  article: HTMLElement;
  aside: HTMLElement;
  audio: HTMLAudioElement;
  b: HTMLElement;
  base: HTMLBaseElement;
  basefont: HTMLBaseFontElement;
  bdo: HTMLElement;
  blockquote: HTMLQuoteElement;
  body: HTMLBodyElement;
  br: HTMLBRElement;
  button: HTMLButtonElement;
  ...
}
```
So HTMLElementTagNameMap [K] is the attribute type that K corresponds to HTMLElement.
ChildNodes is a child node, for example
```typescript
const List = React.createElement(
  "ul",
  null,
  React.createElement("li", null),
  React.createElement("li", null)
)
```
This List is a JSX.Element instance with childNodes [{tag:"li", props:null}, {tag:"li", props:null}], rendering to the real DOM is
```html
<ul>
  <li></li>
  <li></li>
</ul>
```
### Function realization
```typescript
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]>,
  ...childNodes: JSX.Element[]
): JSX.Element {
  // 用于map的映射函数
  // 判断childNode类型，如果它是string或者number类型，则生成一个为tag为text的VNode
  // 将childNode(就是文本节点内容)作为props中nodeValue的值
  const mapper = (c: any): any =>
    typeof c === "string" || typeof c === "number"
      ? createElement("text" as "span", { nodeValue: c as string })
      : c

  // 对childNodes中每个子节点执行上面的映射函数
  const children = [].concat(...childNodes).map(mapper)
  // 将处理好的children保存在props中然后返回一个VNode节点
  return <any>{ tag, props: { ...props, children } }
}
```
Here's a very interesting operation that seems useless.
```typescript
;[].concat(...childNodes)
```
The expression [] .concat (... array) is often used to reduce the dimension of array arrays, for example
```typescript
;[].concat(...[1, 2, [3, 4]]) // [1, 2, 3, 4]
```
So when might the childNodes array become "flat"?
As an example of a scenario, there is often an operation in React components
For example, you want to get a list of a, b, c through the array ['asides,' b'].
```html
<ul>
  <li>a</li>
  <li>b</li>
  <li>c</li>
</ul>
```
JSX tags can be seen as values in React, so you can use array map to generate efficiently:
```tsx
<ul>
  {["a", "b"].map(ch => (
    <li key={ch}>{ch}</li>
  ))}
  <li>c</li>
</ul>
```
After compilation
```typescript
React.createElement(
  "ul",
  null,
  ["a", "b"].map(ch =>
    React.createElement(
      "li",
      { key: ch },
      React.createElement("text", { nodeValue: ch })
    )
  ),
  React.createElement(
    "li",
    null,
    React.createElement("text", { nodeValue: "c" })
  )
)
```
Analyze the VNode tree it generated.
```typescript
{
  tag: "ul", props: null,
  [
    {tag:"li", null,
      {tag:"text", {nodeValue: 'a'}}
    },
    {tag:"li", null,
      {tag:"text", {nodeValue: 'b'}}
    }
  ],
  {tag:"li", null,
      {tag:"text", {nodeValue: 'c'}}
  }
}
```
To simplify, it becomes the structure of ['await,' b'],'c'], and becomes not "flat"! But the structure of the three li tags should be ['averse,' baked,'c'], so the array needs to be dimensionally reduced.