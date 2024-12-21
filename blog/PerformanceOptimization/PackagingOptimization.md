1. Use the import () function to split out larger modules that are not used on every page, such as import ('echarts').
two。 When using the moment library, be careful to separate the language pack, using webpack.IgnorePlugin:
```js
new webpack.IgnorePlugin(/\.\/locale/, /moment/)

// 再导入中文包
import 'moment/locale/zh-cn'
```
3. Note the aggregate export of some libraries, check whether it can be imported in blocks, such as react-use:
```ts
// 错误
import useInterval from 'react-use'
// 正确
import useInterval from 'react-use/lib/useInterval'
```
4. Avoid using aggregate exports
In fact, every time I write an aggregate export, I feel like it affects code segmentation:
```ts
// c.ts
export * from './a'
export * from './b'

// d.ts
import { a } from './c'
```
In this way, even if b is not used in d, b is packaged as a result of aggregation export.
The advantage of aggregate exports may be to reduce the number of import statements at the top of the file. However, if the node server is not packaged, the impact of aggregate export should not be significant.