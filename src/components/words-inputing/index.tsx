import './style.less'

import React, { useEffect, useState } from 'react'

import { useInterval } from '../../hooks'

export interface WordsInputing {
  inputs: string
  next?: Function
  speed?: number
  interval?: number
  cursor?: boolean
}

export const WordsInputing = ({
  inputs,
  next,
  speed = 100,
  interval = 3000,
  cursor = true,
}: WordsInputing) => {
  const [text, setText] = useState('')

  useInterval(
    () => {
      if (text.length < inputs.length) {
        setText(text + inputs[text.length])
      }
    },
    text.length < inputs.length ? speed : null
  )

  useEffect(() => {
    if (text.length === inputs.length) {
      if (next) {
        next()
      } else {
        setTimeout(() => setText(''), interval)
      }
    }
  }, [text])

  useEffect(() => {
    setText('')
  }, [inputs])

  return (
    <span className="WordsInputing">
      {text}
      {cursor && <span className="cursor" />}
    </span>
  )
}
