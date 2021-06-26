```js
const cdn = '//cdn.jsdelivr.net/gh'
const username = 'saber2pr'
const repo = 'react-ts'
const pages_branch = 'gh-pages'

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
