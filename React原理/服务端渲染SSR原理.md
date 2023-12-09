### 为什么需要服务端渲染 SSR？

前端框架使用 JS 来生成 DOM 视图，并使用前端路由大大改善用户体验。但是这将面临一个致命问题，网站将无法被搜索引擎收录。搜索引擎探测你的网站时，得到的将是一个空的 HTML(仅有一个 div#root 节点)，它无法执行 bundle.js。
这将导致网站无法被人们搜索到。

### 怎么解决 SEO 问题？

React 前端框架在设计时考虑到了这一点，在 react-dom 包中提供了对 JSX 元素的序列化函数(例如 renderToString)，在搜索引擎访问网站地址时，进行预渲染，将 React JSX 节点树序列化为字符串返回给搜索引擎。这样的到的就不是一个空的 HTML 了。

### 这听起来很像 jsp，有什么区别吗？

jsp 也是在服务端预渲染，但是 jsp 毕竟不是 js，不可以在浏览器端执行。所以 jsp 网站不能实现前端路由。jsp 仅仅满足利于 SEO 而已。想要流畅的交互体验使用 react 比较好。

### 同构渲染

React 应用可以在浏览器端和服务端使用同一套代码渲染视图，即同构渲染。那么问题来了，在 React 应用中可能有 DOM 操作，在服务端是没有 DOM 接口的，这个是怎么解决的呢？

React 中有一个叫副作用的概念，凡是 DOM 操作都应该在 useEffect 中进行，而 Effect 在服务端是不会执行的。

> useLayoutEffect 会被替换成 useEffect.

### 浏览器端使用了前端路由，服务端还要吗？

当然要。因为搜索引擎是会访问路由的。但是在服务端没有 history 也没有 hash。react-router 考虑到了这一点，提供了 StaticRouter 静态路由，就是直接通过 context 将 HTTP Request 中的 url 传下去，交给各个 route 去匹配。而不用在 history 中注册监听了。

### 其他问题

1. import css 处理：使用 css-modules-require-hook 库。但是如果使用 less 预处理语言，less 提供的 render api 是异步的，而 csshook 暴露的 preprogress api 无法做异步处理。

解决办法：使用 postcss-less 库提供的 parse 函数，同步处理。

2. 服务器使用 ts-node 启动问题：不要用 ts-node，因为在 SSR 时会遇到 jsx 标记，ts-node 不会做转换所以无法识别。

解决办法：使用 tsc 将服务器源码进行编译，然后用 node 执行。
