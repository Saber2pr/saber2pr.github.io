> version: 7.1.0

### 一、状态更新流程

1. 每个Connect组件都订阅Store。(包括Provider)

> https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L361

2. Connect组件调用dispatch，整个Component树中每个Connect组件都会checkForUpdates。(即subscription.onStateChange)

> https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L309

### 二、核心

1. Provider将Store记录在ReactReduxContext

> https://github.com/reduxjs/react-redux/blob/master/src/components/Provider.js#L55

2. connect函数执行mapXXXToProps得到actualChildProps

> https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L280

> TODO We're reading the store directly in render() here. Bad idea?
> This will likely cause Bad Things (TM) to happen in Concurrent Mode.
> Note that we do this because on renders _not_ caused by store updates, we need the latest store state
> to determine what the child props should be.

这里提到了在执行mapXXXToProps时(与组件渲染同步执行)，读取了Store中的状态，可能在并发模式下出错，但是mapXXXToProps执行需要先拿到Store中的State。所以尽量保证mapXXXToProps为纯函数。

然后将actualChildProps写入WrappedComponent组件props渲染。

> https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L388

读取Context，订阅Store。

> subscription来自props.context.subscription或ReactReduxContext.subscription

> https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L361

3. 提供了hooks对FunctionComponent的支持。hooks从ReactReduxContext读取Store。

> https://github.com/reduxjs/react-redux/blob/master/src/hooks/useReduxContext.js#L22

### 三、优化

1. connectAdvanced提供shouldHandleStateChanges参数，表示组件是否订阅store。（即是否为纯展示型组件）减少了batchedUpdates任务数量。

> https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L302

2. Connect组件中获取actualChildProps时，如果Connect组件接受的Props没变化(浅比较)，则直接返回上次store.dispatch执行后的Props，不用再次执行mapXXXToProps。

> 即相同输入没必要再执行一次，属于memorization优化。

> https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L271

3. Connect组件中checkForUpdates同shouldComponentUpdate理，对新旧props做了比对。（浅比较）减少re-render。

> 用了renderIsScheduled作为组件更新状态，处理动态改变shouldHandleStateChanges引起的渲染丢失情况

> https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L336

4. 异常处理。在mapXXXToProps执行中出现的异常被缓存到previousStateUpdateResult，并向上传递。针对条件渲染中未显示的组件出现mapXXXToProps的错误在unsubscribeWrapper中处理。

> https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L372


> 更多笔记>> https://github.com/Saber2pr/react-opensource-learning