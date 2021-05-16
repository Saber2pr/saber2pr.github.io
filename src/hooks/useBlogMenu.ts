import { Blog } from '../pages'
import { collect } from '../utils'
import { useForceUpdate } from './useForceUpdate'

export const useBlogMenu = (blogRoot: Blog["tree"]) => {
  const forceUpdate = useForceUpdate()
  const nodes = collect(blogRoot)

  const expandTarget = (target: string) => {
    nodes.forEach(n => {
      if (target.startsWith(n.path)) {
        n.expand = true
      } else {
        n.expand = false
      }
    })
    forceUpdate()
  }

  return expandTarget
}
