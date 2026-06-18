Sometimes you may need a function like this:
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
However, in react, it is not recommended to access external variables (side effects) in the component. You can use useRef to modify it:
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