import { createState } from "@saber2pr/redux/lib/state"

export const store = createState({
  href: "/home",
  context: "",
  blogRoot: ""
})

export const localStore = localStorage

export const musicStore = createState({
  music: false,
  musicCurrent: 0
})
