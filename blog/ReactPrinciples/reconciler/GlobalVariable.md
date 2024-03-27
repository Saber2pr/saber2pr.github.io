## Overview
There are four variables in the global scope when scheduling updates
```typescript
const updateQueue: Fiber[] = [];
let workInProgress: Fiber;
let pendingCommit: Fiber;
let currentFiber: Fiber;
```
### UpdateQueue
A task queue. Used to register the Fiber linked list to be scheduled for updates. When the browser is idle, it will take out the Fiber linked list and start scheduling updates.
### WorkInProgress
A snapshot of the Fiber linked list during an iterative update (replacement of the old and new).
### PendingCommit
Fiber linked list marked with EffectType collected during workLoop, waiting for commit.
### CurrentFiber
The updated Fiber node is currently being scheduled. A copy of this value is read and cached in Hook API (save live, that is, yield), which is used to return to the scene after rendering.