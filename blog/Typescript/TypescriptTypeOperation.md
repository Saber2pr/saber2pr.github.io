First of all, there's a type.
```ts
type Test = {
  a: string
  b: number
}
```
How do you add an attribute to it?
Before solving this problem, let's take a look at the basic operations of typescript:
### Keyof
Get a collection of all properties of a type (union)
```ts
type keys = keyof Test // "a" | "b
```
The keyof operator is used to get a collection of all properties of a type.
### `|` operator
Amplified union
```ts
type result = keys | "c" // "a" | "b" | "c"
```
This is very simple.
### Mapped type
Traversing union
```ts
type result = { [P in keys]: Test[P] }
```
This code is equivalent to the following pseudo code
```ts
var result = keys.map(P => Test[P])
```
Is to map the Test type to another type.
### Extends
Conditional statement
```ts
type isExtendsA = keys extends "a" ? "yes" : "no" // "no"
type isExtendsAB = keys extends "a" | "b" ? "yes" : "no" // "yes"
```
Extends is called a conditional statement in typescript and is used to determine whether a type is a subset of a specified type.
---
With the above foundation, we can realize our needs:
For example, add an attribute c to the Test type, which is the Function type
First, get its union.
```ts
type Test = {
  a: string
  b: number
}

type keys = keyof Test // "a" | "b"
```
Add a "c" to keys
```ts
type keys_added_c = keys | "c" // "a" | "b" | "c"
```
and then traverse the new union.
```ts
type result = { [P in keys_added_c]: any }
// {a: any;b: any;c: any;}
```
An attribute c was successfully added, but the types of all properties were lost.
Therefore, we should use conditional statements to judge P, if it is the original attribute of Test, keep the original type, otherwise specify a new type such as Function.
```ts
type result = { [P in keys_added_c]: P extends keys ? Test[P] : Function }
// {a: string;b: number;c: Function;}
```
To encapsulate the above process is:
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
There are many interesting features about Typescript, so update this blog again if you have time.
Here are some common types of Ts tools:
[@ saber2pr/ts-lib](https://github.com/Saber2pr/ts-lib)