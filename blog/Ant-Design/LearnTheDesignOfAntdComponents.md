### Component structure: component = container-> Spin-> content? Empty data occupancy
1. Container: provides className settings, provides inline style settings, and is responsible for controlling the common style of border style and content.
2. Spin: animation showing loading
3. Content: responsible for rendering data, the style is inherited from the container as far as possible.
### Component interface
1. The className setting of the component container has a common prefix that is prefixCls. (less sets the common prefix through variables)
two。 Input components provide value and onChange to facilitate docking of form.
Example:
GetPrefixCls:
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
Components:
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
Vscode code snippet:
> enter jsx-comp to trigger
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
Component Design 2
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