import React, { useEffect, useRef, useState } from 'react'

import Audio from '@saber2pr/rc-audio'

import { searchOneMusic, SearchOneMusicResult } from '../../api'
import { Lyric } from '../../utils/Lyric'
import { WordsInputing } from '../words-inputing'

export const KeyAudio = ({ kw }: { kw: string }) => {
  const [state, setState] = useState<{
    load: boolean
    res: SearchOneMusicResult
  }>({
    load: false,
    res: null,
  })

  const lyc = useRef<Lyric>()

  const [words, setWords] = useState<string>('')

  const clearLyc = () => {
    const lycer = lyc.current
    if (!lycer) return
    lycer.stop()
    lycer.handler = () => {}
    lyc.current = null
  }

  const playLyc = () => {
    if (state?.res) {
      const { name, artist } = state.res
      setWords(`${name}-${artist}`)
    }

    const lycer = lyc.current
    if (!lycer) return
    lycer.play()
  }
  const pauseLyc = () => {
    const lycer = lyc.current
    if (!lycer) return
    lycer.stop()
  }

  useEffect(() => {
    if (kw) {
      searchOneMusic(kw).then(res => {
        if (!res) return
        if (res.url) {
          setState({
            load: true,
            res: res,
          })

          // init lyc
          clearLyc()
          if (res.lyric) {
            lyc.current = new Lyric(res.lyric, ({ txt }) => {
              txt && setWords(txt)
            })
          }
        }
      })
    }
    return () => clearLyc()
  }, [kw])

  return (
    <>
      {state?.load && (
        <Audio
          onChange={statu => {
            if (statu === 'playing') {
              pauseLyc()
            } else {
              playLyc()
            }
          }}
          src={state?.res?.url}
        />
      )}
      <div className="audio-lyc">
        <WordsInputing cursor={false} inputs={words} next={() => {}} />
      </div>
    </>
  )
}
