因为项目是前后端分离的，所以一般会写一个 config 文件来管理调用的后端 api，服务端渲染和客户端 ajax 异步渲染时都要获取 config 里的 api 地址。使用 docker 部署后，为了解耦，api 就需要通过命令行参数传入。

docker 命令参数使用-e 来传入参数到容器中，容器中 nodejs 可以通过 process.env.xxx 拿到参数的值。

在 nextjs 的 config 文件中，有个 env 属性用来传递环境变量：

```js
// next.config.js
const config = {
  env: {
    API: process.env['API'],
  },
}
```

然后代码里可以通过 process.env.API 拿到值。

但是实际上只有服务端可以通过 process.env 拿到 API，浏览器端访问你会发现它是 undefined。。，这样 ajax 的时候 api 就会为 undefined 而报错。

process 变量本身是 nodejs 端的一个全局变量，它有些属性依赖 nodejs 环境，所以自然不能直接传给浏览器。但是前端脚手架们为了兼容一些库的 tree-shaking 打包，通常都会在代码中生成一个 process 变量，并设置 env.NODE_ENV 的值。

```js
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react.production.min.js')
} else {
  module.exports = require('./cjs/react.development.js')
}
```

> react 中的 tree-shaking 代码拆分。

在 nextjs 文档中关于 env 环境变量的说法是，它不会 export 到浏览器端，除非它是 `NODE_ENV` 或者它的前缀是`NEXT_PUBLIC_`。

所以需要命名为 NEXT_PUBLIC_API：

```js
// next.config.js
const config = {
  env: {
    NEXT_PUBLIC_API: process.env['API'],
  },
}
```

这样它就会被 export 到浏览器端可以访问。是不是有点魔法了，约定了前缀。。还这么长。。

还有一种办法，使用 next/config

```js
// next.config.js
const config = {
  publicRuntimeConfig: {
    env: {
      API: process.env['API'],
    },
  },
}
```

然后在代码里：

```js
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

publicRuntimeConfig.env.API
```

publicRuntimeConfig 是可以同时在服务端和浏览器端访问的。
