In react components, there is often the property defaultValue, which is basically implemented as follows:
```tsx
const Component = ({ defaultValue }) => {
  const [value, setValue] = useState(defaultValue)
  return <>{value}</>
}

const App = ({ data }) => {
  return <Component defaultValue={data.content} />
}
```
You will find that no matter how the data.content changes, the defaultValue in Component will not be updated, as I discussed earlier:
[Notes on useState initialization using props](/blog/React原理/useState使用props初始化的注意点)
Is to use useEffect to update. However, there is no guarantee that all libraries will implement this.
But it can be updated with react-key!
React-key in the component diff process, if the key changes, react will first look in the childrenKeyMap, if found, it can be reused, such as list node order change. If it is not found, the component is destroyed.
So just add a key, the value is equal to the value of defaultValue on it!
```tsx
const App = ({ data }) => {
  return <Component defaultValue={data.content} key={data.content} />
}
```
In this way, when the data.content changes, the key changes, and the fiber of the component is deleted and reconstructed during the diff process! DefaultValue will naturally be updated! Of course, the premise is that no one with the same key is found in the sibling component!