```ts
import { message } from 'antd'
import { AxiosResponse } from 'axios'
import { useEffect, useState } from 'react'

export const useFetch = <T>(
  request: () => Promise<AxiosResponse<T>>,
  initData: T = null,
  autoLoad = true
): [T, boolean, () => Promise<void>] => {
  const [result, setResult] = useState<T>(initData)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const apiRes = await request()
      setResult(apiRes.data)
    } catch (error) {
      console.log(error)
      message.error('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    autoLoad && fetchData()
  }, [autoLoad])

  return [result, loading, fetchData]
}
```
Call:
```ts
const [result, loading, refresh] = useFetch(() => fetch('/api/xxx'))
```