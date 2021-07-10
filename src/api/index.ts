import { axios } from '../request/axios'
import { jsonp } from '../request/jsonp'
import { ApiUrls } from './apiUrls'

export const get163Msg = async () => {
  const res = await axios.get<string>(ApiUrls.comments163)
  const text = res.data
  if (text) {
    const contentEnd = text.indexOf('来自@')
    const anthEnd = text.indexOf('在「')
    return text.slice(0, contentEnd) + '@' + text.slice(contentEnd + 3, anthEnd)
  }
}

export type SearchOneMusicResult = {
  url: string
  lyric: any
  name: string
  artist: string
}
export const searchOneMusic = async (
  keywords: string
): Promise<SearchOneMusicResult> => {
  const list = await jsonp<
    {
      id: string
      name: string
      artist: string
      album: string
    }[]
  >(ApiUrls.musicService, {
    types: 'search',
    count: 1,
    source: 'netease',
    pages: 1,
    name: keywords,
  })

  const result = list?.[0]
  if (result) {
    const { id, name, artist } = result
    const music = await jsonp<{ url: string }>(ApiUrls.musicService, {
      types: 'url',
      id,
      source: 'netease',
    })

    const { lyric, tlyric } = await jsonp(ApiUrls.musicService, {
      types: 'lyric',
      id,
      source: 'netease',
    })

    return {
      url: music.url,
      lyric: tlyric || lyric,
      name,
      artist,
    }
  }
}
