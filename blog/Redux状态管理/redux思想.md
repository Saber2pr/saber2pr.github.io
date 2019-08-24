关于redux只要把握三大原则就够了。至于怎么实现那是你的事情。

## Redux 三大原则

#### 单一数据源

其实是想说使用观察者模式实现。

#### State 是只读的

immutable。

#### 使用纯函数来执行修改

强调了纯函数

### 本质

subscription + immutable + pure-function 这些东西综合起来你会想到什么？

没错，就是 能够处理side-effect的函数式编程 思想！

side-effect(副作用)在redux中由subscriptions处理，纯的函数被叫做reducer，能够将state变换成另一个state。(想到了什么？)

```ts
State1 {                State2 {
  name   -> reducer1 ->   name
  age    -> reducer2 ->   age
}                       }

State1   -> reducer  -> State2
```

那么Store不就是Functor吗？dispatch就是fmap，dispatch将reducer应用到State变成另一个State。

至于action完全是可有可无的东西。

#### Store是Monad吗？

Monad 需要实现两个运算，>>= 和 return。

Store.getState就是return。(对自己的state进行pure)

> 假设 Store.dispatch :: Monad m => (State -> m State) -> m State

> 以下为伪代码

Store >>= (\state -> return state) == Store 

应该有 Store.dispatch(_ => Store.getState()) == Store

运算符>>=用来串联一系列的IO操作，在redux中IO操作在subscriptions中处理，通过调用dispatch触发IO操作。

问题是dispatch是同步执行，所以你不能在reducer中去调用dispatch(会死循环)。

在JS中可以利用microtask来干这个事情。具体请看Promise原理。
