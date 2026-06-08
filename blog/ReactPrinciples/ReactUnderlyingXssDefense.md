The underlying react source code deals with preventing XSS attacks, such as the use of textContent.
A rendering of a jsx element to a real DOM, which is first converted to a vdom object through React.createElement
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
If jsx is a script tag, use innerHTML here to create the element, avoiding script execution.
Then execute updateProperties in the commit phase
2. CommitUpdate
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
3. UpdateDOMProperties
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
UpdateDOMProperties to determine whether to pass the dangerouslySetInnerHTML setting. Take a look at the difference between setInnerHTML and setTextContext:
4. SetInnerHTML
[SetInnerHTML.js#L64](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/setInnerHTML.js#L64)
```ts
const setInnerHTML = createMicrosoftUnsafeLocalFunction(function(
  node: Element,
  html: string | TrustedValue,
): void {
  ...
  node.innerHTML = (html: any);
});
```
5. SetTextContent
[SetTextContent.js#L21](https://github.com/facebook/react/blob/master/packages/react-dom/src/client/setTextContent.js#L21)
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
innerHTML is at risk of XSS attacks, textContent is not.