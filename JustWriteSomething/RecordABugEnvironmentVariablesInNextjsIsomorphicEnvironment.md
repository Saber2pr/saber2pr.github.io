Because the project is separated from the front and rear ends, a config file is usually written to manage the calling backend api. Both server rendering and client ajax asynchronous rendering need to obtain the api address in the config. After deployment using docker, api needs to be passed in through command line arguments in order to decouple.
The docker command parameter uses-e to pass the parameter to the container, and the nodejs in the container can get the value of the parameter through process.env.xxx.
In the config file of nextjs, there is an env attribute to pass environment variables:
```js
// next.config.js
const config = {
  env: {
    API: process.env['API'],
  },
}
```
Then the code can get the value through process.env.API.
But in fact, only the server can get the API through process.env, and when you visit the browser, you will find it is undefined. So that api will report an error for undefined when ajax
The process variable itself is a global variable on the nodejs side, and some of its properties depend on the nodejs environment, so naturally it cannot be passed directly to the browser. But in order to be compatible with the tree-shaking packaging of some libraries, front-end scaffolding usually generates a process variable in the code and sets the value of env.NODE_ENV.
```js
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react.production.min.js')
} else {
  module.exports = require('./cjs/react.development.js')
}
```
> tree-shaking code splitting in react.
The saying about the env environment variable in the nextjs document is that it will not export to the browser side unless it is `NODE_ ENV` or its prefix is `NEXT_PUBLIC_ `.
So you need to name it NEXT_PUBLIC_API:
```js
// next.config.js
const config = {
  env: {
    NEXT_PUBLIC_API: process.env['API'],
  },
}
```
In this way, it can be accessed by export to the browser. Is not a little magic, agreed on the prefix. It's still so long.
Another way is to use next/config
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
And then in the code:
```js
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

publicRuntimeConfig.env.API
```
publicRuntimeConfig is accessible on both the server and browser side.