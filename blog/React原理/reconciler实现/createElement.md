## jsxFactory 函数

即 React.createElement 函数，用于生成 VNode 节点并链接成 VNode 树

### 函数声明

```typescript
function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]>,
  ...childNodes: JSX.Element[]
): JSX.Element
```

K 泛型参数约束为 keyof HTMLElementTagNameMap，例如"div"、"a"、"button"等，可以看看 TS 标准库中对 HTMLElementTagNameMap 的定义:

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

所以 HTMLElementTagNameMap[K]就是 K 对应 HTMLElement 的属性类型。

childNodes 为子节点，举个例子

```typescript
const List = React.createElement(
  "ul",
  null,
  React.createElement("li", null),
  React.createElement("li", null)
)
```

这个 List 是个 JSX.Element 实例，其 childNodes 为[{tag:"li", props:null}, {tag:"li", props:null}]，渲染到真实 DOM 就是

```html
<ul>
  <li></li>
  <li></li>
</ul>
```

### 函数实现

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

这里有个非常有趣的操作，看似无用

```typescript
;[].concat(...childNodes)
```

[].concat(...array) 这个表达式常用来对 array 数组降维，例如

```typescript
;[].concat(...[1, 2, [3, 4]]) // [1, 2, 3, 4]
```

那么 childNodes 数组什么时候可能会变的不“平坦”呢？

举个场景例子，在 React 组件中常有一种操作

比如想通过数组['a', 'b']得到一个 a, b, c 的列表

```html
<ul>
  <li>a</li>
  <li>b</li>
  <li>c</li>
</ul>
```

在 React 中 JSX 标签可以看作是值，那么可以使用数组 map 来高效生成：

```tsx
<ul>
  {["a", "b"].map(ch => (
    <li key={ch}>{ch}</li>
  ))}
  <li>c</li>
</ul>
```

编译之后

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

分析一下它生成的 VNode 树

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

简化一下就是变成了[['a', 'b'], 'c']的结构，变不“平坦”了！但是三个 li 标签在结构上应该是['a', 'b', 'c']才对，所以需要数组降维。
