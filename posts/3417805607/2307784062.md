```ts
import { encoding_for_model } from 'tiktoken'

export const calcTokens = (str: string) => {
  const enc = encoding_for_model('gpt-4o')
  const result = enc.encode(str).length
  enc.free()
  return result
}

export const MAX_TOKENS = 128000

export const getLimitedGptQuery = (str: string) => {
  const enc = encoding_for_model('gpt-4o')

  const tokens = enc.encode(str)

  if (tokens.length < MAX_TOKENS) {
    enc.free()
    return str
  }

  const result = new TextDecoder().decode(
    enc.decode(tokens.slice(0, MAX_TOKENS))
  )
  enc.free()

  return result
}
```