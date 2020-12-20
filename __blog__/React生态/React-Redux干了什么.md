> version: 7.1.0

### 一、状态更新流程

1. 每个 Connect 组件都订阅 Store。(包括 Provider)

> 对于 Provider(组件顶层)，onStateChange 绑定 subscription.notifyNestedSubs
> 对于下层组件，onStateChange 绑定 checkForUpdates
> 所以说 store 里只注册了一个监听器，组件们的监听器都在 Provider::subscription 里
> 然后 Provider 再把 store 和 subscription 建立关联

[connectAdvanced.js#L361](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L361)

2. Connect 组件调用 dispatch，整个 Component 树中每个 Connect 组件都会 checkForUpdates。(即 subscription.onStateChange)

[connectAdvanced.js#L309](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L309)

### 二、核心

1. Provider 将 Store 记录在 ReactReduxContext

[Provider.js#L55](https://github.com/reduxjs/react-redux/blob/master/src/components/Provider.js#L55)

2. connect 函数执行 mapXXXToProps 得到 actualChildProps

[connectAdvanced.js#L280](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L280)

> TODO We're reading the store directly in render() here. Bad idea?
> This will likely cause Bad Things (TM) to happen in Concurrent Mode.
> Note that we do this because on renders _not_ caused by store updates, we need the latest store state
> to determine what the child props should be.

这里提到了在执行 mapXXXToProps 时(与组件渲染同步执行)，读取了 Store 中的状态，可能在并发模式下出错，但是 mapXXXToProps 执行需要先拿到 Store 中的 State。所以尽量保证 mapXXXToProps 为纯函数。

然后将 actualChildProps 写入 WrappedComponent 组件 props 渲染。

[connectAdvanced.js#L388](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L388)

读取 Context，订阅 Store。

> subscription 来自 props.context.subscription 或 ReactReduxContext.subscription

[connectAdvanced.js#L361](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L361)

3. 提供了 hooks 对 FunctionComponent 的支持。hooks 从 ReactReduxContext 读取 Store。

[useReduxContext.js#L22](https://github.com/reduxjs/react-redux/blob/master/src/hooks/useReduxContext.js#L22)

### 三、优化

1. connectAdvanced 提供 shouldHandleStateChanges 参数，表示组件是否订阅 store。（即是否为纯展示型组件）减少了 batchedUpdates 任务数量。

[connectAdvanced.js#L302](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L302)

2. Connect 组件中获取 actualChildProps 时，如果 Connect 组件接受的 Props 没变化(浅比较)，则直接返回上次 store.dispatch 执行后的 Props，不用再次执行 mapXXXToProps。

> 即相同输入没必要再执行一次，属于 memorization 优化。

[connectAdvanced.js#L271](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L271)

3. Connect 组件中 checkForUpdates 同 shouldComponentUpdate 理，对新旧 props 做了比对。（浅比较）减少 re-render。

> 用了 renderIsScheduled 作为组件更新状态，处理动态改变 shouldHandleStateChanges 引起的渲染丢失情况

[connectAdvanced.js#L336](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L336)

4. 异常处理。在 mapXXXToProps 执行中出现的异常被缓存到 previousStateUpdateResult，并向上传递。针对条件渲染中未显示的组件出现 mapXXXToProps 的错误在 unsubscribeWrapper 中处理。

[connectAdvanced.js#L372](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L372)
