```js
const cdn = '//cdn.jsdelivr.net/gh'
const username = 'saber2pr'
const pages_branch = 'gh-pages'
const repo = 'react-ts' // github 仓库

module.exports = {
  output: {
    publicPath:
      process.env.NODE_ENV === 'production'
        ? `${cdn}/${username}/${repo}@${pages_branch}/`
        : '/',
  },
}
```

[Saber2pr/react-ts](https://github.com/Saber2pr/react-ts)
