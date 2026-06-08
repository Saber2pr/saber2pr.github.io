Demand loading works for ssr because ssr is not packaged and is a natural code segmentation. If it is csr, then webpack dynamic import is required.
Antd officially provides the babel-plugin-import plug-in for automatic style import and on-demand loading.
On-demand loading is actually imported on demand, which is determined by the principle of webpack packaging. Webpack is packaged according to the import path, so as long as the path of import is fine-grained enough, it is equivalent to implementing on-demand loading.
For example:
1. If you don't use the babel-plugin-import plug-in, you want to implement demand loading:
```ts
// 举例，不代表真实路径
import { Button } from "antd/lib/button";
import "antd/lib/button/style.less";
```
The path needs to be written in detail.
two。 If you use the babel-plugin-import plug-in:
only need
```ts
import { Button } from "antd";
```
One line can automatically import the corresponding style and code.
> the principle is to automatically complete the path