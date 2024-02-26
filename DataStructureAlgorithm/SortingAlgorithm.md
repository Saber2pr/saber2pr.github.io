### Insert sort
```js
function sortInsert(array) {
  for (let i = 1; i < array.length; i++) {
    const tmp = array[i]
    let j = i - 1
    while (j >= 0 && tmp < array[j]) {
      array[j + 1] = array[j]
      j--
    }
    array[j + 1] = tmp
  }
  return array
}
```
### Binary insertion sort
```js
function sortSplit(array) {
  for (let i = 1; i < array.length; i++) {
    const tmp = array[i]
    let low = 0
    let high = i - 1
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      if (tmp < array[mid]) {
        high = mid - 1
      } else {
        low = mid + 1
      }
    }
    let j = i - 1
    for (; j >= high + 1; j--) {
      array[j + 1] = array[j]
    }
    array[j + 1] = tmp
  }
  return array
}
```
### Hill sort
```js
function sortR(array) {
  let gap = parseInt(array.length / 2)
  while (gap > 0) {
    for (let i = gap; i < array.length; i++) {
      const tmp = array[i]
      let j = i - gap
      while (j >= 0 && tmp < array[j]) {
        array[j + gap] = array[j]
        j = j - gap
      }
      array[j + gap] = tmp
    }
    gap = parseInt(gap / 2)
  }
  return array
}
```
### Bubbling sort
```js
function sortB(array) {
  const len = array.length
  for (let i = 0; i < len; i++) {
    for (let j = len - 1; j > i; j--) {
      if (array[j] < array[j - 1]) {
        tmp = array[j - 1]
        array[j - 1] = array[j]
        array[j] = tmp
      }
    }
  }
  return array
}
```
### Improved bubbling sort
```js
function sortB2(array) {
  const len = array.length
  for (let i = 0; i < len; i++) {
    let exchange = false
    for (let j = len - 1; j > i; j--) {
      if (array[j] < array[j - 1]) {
        const tmp = array[j]
        array[j] = array[j - 1]
        array[j - 1] = tmp
        exchange = true
      }
    }
    if (!exchange) return array
  }
  return array
}
```
### Quick sort
```js
function sortQ(arr) {
  if (arr.length <= 1) return arr
  const mid = Math.floor(arr.length / 2)
  const stand = arr.splice(mid, 1)[0]
  const left = []
  const right = []
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < stand) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return sortQ(left).concat([stand], sortQ(right))
}
```
### Select sort
```js
function sortSelect(array) {
  const len = array.length
  for (let i = 0; i < len; i++) {
    let k = i
    for (let j = i + 1; j < len; j++) {
      if (array[j] < array[k]) k = j
    }
    if (k != i) {
      tmp = array[k]
      array[k] = array[i]
      array[i] = tmp
    }
  }
  return array
}
```
### Heap sort
```js
function swap(array, i, j) {
  const temp = array[i]
  array[i] = array[j]
  array[j] = temp
}

function maxHeapify(array, index, heapSize) {
  while (true) {
    let iMax = index
    const iLeft = 2 * index + 1
    const iRight = 2 * (index + 1)
    if (iLeft < heapSize && array[index] < array[iLeft]) {
      iMax = iLeft
    }
    if (iRight < heapSize && array[iMax] < array[iRight]) {
      iMax = iRight
    }
    if (iMax != index) {
      swap(array, iMax, index)
      index = iMax
    } else {
      break
    }
  }
}

function buildMaxHeap(array) {
  for (let i = Math.floor(array.length / 2) - 1; i >= 0; i--) {
    maxHeapify(array, i, array.length)
  }
}

function sortHeap(array) {
  buildMaxHeap(array)
  for (let i = array.length - 1; i > 0; i--) {
    swap(array, 0, i)
    maxHeapify(array, 0, i)
  }
  return array
}
```
### Merge and sort
```js
function merge(left, right) {
  const result = []
  while (left.length || right.length) {
    if (left.length && right.length) {
      if (left[0] < right[0]) {
        result.push(left.shift())
      } else {
        result.push(right.shift())
      }
    } else if (left.length) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
  return result
}

function sortMerge(array) {
  const length = array.length
  if (length === 1) return array
  const mid = Math.floor(length * 0.5)
  const left = array.slice(0, mid)
  const right = array.slice(mid, length)
  return merge(sortMerge(left), sortMerge(right))
}
```