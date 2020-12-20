### ES7

1. Array.prototype.includes 方法

```ts
;[1, 2, 3].includes(2) // true
;[1, 2, 3].includes(4) // false
```

2. 求幂运算符`**`

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

2. SharedArrayBuffer 和 Atomics

可以在不同 WebWorkers 之间共享的 ArrayBuffer。

> 会引起竞态问题。

3. Object.values 和 Object.entries

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

5. Object.getOwnPropertyDescriptors()

返回指定对象上一个自有属性对应的属性描述符

6. 函数参数列表和调用中的尾逗号

### ES9

1. 对象的 rest 以及 spread

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

> 是Promise.all的有序版本

3. Promise.prototype.finally()

在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。

4. 正则扩展--先行断言以及后行断言

先行断言:

`?=`表示后面必须跟指定的字符。
`?!`表示后面不跟指定的字符。

```js
/a(?= b)/.test('a c b') //false
/a(?= b)/.test('a b c') //true

/a(?! b)/.test('a c b') // true
/a(?! b)/.test('a b c') // false
```

后行断言:

`?<=`表示前面必须跟指定的字符。
`?<!`表示前面不跟指定的字符。

```js
/(?<=a) b/.test('c b') //false
/(?<=a) b/.test('a b') // true

/(?<!a) b/.test('c b') //true
/(?<!a) b/.test('a b') // false
```

5. 正则扩展--命名捕获组

在()捕获组里前面添加`?<name>`

```js
"abc".replace(/(a)/, "$1-") // "a-bc"

// 将$1命名为ch
"abc".replace(/(?<ch>a)/, "$<ch>-") // "a-bc"
```

### ES10

1. Array 的 flat()方法和 flatMap()方法
2. String 的 trimStart()方法和 trimEnd()方法
3. Object.fromEntries()
