import { createState } from "@saber2pr/redux/lib/state"

export const store = createState({
  context: null,
  blogScrollTop: 0,
  actLen: 10,
  actsScrollTop: 0,
  searchLen: 10,
  searchScrollTop: 0
})

export const localStore = localStorage

export const musicStore = createState({
  music: false,
  musicCurrent: 0
})
