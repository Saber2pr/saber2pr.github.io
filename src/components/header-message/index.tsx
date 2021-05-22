import './style.less'

import React, { useEffect, useRef, useState } from 'react'

import { getTimeMessage } from '../../utils'

export interface HeaderMessage { }

export const TimeMessageInterval = 6000

export const TimeMessage: React.FC<{ msg: string }> = ({ msg }) => {
  const ref = useRef<HTMLSpanElement>()

  useEffect(() => {
    if (msg) {
      const el = ref.current
      if (el) {
        el.style.display = 'inline'
      }
      setTimeout(() => {
        if (el) {
          el.style.display = 'none'
        }
      }, TimeMessageInterval)
    }
  }, [msg])

  return (
    <span
      className="time-message"
      ref={ref}
    >
      {msg}
    </span>
  )
}

export const HeaderMessage = ({ }: HeaderMessage) => {
  const [msg, setMsg] = useState(getTimeMessage())

  return <div className="HeaderMessage">
    <TimeMessage msg={msg} />
  </div>
}
