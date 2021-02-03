next 等服务端渲染框架都只能在 page 页面进行 server-side 数据请求，组件内部只能通过 http 请求数据，所以经常会在 page 页面通过 props 向下一层一层地把数据传递到组件。

一般遇到这种问题在 react 中会用 context 来解决。next.js 作为 react ssr 框架也可以使用 context，在自定义 App 中可以统一拦截到页面请求到的数据（或者直接取`__NEXT_DATA__` ），然后把数据设置到 context ，通常设置为 initialReduxState，然后组件中直接 useSelector 获取 ssr 数据。

next redux 规则：页面所有数据放在 initialReduxState 中，ssr 的数据设置具体值，csr 的数据在 ssr 时设置为 null，
