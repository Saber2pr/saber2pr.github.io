HashMap 原理比较复杂，不是这篇文章重点。(其实是本菜鸡不懂(

reflect-metadata 中实现了 HashMap 的 polyfill，需要能快速读取数据，而 js 的 Object 当属性很多的时候性能并不好，不然就不会有 Map 了。然而 reflect-metadata 中 HashMap 用的是 Dictionary，利用了一个非常 hack 的方法。

HashMap

```typescript
type HashMap<V> = Record<string, V>;

const HashMap = {
  // create an obj into dictionary mode (a.k.a. "slow" mode on v8)
  create: <V>() => MakeDictionary(Object.create(null) as HashMap<V>),

  has: <V>(map: HashMap<V>, key: string | number | symbol) =>
    Object.prototype.hasOwnProperty.call(map, key),

  get: <V>(map: HashMap<V>, key: string | number | symbol): V | undefined =>
    Object.prototype.hasOwnProperty.call(map, key)
      ? map[key as string | number]
      : undefined
};
```

好像有点简单啊，除了有个 MakeDictionary 函数

在 reflect-metadata 源码中最后有一个 MakeDictionary 函数，来看看这个神奇的函数

MakeDictionary

```typescript
// uses a heuristic used by v8 and chakra to force an obj into dictionary mode.
function MakeDictionary<T>(obj: T): T {
  (<any>obj).__ = undefined;
  delete (<any>obj).__;
  return obj;
}
```

它给 obj 添加了\_\_属性，值为 undefined，然后又删了，注释解释说这可以启发 v8 或者査克拉引擎将 Object 转换到 dictionary mode（？？），可以大幅提升 Object 属性读取的速度？

下面来测试一下（Node 环境）

先写一个 fill 函数，用来填充属性

```typescript
function fillSomething(obj: Object, size: number = 100000) {
  while (size--) obj[size] = Math.random();
}
```

测试一下读取速度

```typescript
// 普通obj
const obj = {};
// 填充100000个随机属性
fillSomething(obj);

console.time("obj");
console.log(obj["5555"]);
console.timeEnd("obj"); // obj 2.813ms

// 创建一个hashMap
const hashMap = HashMap.create();
// 填充100000个随机属性
fillSomething(hashMap);

console.time("hashMap");
console.log(HashMap.get(hashMap, "5555"));
console.timeEnd("hashMap"); // hashMap 0.398ms
```

足足快了 30 多倍？

真假？。。其实把上面两个 time 顺序颠倒也不是这么回事，但出自 rbuckton 大神之手应该不是随便写的

所以以后遇到巨大 Object 的时候不妨用此方法优化一下试试。
