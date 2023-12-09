react 源码底层对防止 XSS 攻击做了处理，例如使用 textContent。

一个 jsx 元素到真实 DOM 的渲染，先经过 React.createElement 转成 vdom 对象，

1. createElement

[ReactDOMComponent.js#L426](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMComponent.js#L426)

```ts
export function createElement(
  type: string,
  props: Object,
  rootContainerElement: Element | Document,
  parentNamespace: string,
): Element {
  ...
  if (namespaceURI === HTML_NAMESPACE) {
    if (type === 'script') {
      // Create the script via .innerHTML so its "parser-inserted" flag is
      // set to true and it does not execute
      const div = ownerDocument.createElement('div');
      div.innerHTML = '<script><' + '/script>'; // eslint-disable-line
      // This is guaranteed to yield a script element.
      const firstChild = ((div.firstChild: any): HTMLScriptElement);
      domElement = div.removeChild(firstChild);
    }
  }
  ...
}
```

如果 jsx 是 script 标签，这里使用 innerHTML 来创建元素，避免脚本执行。

然后在 commit 阶段执行 updateProperties

2. commitUpdate

[ReactDOMHostConfig.js#L378](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMHostConfig.js#L378)

```ts
export function commitUpdate(
  domElement: Instance,
  updatePayload: Array<mixed>,
  type: string,
  oldProps: Props,
  newProps: Props,
  internalInstanceHandle: Object
): void {
  // Update the props handle so that we know which props are the ones with
  // with current event handlers.
  updateFiberProps(domElement, newProps)
  // Apply the diff to the DOM node.
  updateProperties(domElement, updatePayload, type, oldProps, newProps)
}
```

3. updateDOMProperties

[ReactDOMComponent.js#L372](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/ReactDOMComponent.js#L372)

```ts
function updateDOMProperties(
  domElement: Element,
  updatePayload: Array<any>,
  wasCustomComponentTag: boolean,
  isCustomComponentTag: boolean
): void {
  // TODO: Handle wasCustomComponentTag
  for (let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i]
    const propValue = updatePayload[i + 1]
    if (propKey === STYLE) {
      setValueForStyles(domElement, propValue)
    } else if (propKey === DANGEROUSLY_SET_INNER_HTML) {
      setInnerHTML(domElement, propValue)
    } else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue)
    } else {
      setValueForProperty(domElement, propKey, propValue, isCustomComponentTag)
    }
  }
}
```

updateDOMProperties 中判断是否通过 dangerouslySetInnerHTML 设置。再看看 setInnerHTML 和 setTextContext 区别：

4. setInnerHTML

[setInnerHTML.js#L64](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/setInnerHTML.js#L64)

```ts
const setInnerHTML = createMicrosoftUnsafeLocalFunction(function(
  node: Element,
  html: string | TrustedValue,
): void {
  ...
  node.innerHTML = (html: any);
});
```

5. setTextContent

[setTextContent.js#L21](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/setTextContent.js#L21)

```ts
let setTextContent = function(node: Element, text: string): void {
  if (text) {
    let firstChild = node.firstChild
    if (
      firstChild &&
      firstChild === node.lastChild &&
      firstChild.nodeType === TEXT_NODE
    ) {
      firstChild.nodeValue = text
      return
    }
  }
  node.textContent = text
}
```

innerHTML 会有 XSS 攻击风险，而 textContent 不会。
