### Why do I need the server to render SSR?
The front-end framework uses JS to generate DOM views and uses front-end routing to greatly improve the user experience. But this will face a fatal problem, the website will not be included by search engines. When a search engine probes your site, it will get an empty HTML (only one div#root node), which will not be able to perform bundle.js.
This will make the site inaccessible to people.
### How to solve the SEO problem?
The React front-end framework is designed with this in mind, providing serialization functions for JSX elements (such as renderToString) in the react-dom package, pre-rendering when the search engine visits the site address, serializing the React JSX node tree into a string and returning it to the search engine. In this way, it will not be an empty HTML.
### It sounds a lot like jsp. What's the difference?
Jsp is also pre-rendered on the server side, but jsp is not a js after all and cannot be executed on the browser side. Therefore, jsp websites can not implement front-end routing. Jsp is only good for SEO. It's better to use react for a smooth interactive experience.
### Isomorphic rendering
React applications can render views using the same set of codes on both the browser side and the server side, that is, isomorphic rendering. So the problem is, there may be DOM operations in React applications, but there is no DOM interface on the server. How to solve this?
There is a concept called side effect in React. All DOM operations should be done in useEffect, while Effect is not performed on the server side.
> useLayoutEffect will be replaced with useEffect.
### The front-end route is used on the browser side, do you want the server side?
Of course I do. Because search engines access routing. But there is no history or hash on the server side. React-router takes this into account and provides a StaticRouter static route, which passes the url in the HTTP Request directly through the context and gives it to each route to match. Instead of registering listeners in history.
### other issues
1. Import css processing: use the css-modules-require-hook library. However, if you use the less preprocessing language, the render api provided by less is asynchronous, while the preprogress api exposed by csshook cannot be processed asynchronously.
Solution: use the parse function provided by the postcss-less library and process it synchronously.
two。 Server startup problem with ts-node: do not use ts-node, because you will encounter a jsx tag when you SSR, and ts-node cannot recognize it because it does not do a transformation.
Solution: use tsc to compile the server source code and then execute it with node.