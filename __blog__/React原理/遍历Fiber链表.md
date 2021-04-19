```ts
type Fiber = any

// current fiber
let workInProgress: Fiber = null
let pendingCommit: Fiber = null

// beginWork -> fiber props children (siblings)
// create new fiber list. link alternate. diff effect-tag.
function beginWork(fiber: Fiber) {
  return fiber.child
}

function performUnitOfWork(fiber: Fiber, top: Fiber) {
  const next = beginWork(fiber)
  if (next) return next
  let current = fiber
  while (current) {
    if (current === top) return current
    completeWork(current, top)
    if (current.sibling) return current.sibling
    current = current.return
  }
}

function createWorkInProgress(fiber: Fiber) {
  workInProgress = fiber
  return workInProgress
}

function renderRoot(root: Fiber) {
  if (!workInProgress) workInProgress = createWorkInProgress(root)
  while (workInProgress) {
    workInProgress = performUnitOfWork(workInProgress, root)
    if (workInProgress === root) break
  }

  if (pendingCommit) {
    commitWork(pendingCommit)
    workInProgress = null
    pendingCommit = null
  }
}

function commitWork(fiber: Fiber) {}

// return and link effect list.
let completeWork = (root: Fiber, top: Fiber) => {}

export const traverse = (fiber: Fiber, callback: (fiber: Fiber) => void) => {
  if (!fiber) return
  if (fiber._owner) {
    fiber = fiber._owner
  }
  completeWork = (root, top) => callback(root)
  renderRoot(fiber)
}
```
