import { createState } from '@saber2pr/redux/lib/state'

export const store = createState({
  context: null,
  blogScrollTop: 0,
  actLen: 4,
  actsScrollTop: 0,
  searchLen: 10,
  searchScrollTop: 0,
  showMusic: false,
})

export const localStore = localStorage
