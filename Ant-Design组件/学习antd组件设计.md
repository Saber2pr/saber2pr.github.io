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

export interface ListViewProps {
  loading?: boolean
  data: any
  className?: string
  style?: CSSProperties
}

export const ListView = ({
  loading,
  data,
  className,
  style,
}: ListViewProps) => {
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

vscode 代码片段：

> 输入 jsx-comp 回车触发

```json
{
  "Print to console": {
    "prefix": "jsx-comp",
    "body": [
      "import './style.less'",
      "",
      "import { Spin } from 'antd'",
      "import classnames from 'classnames'",
      "import React, { CSSProperties } from 'react'",
      "",
      "export interface ${1:Component}Props {",
      "  loading?: boolean",
      "  data: any",
      "  className?: string",
      "  style?: CSSProperties",
      "}",
      "",
      "export const ${1:Component} = ({",
      "  loading,",
      "  data,",
      "  className,",
      "  style,",
      "}: ${1:Component}Props) => {",
      "  let content = <>暂无数据</>",
      "  if (data) {",
      "    content = <>内容</>",
      "  }",
      "  return (",
      "    <div className={classnames('${1:Component}', className)} style={style}>",
      "      <Spin spinning={loading}>{content}</Spin>",
      "    </div>",
      "  )",
      "}"
    ],
    "description": "jsx comp tpl."
  }
}
```

---

组件设计2

```tsx
import { Empty, Skeleton } from 'antd';
import React, { CSSProperties } from 'react';

export interface ListViewProps {
  loading?: boolean;
  data: any;
  className?: string;
  style?: CSSProperties;
}

export const ListView = ({ loading, data, className, style }: ListViewProps) => {
  let children = <></>;
  if (loading) {
    children = <Skeleton active title paragraph />;
  } else if (data) {
    children = <span>{data}</span>;
  } else {
    children = <Empty description="无法加载" />;
  }

  return (
    <div className={getPrefixCls('listView', className)} style={style}>
      {children}
    </div>
  );
};
```
