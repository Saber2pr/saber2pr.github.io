## 前言

github 上添加 react-like 标签的项目有 20 个左右，几乎所有的项目都是使用 Javascript 编码。
难以搞清楚一个对象的具体结构，就比如 Fiber 对象，上面有很多属性，有些是指针域，有些是对象，有些是数组，有些必选有些可选。。。
如果不对数据结构进行合理建模的话，很难掌握对象的属性变动，也难以分析潜在的 bug，更不用说优化、重构之类的了。

下面是来自某个项目的一段 JS 代码

```javascript
let oldFiber,
  newFiber,
  element,
  instance = workInProgress.stateNode;
let newState = Object.assign(
  instance.state || {},
  instance._partialState || {}
);
let oldProps = instance.props;
let newProps = workInProgress.props;
const getDerivedStateFromProps = instance.constructor.getDerivedStateFromProps;
```

从这段代码中可以大致了解到 Fiber 拥有 stateNode、props 属性，Fiber.stateNode 上有 state、partialState、props 属性同时它还是个构造函数的原型（不难看出 Fiber.stateNode 应该是个 es6 class 对象）。

是不是开始感到混乱了...

不是说 Javascript 代码不好，相反 JS 代码相对简洁，但是作为 Typescript 的忠实粉丝，我决定还是使用 TS 来重写一遍，顺便加深对 Fiber Reconcile 过程的理解。
