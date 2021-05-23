import './style.less'

import React, { useEffect, useRef } from 'react'

import { useLoadScript } from '../../hooks'
import { Loading } from '../loading'

import type { default as IHls, HlsConfig } from 'hls.js'
type Hls = new (config?: Partial<HlsConfig>) => IHls

export const M3u8 = ({ src }: { src: string }) => {
  const ref = useRef<HTMLVideoElement>()

  const [Hls, loading] = useLoadScript<Hls>(
    'Hls',
    'https://cdn.jsdelivr.net/npm/hls.js@alpha'
  )

  useEffect(() => {
    if (ref.current && Hls) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(ref.current)
    }
  }, [src, loading])

  return (
    <div className="M3u8">
      {loading ? (
        <Loading />
      ) : (
        <video
          controls
          autoPlay
          className="contain-layout-content"
          ref={ref}
        ></video>
      )}
    </div>
  )
}
