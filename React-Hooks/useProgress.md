使用:

```tsx
const { modal, api: progessApi } = useProgress({ title: '正在上传' })

progessApi.set(20, '获取上传配置')

progessApi.set(100, '配置成功')
```

```tsx
import { useModal } from '@/hooks/useModal'
import { Progress } from 'antd'
import React, { useState } from 'react'

export interface WithProgressApi {
  percent: number
  isProgressing: boolean
  setVisible(visible: boolean): void
  set(value: number, text?: React.ReactNode): void
  done(): void
  init(): void
}

export interface WithProgressOptions {
  title: string
}

export const useProgress = ({ title }: WithProgressOptions) => {
  const [percent, setPercent] = useState(0)
  const [text, setText] = useState<React.ReactNode>()
  const [isProgressing, setIsProgrssing] = useState(false)

  const { modal, setVisible } = useModal({
    title,
    content: (
      <>
        {text && <div>{text}</div>}
        <Progress percent={percent} />
      </>
    ),
    okButtonProps: { hidden: true },
    cancelButtonProps: { hidden: true },
    closable: true,
    maskClosable: true,
  })

  const api: WithProgressApi = {
    percent,
    isProgressing,
    setVisible,
    done() {
      setPercent(100)
      setVisible(false)
      setIsProgrssing(false)
      setText(null)
    },
    init() {
      setPercent(0)
      setVisible(true)
      setIsProgrssing(true)
      setText(null)
    },
    set(value, text) {
      setIsProgrssing(true)
      if (value >= 100) {
        api.done()
      } else {
        setPercent(Number(Number(value).toFixed(2)))
      }
      setText(text)
    },
  }

  return { modal, api }
}
```
