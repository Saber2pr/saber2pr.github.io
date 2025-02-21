Why write inline style?
In order to optimize the first screen rendering.
> Note that not all inlines are written, but a small number of styles that need to be optimized for the first screen are inline, and most of them are loaded externally.
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
For example, this Antd component comes with transition, and you don't want to flicker because of this in the first screen rendering. You need to disable transition in the inline style.
At this point, you will find that the styles under the style tag do not have intelligent prompts or syntax checking.
So I thought of vscode's styled-components plug-in:
```tsx
import styled from 'styled-components'

style.div`
  transition: none;
`
```
A closer look reveals that this plugin matches style. [string]+ template string will trigger css prompt, for example:
```tsx
var style: any

style.div`
  transition: none;
`
```
There will also be a hint!
So you can borrow this plug-in feature to implement inline style tips!
Write a styled.xxx function that returns the style tag:
```tsx
export const styled = {
  div: (css) => {
    return <style dangerouslySetInnerHTML={{ __html: css }}></style>
  }) as any,
}
```
Then the code calls:
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
In this way, the intelligent prompt of inline style is realized!
You can also further use the less compiler to achieve nesting:
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
Use:
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
Why not just use styled-components?
Because it does not support css descendant selectors!