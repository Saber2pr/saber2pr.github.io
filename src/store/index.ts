import { createState } from "@saber2pr/redux/lib/state"

export const store = createState({
  context: "",
  actLen: 10,
  blogScrollTop: 0,
  actsScrollTop: 0
})

export const localStore = localStorage

export const musicStore = createState({
  music: false,
  musicCurrent: 0
})
