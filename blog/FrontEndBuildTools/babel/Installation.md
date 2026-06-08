### Babel common package
1. @ babel/core: babel compiler core api
2. @ babel/preset-env: compilation syntax parsing of each version of javaScript (es6, 7, 8 to es5)
3. @ babel/preset-react: compile the jsx syntax
4.: compile ts syntax
5. Babel-loader: all code files are handed over to babel through babel-loader.
6. Babel-plugin-import: antd project loading on demand
> if it is a react-native project, you need to deal with flow syntax and install @ babel/preset-flow
### Ordinary js project
Installation
```sh
yarn add -D babel-loader @babel/core @babel/preset-env
```
.babelrc
```json
{
  "presets": [
    "@babel/preset-env"
  ]
}
```
Webpack.config.js
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: ['babel-loader'],
      }
    ],
  }
}
```
### Ordinary ts project
Installation
```sh
yarn add -D babel-loader @babel/core @babel/preset-env @babel/preset-typescript
```
.babelrc
```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript"
  ]
}
```
Webpack.config.js
Same as above
### React project
The above supplementary installation
```sh
yarn add -D @babel/preset-react
```
.babelrc
```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react"
  ]
}
```
Webpack.config.js
Same as above
### Flow project
Supplemental installation above
```sh
yarn add -D @babel/preset-flow
```
.babelrc
```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript",
    "@babel/preset-react",
    "@babel/preset-flow"
  ]
}
```
webpack.config.js
Same as above