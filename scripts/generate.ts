import { join } from 'path'

import { origin } from '../src/config/origin'
import { checkJson } from './checkJson'
import { collectUpdates } from './collectUpdates'
import { createTree, findNodeByPath, Node, traverse } from './createTree'
import { ReadFile, WriteFile } from './node'
import { paths } from './paths'
import { updateVersion } from './updateVersion'
import { isSamePath } from './utils'

async function main() {
  // get status
  const status: Node[] = await ReadFile(paths.status).then(b =>
    JSON.parse(b.toString())
  )

  // create blog tree from md
  const tree = await createTree({ path: paths.md }, node => {
    const old = status.find(n => isSamePath(join(origin.md, n.path), node.path))
    if (old) {
      node['LastModified'] = old['LastModified']
    } else {
      status.push({ path: node.path.replace(origin.md, ''), title: node.title })
    }
  })

  // create updates from md
  const updates = await collectUpdates(paths.md)

  // update tree modified date
  for (const { path, date } of updates) {
    const node = findNodeByPath(join(origin.md, path), tree)
    if (node) {
      node['LastModified'] = date
      const old = status.find(n => {
        return isSamePath(join(origin.md, n.path), node.path)
      })
      if (old) old['LastModified'] = date
    }
  }

  // append activities
  const acts: any[] = await ReadFile(paths.acts).then(b =>
    JSON.parse(b.toString())
  )
  acts.unshift(
    ...updates.map(({ path, type, date }) => ({ type, text: path, date }))
  )

  // resolve node path
  traverse(tree, node => {
    node.path = node.path.replace(/.md$/, '')
  })

  // update version
  if (updates.length) {
    await updateVersion('DYNAMIC')
  }

  // update file
  await WriteFile(paths.blog, JSON.stringify(tree))
  await WriteFile(paths.status, JSON.stringify(status))
  await WriteFile(paths.acts, JSON.stringify(acts.slice(0, 50)))

  // check
  await checkJson(paths.blog)
  await checkJson(paths.status)
  await checkJson(paths.acts)
  await checkJson(paths.version)
}

main().catch(console.log)
