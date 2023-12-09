不是/api开头方向代理需要自定义server：

```js
const express = require('express');
const next = require('next');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const argv = require('minimist')(process.argv.slice(2), {
  alias: {
    h: 'help',
    H: 'hostname',
    p: 'port',
    d: 'dev',
  },
  boolean: ['h', 'd'],
  string: ['H'],
  default: {
    p: 3000,
    d: false,
  },
});

const app = next({ dev: argv.dev, dir: path.join(__dirname, 'client') });
const handle = app.getRequestHandler();

const isDev = !!argv.dev;

// 本地代理
const devProxy = createProxyMiddleware({
  target: 'http://127.0.0.1:3111',
  changeOrigin: true,
  pathRewrite: {
    '^/dev-api': '/api', // rewrite path
  },
});

app
  .prepare()
  .then(() => {
    const server = express();
    if (isDev) {
      server.use('/dev-api/*', cors());
      server.all('/dev-api/*', devProxy);
    }

    const paths = [/\/panel*/, /\/ui*/, /\/power*/, /\/asset*/];

    paths.forEach((p) => {
      server.get(p, (req, res) => {
        const actualPage = '/';
        app.render(req, res, actualPage, {});
      });
    });

    server.all('*', (req, res) => handle(req, res));

    server.listen(argv.port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${argv.port}`);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
```
