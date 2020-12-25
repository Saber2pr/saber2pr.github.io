有时候可能需要这样一个函数：

```ts
let value = 'this is value'

const getOnceValue = () => {
  const onceValue = value
  value = null
  return onceValue
}

const initValue = getOnceValue()
const value = initValue ? initValue : getValue()
```

但是在react中，不建议在组件中访问外部变量(副作用)。可以使用useRef来改造它：

```ts
import { useRef } from 'react'

export const useOnceValue = <T>(value: T) => {
  const ref = useRef(value)
  const getInitPickerDate = () => {
    const onceValue = ref.current
    ref.current = null
    return onceValue
  }
  return getInitPickerDate
}

const initValue = useOnceValue('this is value')
const value = initValue ? initValue : getValue()
```