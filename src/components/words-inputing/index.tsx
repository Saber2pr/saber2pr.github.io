import './style.less'

import React, { useEffect, useState } from 'react'

import { useInterval } from '../../hooks'

export interface WordsInputing {
  inputs: string
  next?: Function
  speed?: number
  interval?: number
}

export const WordsInputing = ({
  inputs,
  next,
  speed = 100,
  interval = 3000,
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

  return (
    <span className="WordsInputing">
      {text}
      <span className="cursor" />
    </span>
  )
}
