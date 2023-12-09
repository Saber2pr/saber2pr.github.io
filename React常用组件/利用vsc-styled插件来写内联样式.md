为什么要写内联样式？

为了优化首屏渲染。

> 注意不是都写内联，是少部分需要优化首屏的样式内联，大部分还是靠外部加载的样式。

```tsx
const App = () => {
  return (
    <div class="App" >
      <style>
        .App .block {
          transition: none;
        }
      </style>
      <Antd className="block"></Antd>
    </div>
  )
}
```

比如这个 Antd 组件自带 transition，而首屏渲染时不希望因为这个造成闪烁，需要内联样式禁用 transition。

这时会发现 style 标签下的样式是没有智能提示和语法检查的。

于是想到了 vscode 的 styled-components 插件：

```tsx
import styled from 'styled-components'

style.div`
  transition: none;
`
```

仔细研究，会发现这个插件匹配到 style.[string]+模板字符串 就会触发 css 提示，例如:

```tsx
var style: any

style.div`
  transition: none;
`
```

这样也会有提示！

所以可以借用这个插件特性来实现内联样式的提示！

写一个 styled.xxx 函数，返回 style 标签：

```tsx
export const styled = {
  div: (css) => {
    return <style dangerouslySetInnerHTML={{ __html: css }}></style>
  }) as any,
}
```

然后代码里调用:

```tsx
// 不内联的其他样式
import './style.less'

const App = () => {
  return (
    <div class="App">
      {styled.div`
        .App .block {
          transition: none;
        }
      `}
      <Antd className="block"></Antd>
    </div>
  )
}
```

这样就实现了内联样式的智能提示！

还可以进一步利用 less 编译器实现嵌套：

```tsx
import less from 'less'

type InlineCSSText = (...args: any) => string
type InlineCSSRenderer = (...args: any) => JSX.IntrinsicElements['style']

const getInputCSS = (strs: string[], values: string[]) => {
  values = values.concat('')
  let i = 0
  let result = ''
  for (; i < strs.length; i++) {
    result += strs[i] + values[i]
  }
  return result
}

export const styled = {
  _: ((strs: string[], ...values: string[]) => {
    return getInputCSS(strs, values)
  }) as InlineCSSText,
  css: ((strs: string[], ...values: string[]) => {
    const inputcss = getInputCSS(strs, values)
    let __html = inputcss
    return <style dangerouslySetInnerHTML={{ __html }} />
  }) as InlineCSSRenderer,
  less: ((strs: string[], ...values: string[]) => {
    const inputcss = getInputCSS(strs, values)
    let __html = inputcss
    less.render(inputcss, (_, output) => {
      __html = output.css
    })
    return <style dangerouslySetInnerHTML={{ __html }} />
  }) as InlineCSSRenderer,
}
```

使用:

```tsx
// 不内联的其他样式
import './style.less'

const App = () => {
  return (
    <div class="App">
      {styled.less`
        .App {
          .block {
            transition: none;
          }
        }
      `}
      <Antd className="block"></Antd>
    </div>
  )
}
```

为什么不直接用 styled-components？

因为它不支持 css 子代选择器！
