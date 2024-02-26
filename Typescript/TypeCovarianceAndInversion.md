What I wrote a few days ago was inexplicably wrong, and it was found to be a problem of type checking. So take the time to summarize the pit of the function type.
The following is my own understanding (let's not talk about the specific complex theories, come on, show ~):
1. Covariance: Type Convergence
two。 Inverter: type divergence
Scene:
```ts
type Color = {}

type Red = {
  red: any
}

let useC: (c: Color) => number
let useR: (r: Red) => number

useR = useC
useC = useR // 不报错?? 不安全 useR里是以Red类型执行的，但useC传入了Color类型
```
```ts
type Color = {}

type Red = {
  red: any
}

let c: Color
let r: Red

// 变量类型是协变的
c = r // Red类型收敛为Color类型
r = c // 报错

// 函数参数类型是逆变的
let useC: (c: Color) => number
let useR = (r: Red) => 0

useC = useR // 协变，类型收敛。开启strictFunctionTypes:true后将报错，变为逆变。
// useC执行传入Color类型，执行的是useR，Color发散为Red类型，发生错误。

useR = useC // 逆变，类型发散。
// useR执行传入Red类型，执行的是useC，Red类型收敛为Color类型。

// 函数返回值类型是协变的
let useC2: () => Color
let useR2: () => Red

useC2 = useR2
useR2 = useC2 // 报错
```
Summary:
1. All are covariant except that the function parameter type is inverted.
   When assigning a function to another function variable, ensure that the parameter types diverge, that is, are smaller than the target type range.
When the target function is executed, the original function is executed, and the passed parameter type converges to the original function parameter type.
two。 Covariance indicates type convergence, that is, the range of types is narrowed or unchanged. Vice versa.
3. The essence is that type convergence is safe at execution time.