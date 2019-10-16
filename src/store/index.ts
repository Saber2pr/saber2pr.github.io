import { createState } from "@saber2pr/redux/lib/state"

export const store = createState({
  href: "/home",
  music: false,
  musicCurrent: 0,
  context: "",
  blogRoot: ""
})

export const localStore = localStorage
