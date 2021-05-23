import React, { useEffect, useRef } from 'react'
import { useLoadScript } from '../../hooks'

import type { default as IHls, HlsConfig } from 'hls.js'
import { Loading } from '../loading'

type Hls = new (config?: Partial<HlsConfig>) => IHls

export const M3u8 = ({ src }: { src: string }) => {
  const ref = useRef<HTMLVideoElement>()

  const [HlsRef, loading] = useLoadScript<Hls>(
    'Hls',
    'https://cdn.jsdelivr.net/npm/hls.js@alpha'
  )

  useEffect(() => {
    const Hls = HlsRef.current
    if (ref.current && Hls) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(ref.current)
    }
  }, [src, loading])

  return (
    <>
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
    </>
  )
}
