### ES7
1. Array.prototype.includes methods
```ts
;[1, 2, 3].includes(2) // true
;[1, 2, 3].includes(4) // false
```
two。 Find the power operator `* *`
```ts
2 ** 3 === 8
```
### ES8
1. Async Functions
```ts
async function get() {
  const res = await axios.get("")
  return res.data
}

const get = async () => {
  const res = await axios.get("")
  return res.data
}
```
2. SharedArrayBuffer and Atomics
ArrayBuffer that can be shared between different WebWorkers.
> will give rise to race problems.
3. Object.values and Object.entries
```ts
Object.values({ a: 1, b: 2 }) // [1, 2]

Object.entries({ a: 1, b: 2 }) // [["a", 1], ["b", 2]]
```
4. String padding
```ts
"abc".padStart(10) // "       abc"
"abc".padStart(10, "foo") // "foofoofabc"
"abc".padStart(6, "123465") // "123abc"
"abc".padStart(8, "0") // "00000abc"
"abc".padStart(1) // "abc"

"abc".padEnd(10) // "abc       "
"abc".padEnd(10, "foo") // "abcfoofoof"
"abc".padEnd(6, "123456") // "abc123"
"abc".padEnd(1) // "abc"
```
5. Object.getOwnPropertyDescriptors ()
Returns the property descriptor corresponding to a self-owned property on the specified object
6. The last comma in the function argument list and call
### ES9
1. Rest and spread of the object
```ts
const { a, ...rest } = { a: 1, b: 2, c: 3 }
rest // {b: 2, c: 3}

const [state, setState] = useState({ id: 0, name: "__" })
// 等效于 setState(new Object(Object.assgin(state, {name: 'spread'})))
setState({ ...state, name: "spread" })
```
2. Asynchronous iteration
```ts
const arrAsy = [1, 2].map(v => new Promise(res => setTimeout(res, 1000, v)))

;(async function () {
  for await (const v of arrAsy) {
    console.log(v)
  }
})()
```
> is an ordered version of Promise.all
3. Promise.prototype.finally ()
At the end of the promise, the specified callback function is executed regardless of whether the result is fulfilled or rejected.
4. Regular extension-antecedent assertion and later assertion
To assert in advance:
`? =` means that it must be followed by the specified character.
`?!` means it is not followed by the specified character.
```js
/a(?= b)/.test('a c b') //false
/a(?= b)/.test('a b c') //true

/a(?! b)/.test('a c b') // true
/a(?! b)/.test('a b c') // false
```
The following line asserts:
`? < =` means that it must be preceded by the specified character.
`? <!` means that it is not preceded by the specified character.
```js
/(?<=a) b/.test('c b') //false
/(?<=a) b/.test('a b') // true

/(?<!a) b/.test('c b') //true
/(?<!a) b/.test('a b') // false
```
5. Regular extension-named capture group
Add `?'to the front of the capture group. <name>`
```js
"abc".replace(/(a)/, "$1-") // "a-bc"

// 将$1命名为ch
"abc".replace(/(?<ch>a)/, "$<ch>-") // "a-bc"
```
### ES10
1. Flat () method and flatMap () method of Array
2. String's trimStart() and trimEnd() methods
3. Object.fromEntries ()