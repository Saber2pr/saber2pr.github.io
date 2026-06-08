### February 2, 2021
1. Skeleton screen and Spinner represent initial request data and update data, respectively.
---
### February 1, 2021
1. Ant Design theme customization recommended practice: less compiler static compilation to replace @ primary-color
---
### January 16, 2021
1. Exception ReferenceError: Cannot access' xx' before initialization is basically due to the existence of a loop bootstrap. Therefore, aggregate export is not recommended.
---
### January 15, 2021
1. The location of Spin should be inside the container and outside the content, that is, container-> Spin- > content. The content must provide empty data placeholders.
two。 Do not abandon server-side rendering completely just because H5 does not need seo, server-side rendering can improve the experience within the first-screen viewports. No one wants to open it to be a loading. Note that ssr is required within the viewport range!
---
### January 14, 2021
1. You can't have both seo and loading speed. The way to improve access speed is to reduce the number of ssr interfaces.
2. When yarn installs dependencies, be sure to set timeout to avoid being unresponsive for a long time due to downloading some dependencies that get stuck.
3. Non-literal UI does not require ssr, such as charts. The chart interface should be requested asynchronously, which can effectively improve the speed of page access.
---
### January 13, 2021
1. Next if you need assetPrefix to be set according to environment variables, it is recommended to abandon automatic static optimization, that is, you should declare getServerSideProps for each page.
---
### January 12, 2021
1. You'd better have components under the Modal of antd. Do not render directly, because Modal is rendered asynchronously by default, and ref will directly null reference! (of course, enabling forceRender is OK, but it is not recommended.) and it is difficult to clear the subscriber when Modal is destroyed, and you can call Effect Hooks.
two。 Code management must follow the principle of downward compatibility, try not to delete the code, and the code rejects destructive refactoring (must be compatible with the original code). Each code module should be highly abstract and details should be provided by the caller. Copy and paste can effectively and quickly reduce code complexity. The meaning of code modularization is: separation of view from logic, separation of view from view, separation of logic from logic, the first point is to facilitate interface reconstruction, the second point is to beautify the code, and the third point is to reduce the mental burden. Repetitive code requires modularization.
---
### January 11, 2021
1. If you search node on dockerHub, there will be many versions. Buster means stable version, alpine simplified version and stretch old version. Alpine generally has built-in yarn and does not support the cpp plug-in. Alpine is generally recommended for front-end projects. If the project is using yarn,dockerFile, you must also use yarn,yarn.lock files to submit. If you always find that the local development is normal, you will report an error as soon as you arrive online, indicating that the project has not submitted a lock file. Lock files are used to lock dependent versions to avoid dependency conflicts, incompatibilities, and so on!
two。 When doing the exit login function, exit to achieve the same state that the site has not been visited, that is, empty the localStorage, sessionStorage, cookie and other client storage of this site! Try not to use the values in localStorage to render the interface, and maintain the uniqueness of localStorage token, that is, only rely on token to avoid other problems caused by cache.