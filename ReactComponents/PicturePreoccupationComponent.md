The picture img tag display requires a request to the src resource before it can be displayed. So how do you fill it with a bitmap before it is displayed?
Principle:
1. Use useState (JSX) to toggle the displayed components
```ts
const [body, alter] = useState(comp)
const destory = () => alter(null)
```
2. Set display:none first with img element
```ts
const [style, setStyle] = useState<CSSProperties>({ display: "none" })
const visu = () => setStyle({ display: "inline" })
```
3. Destroy the placeholder component in img.onLoad and set display:inline
```tsx
const [defaultImg, destory] = usePreComp(fallback)
const ref = useRef<HTMLImageElement>()

return (
  <>
    {defaultImg}
    <img
      {...props}
      style={style}
      ref={ref}
      onError={() => ref.current.remove()}
      onLoad={event => {
        destory() // 销毁占位组件
        visu() // 显示img
        onLoad && onLoad(event)
      }}
    />
  </>
)
```
Hook used to toggle display components
```ts
export const usePreComp = (comp: JSX.Element): [JSX.Element, VoidFunction] => {
  const [body, alter] = useState(comp)
  const destory = () => alter(null)
  return [body, destory]
}
```
[Complete code](https://github.com/Saber2pr/saber2pr.github.io/blob/master/src/components/pre-img/index.tsx)