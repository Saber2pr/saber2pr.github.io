```js
if (1) {
  // var变量声明预编译提升到上一层，或者说if没有块级
  var val = 233
}

try {
  console.log(val) // 233
} catch (error) {
  console.error(error)
}

if (1) {
  try {
    console.log(_val) // 没有初始化，即暂定死区。改成var声明会输出undefined，var默认初始化为undefined
  } catch (error) {
    console.log(error)
  }
  // let块作用域
  let _val = 344
}

try {
  console.log(_val) // _val is not defined，因为_val在块作用域内(子作用域)
} catch (error) {
  console.error(error)
}

// 函数作用域也是块级
function Block() {
  // 函数封闭作用域
  var _val_0 = 344
}

try {
  console.log(_val_0) // _val_0 is not defined
} catch (error) {
  console.error(error)
}

const People = (function() {
  // iife闭包环境

  // 被闭包的变量，所有实例共享
  var _age = 21

  function People(name) {
    this.name = name
  }

  People.prototype.getAge = function() {
    return _age
  }

  People.prototype.addAge = function() {
    _age++
  }

  return People
})()

const me = new People("saber2pr")
me.addAge()
console.log(me.getAge()) // 22

const saber = new People("saber")
saber.addAge()
console.log(saber.getAge()) // 23
```
There are three scopes in js
1. Global scope
two。 Function scope
3. object scope
The var declaration in each scope is promoted to the top level of that scope
Child scope declaration overrides parent scope