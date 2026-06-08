The principle of HashMap is complex and is not the focus of this article. As a matter of fact, the chicken does not understand this dish.
HashMap's polyfill is implemented in reflect-metadata, which needs to be able to read data quickly, while js's Object does not perform well when there are many attributes, otherwise there will be no Map. However, HashMap in reflect-metadata uses Dictionary, which uses a very hack method.
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
It seems a bit simple, except for the MakeDictionary function.
At the end of the reflect-metadata source code, there is a MakeDictionary function. Let's take a look at this magic function.
MakeDictionary
```typescript
// uses a heuristic used by v8 and chakra to force an obj into dictionary mode.
function MakeDictionary<T>(obj: T): T {
  (<any>obj).__ = undefined;
  delete (<any>obj).__;
  return obj;
}
```
It adds a\ _\ _ attribute to obj with a value of undefined and then deletes it, explaining that this can inspire v8 or dictionary mode engines to convert Object to dictionary mode (?? ), which can greatly increase the speed of reading Object properties?
Let's test it (Node environment)
First write a fill function to populate the attributes
```typescript
function fillSomething(obj: Object, size: number = 100000) {
  while (size--) obj[size] = Math.random();
}
```
Test the reading speed.
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
More than 30 times faster?
Really? no, no, no. In fact, it is not the case to reverse the order of the above two time, but it should not be written casually by the great god rbuckton.
So you might as well use this method to optimize it when you encounter a huge Object in the future.