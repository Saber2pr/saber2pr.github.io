按需加载适用于 ssr，因为 ssr 没有打包，是天然的代码分割。如果是 csr 那么需要 webpack 动态 import。

antd 官方提供了 babel-plugin-import 插件用于自动导入样式以及按需加载。

按需加载其实是按需导入，是 webpack 打包原理所决定的，webpack 按照 import 路径来打包，所以只要 import 的路径足够细粒度就等于实现了按需加载。

例如：

1. 如果没有使用 babel-plugin-import 插件想要实现按需加载：

```ts
// 举例，不代表真实路径
import { Button } from "antd/lib/button";
import "antd/lib/button/style.less";
```

需要把路径写得很细。

2. 如果使用了 babel-plugin-import 插件：

只需要

```ts
import { Button } from "antd";
```

一行即可实现自动导入对应样式和代码。

> 原理即是自动补全路径
