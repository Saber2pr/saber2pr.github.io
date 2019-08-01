## 更新 DOM

dom 操作

### 函数声明

```typescript
type Dict = { [k: string]: any };

function updateHostProperties(
  dom: (HTMLElement | Text) & Dict,
  oldProps: Dict,
  newProps: Dict
): void;
```

三个参数，dom 的类型为 HTMLElement 或者 Text，`& Dict`用于给这俩个类型添加属性索引，第二个参数为 dom 节点旧的属性，即 host Fiber 的 alternate.props，第三个参数为新的 host Fiber 的 props，由 React.createElement 生成的 VNode 节点提供。

### 函数实现

```typescript
// props中需要过滤掉的属性
const fiberProps = ["children", "ref"];

function updateHostProperties(
  dom: (HTMLElement | Text) & Dict,
  oldProps: Dict,
  newProps: Dict
) {
  // 遍历newProps属性，diff
  Object.entries(newProps).forEach(([k, v]) => {
    // 过滤属性
    if (fiberProps.includes(k)) return;
    // style属性过滤掉，下文单独处理
    if (k === "style") return;
    // 新旧值没变化，跳过此次DOM操作
    if (oldProps[k] === v) return;
    // on开头的event事件handle变lower case
    if (k.startsWith("on")) k = k.toLowerCase();
    // 应用变化的属性到真实DOM
    dom[k] = v;
  });
  // style属性diff
  if ("style" in dom) {
    const newStyle = newProps.style || {};
    const oldStyle = oldProps.style || {};
    Object.entries(newStyle).forEach(([k, v]) => {
      // 新旧样式属性没变化，跳过此次DOM操作
      if (oldStyle[k] === v) return;
      // 应用变化的样式属性到真实DOM
      dom.style[k] = v;
    });
  }
}
```
