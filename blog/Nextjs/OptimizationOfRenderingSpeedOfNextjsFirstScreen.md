1. Next/link enables prefetch, and preloads page resources to quickly switch routes.
2. Use dns-prefetch for cdn to speed up access to cdn resources.
3. You can't have both seo and loading speed. The way to improve access speed is to reduce the number of ssr interfaces (first screen rendering).
4. Non-literal UI does not require ssr, such as charts. The chart interface should be requested asynchronously, which can effectively improve the speed of page access.
5. Do not use aggregate exports, which is not good for code segmentation / on-demand introduction.
6. When using heavy plug-ins, it is recommended to use dynamic imports, such as import ('echarts'), which can effectively reduce the size of the code.
7. Files under .Next / static after build are loaded through cdn.
8. Svg try not to inline into the code
9. Ssr should not render permission-related content, so the content and interface of ssr can be cached indiscriminately
10. If you load the content within the scope of the viewport for the first time, you should use server rendering as far as possible to avoid loading in the scope of the first screen viewport!
11. The first screen can be properly inline css to optimize rendering. Don't abuse transition.
twelve。 Extract the public css and encapsulate the tool css.
13. When object references change (usually pure functions with dereferencing features such as slice, etc.), useMemo is used for optimization.
14. Antd uses babel-plugin-import for demand loading and theme customization uses less modifyVars. If there is a style overlay for the antd component, the first screen css should be inlined appropriately.
15. Use the browser network to check if there are duplicate requests for interfaces, and use performance to check cls for inline optimization.
---
To be updated