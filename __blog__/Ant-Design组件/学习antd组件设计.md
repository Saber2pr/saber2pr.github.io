### 组件的结构： 组件 = 容器 -> Spin -> 内容 ?? 空数据占位

1. 容器：提供 className 设置、提供内联 style 设置，负责控制 border 样式和内容的公共样式。

2. Spin：展示 loading 时的动画

3. 内容：负责渲染数据，样式尽量从容器继承。

### 组件接口

1. 组件容器的 className 设置公共前缀即 prefixCls。（less 通过变量设置公共前缀）

2. 输入型组件提供 value 和 onChange，便于对接 form。

示例:

getPrefixCls:

```ts
import classnames from 'classnames'
import { ClassValue } from 'classnames/types'

const CommonPrefixCls = 'nextpl'

export const getPrefixCls = (suffixCls?: string, ...classes: ClassValue[]) => {
  const currentCls = suffixCls
    ? `${CommonPrefixCls}-${suffixCls}`
    : CommonPrefixCls
  return classnames(currentCls, ...classes)
}
```

组件：

```tsx
import { Spin } from 'antd'
import React, { CSSProperties } from 'react'

export interface ListView {
  loading?: boolean
  data: any
  className?: string
  style?: CSSProperties
}

export const ListView = ({ loading, data, className, style }: ListView) => {
  let content = <>暂无数据</>
  if (data) {
    content = <>{data}</>
  }
  return (
    <div className={getPrefixCls('listView', className)} style={style}>
      <Spin spinning={loading}>{content}</Spin>
    </div>
  )
}
```
