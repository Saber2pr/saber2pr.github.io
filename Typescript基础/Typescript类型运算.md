首先有这么一个类型

```ts
type Test = {
  a: string
  b: number
}
```

怎么给它增加一个属性呢？

在解决这个问题之前，先了解一下 typescript 的基础操作：

### keyof

获取一个类型的所有属性集合(union)

```ts
type keys = keyof Test // "a" | "b
```

keyof 运算符用来获取一个类型的所有属性集合

### `|` 运算符

扩增 union

```ts
type result = keys | "c" // "a" | "b" | "c"
```

这个很简单。

### mapped type

遍历 union

```ts
type result = { [P in keys]: Test[P] }
```

这段代码相当于如下伪代码

```ts
var result = keys.map(P => Test[P])
```

就是把 Test 类型映射为另外一种类型

### extends

条件语句

```ts
type isExtendsA = keys extends "a" ? "yes" : "no" // "no"
type isExtendsAB = keys extends "a" | "b" ? "yes" : "no" // "yes"
```

extends 在 typescript 里被称作条件语句，用来判断一个类型是否是指定类型的子集

---

有以上基础就可以实现我们的需求了：

比如给 Test 类型增加一个属性 c，类型是 Function 类型

首先先获取它的 union

```ts
type Test = {
  a: string
  b: number
}

type keys = keyof Test // "a" | "b"
```

给 keys 增加一个"c"

```ts
type keys_added_c = keys | "c" // "a" | "b" | "c"
```

然后遍历这个新的 union

```ts
type result = { [P in keys_added_c]: any }
// {a: any;b: any;c: any;}
```

成功增加了一个属性 c，但是所有属性的类型都丢失了。

所以应该用条件语句判断 P，如果是 Test 原本有的属性，就保留原来的类型，否则指定新类型比如 Function

```ts
type result = { [P in keys_added_c]: P extends keys ? Test[P] : Function }
// {a: string;b: number;c: Function;}
```

把上述过程封装一下就是：

```ts
type Test = {
  a: string
  b: number
}
/**
 * get the keys which extends Filter
 */
export type GetKeys<T, Filter = any> = {
  [P in keyof T]: T[P] extends Filter ? P : never
}[keyof T]
/**
 * add a key to keys
 */
export type AddKey<T, K> = GetKeys<T> | K
/**
 * add a key to type
 */
export type Add<Target, K extends string | number | symbol, T = any> = {
  [P in AddKey<Target, K>]: P extends keyof Target ? Target[P] : T
}

type result = Add<Test, "c", Function> // {a: string;b: number;c: Function;}
```

关于 Typescript 还有很多有趣的特性，有时间再更新这篇博客。

这里有一些常用的 Ts 工具类型：

[@saber2pr/ts-lib](https://github.com/Saber2pr/ts-lib)
