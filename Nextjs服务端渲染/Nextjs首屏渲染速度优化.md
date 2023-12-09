1. next/link 启用 prefetch，预加载页面资源以快速切换路由。

2. 对 cdn 使用 dns-prefetch，加速 cdn 资源访问。

3. seo 与加载速度不可兼得，提高访问速度的办法就是减少 ssr 接口（首屏渲染）的数量

4. 非文字类 UI 不需要 ssr，例如图表。图表接口应该异步请求，能有效提升页面访问速度。

5. 不要使用聚合导出，这不利于代码分割/按需引入。

6. 使用重型插件的时候，建议使用动态导入，例如 import('echarts')，可以有效减少代码体积。

7. build 之后 .next/static 下的文件通过 cdn 加载。

8. svg 尽量不要内联到代码里

9. ssr 不应该渲染权限相关内容，所以 ssr 的内容和接口是可以无差别缓存的

10. 首次加载视口范围内的内容，应尽量采用服务端渲染，避免首屏视口范围内出现 loading！

11. 首屏可以适当内联 css 优化渲染。不要滥用 transition。

12. 抽离公共 css，封装工具 css。

13. 对象引用发生变化时（通常是有解引用特性的纯函数执行例如 slice 等），使用 useMemo 进行优化。

14. antd 使用 babel-plugin-import 进行按需加载，主题定制使用 less modifyVars。如果对 antd 组件进行样式覆盖，适当进行首屏 css 内联。

15. 使用浏览器 network 检查是否存在接口重复请求，使用 performance 检查 cls 进行内联优化。

---

待更新
