This is the third-party library on which the website project depends.
1. Dependencies production environment dependence
```js
{
  "@saber2pr/md2jsx": "^0.0.7",
  "@saber2pr/memo": "^0.0.2",
  "@saber2pr/rc-audio": "^0.0.9",
  "@saber2pr/rc-gitment": "^0.0.4",
  "@saber2pr/rc-tree": "^0.1.4",
  "@saber2pr/react-router": "^0.0.2",
  "@saber2pr/redux": "^0.1.1",
  "@saber2pr/request": "^0.1.2",
  "@saber2pr/secret": "^0.0.4",
  "@saber2pr/tree-lang": "^0.0.9",
  "@types/react": "^16.8.19",
  "@types/react-dom": "^16.8.4",
  "animate.css": "^3.7.2",
  "normalize.css": "^8.0.1",
  "react": "^16.8.6",
  "react-dom": "^16.8.6"
}
```
2. DevDependencies development environment depends on
```js
{
  "@saber2pr/gen-comp": "^0.0.1",
  "@saber2pr/gen-index": "^0.0.2",
  "@saber2pr/git": "^0.0.2",
  "@saber2pr/node": "^0.3.0",
  "@saber2pr/webpack-configer": "0.0.9",
  "cross-env": "^5.2.0",
  "css-loader": "^2.1.1",
  "extract-text-webpack-plugin": "^4.0.0-beta.0",
  "html-webpack-plugin": "^3.2.0",
  "less": "^3.9.0",
  "less-loader": "^5.0.0",
  "less-plugin-clean-css": "^1.5.1",
  "style-loader": "^0.23.1",
  "ts-loader": "^6.0.2",
  "ts-node": "^8.3.0",
  "typescript": "^3.6.3",
  "url-loader": "^2.0.0",
  "webpack": "^4.33.0",
  "webpack-cli": "^3.3.3",
  "webpack-dev-server": "^3.7.1"
}
```
Basically are very common libraries and technology stacks. The UI library uses react, redux, and react-router. The language uses typescript and less. The build tool uses webpack.
The website is hosted on the github server, which is parsed by Aliyun DNS to point from https://saber2pr.top to https://saber2pr.github.io.
The website blog writes the markdown file in the blog folder. Executing the build command parses the blog directory tree to generate directory data and modify logs.
The blog is updated asynchronously, using HTTP to request markdown text resources on the server, and then parsing and rendering.
The comment function requires logging in with a github account, using access_token for authentication (OAuth), and caching token locally.
---
Updated on 2020-1-27:
The comment function is removed first, because it involves the cross-domain reverse generation of access_token acquisition, which is still based on the back-end environment of githubpage, so it cannot be implemented.
> the original solution was to use the free reverse service cors-anywhere, but the speed was too slow, so I gave up.