```js
// 首先定义父类
function Animal(name) {
  // 构造函数中都是实例的属性，不同实例不共享
  this.name = name || "Animal"
  this.getName = function() {
    return this.name
  }
}

// 原型上的属性，不同实例会共享此属性，不能多继承
Animal.prototype.age = 233
```
### Prototype chain inheritance
> if an attribute is not found on the instance, it will be found on the `_ _ proto__` prototype.
```js
function Dog(name) {
  this.name = name
}
// 设置原型为Animal实例，这会导致所有实例共享以下属性
Dog.prototype = new Animal("Dog")
```
### constructor inheritance
Hijack the constructor of the parent class to initialize the properties of the subclass, and if you inherit more than one call, you will have several
> n only inherit construction properties, not prototype properties
> nction reuse cannot be realized, and each sub-example will make a copy
> instance is not a parent class instance. Calling instanceof (parent class) will output false
```js
function Cat(name) {
  Animal.call(this, name)
}
```
### Instance inheritance
> turned after adding properties to the parent class instance. Similar to the factory function.
> an instance is a parent class instance, not a subclass instance, and cannot be inherited.
```js
function Pig(name) {
  const instance = new Animal(name)
  return instance
}
```
### copy inheritance
> Inefficient, inaccessible, unenumerable methods
```js
function Chick(name) {
  const instance = new Animal(name)
  Object.assign(Chick.prototype, instance)
}
```
### Combinatorial inheritance
> that is, construction inheritance + prototype inheritance
```js
function Cow(name) {
  Animal.call(this, name)
}
// 调用了两次构造函数！(子类优先级高，屏蔽父类属性)
Cow.prototype = new Animal()
// 上面重写了prototype！所以一定记得修复丢失的constructor
Cow.prototype.constructor = Cow
```
### Parasitic combinatorial inheritance
> e idea is to get rid of the second constructor call
```js
function Horse(name) {
  Animal.call(this, name)
}
// Horse.prototype = Object.create(Animal.prototype)
// 修复因重写prototype丢失的constructor
Horse.prototype.constructor = Horse
;(function() {
  // 用一个空的构造函数替换掉父类构造函数就行了
  const Super = function() {}
  Super.prototype = Animal.prototype
  Horse.prototype = new Super()
})()
```
### Implement private, static properties
```js
const People = (function(_super) {
  // 但是，请注意，这个私有的变量会被所有实例共享！！
  // 所以typescript没有选择这种私有方式
  const _name = "this is private"

  function People(age) {
    // 继承构造函数
    _super.call(this)
    this.age = age
    this.getName = function() {
      // 获取私有属性
      return _name
    }
  }

  // Object.create可以不依赖构造函数，直接使用原型生成一个实例
  // 等价于用一个空的构造函数替换原型的构造函数再new
  // 继承原型属性
  // People.prototype = Object.create(_super.prototype)
  People.prototype = Object_create(_super.prototype)
  // 上面重写了原型，修复构造函数指向
  People.prototype.constructor = People
  // 静态属性
  People.id = "233"

  return People
})(Base)

function Base() {
  this.type = "base"
}

Base.prototype.getType = function() {
  return this.type
}

const p = New(People)(21)

console.log(p)
// instanceof判断右边构造函数的prototype原型是否在左边实例的__proto__原型链上
console.log(p instanceof Base) // true
console.log(p instanceof People) // true
```
### Object.create implementation
```js
function Object_create(prototype) {
  // 替换构造函数法
  // const ctor = function () {}
  // ctor.prototype = prototype
  // return new ctor()
  // 跳过构造函数法，直接绑定原型(原型链指向原型)
  const obj = {
    __proto__: prototype
  }
  return obj
}
```
### New implementation
> new is used to execute functions, but the prototype is bound by the way.
> so implement it manually:
1. New object binding prototype `_ _ proto__`
two。 Execute the constructor (note the context)
3. Return to new object
```js
/**
 * @param {Function} constructor
 * @returns
 */
function New(constructor) {
  // return function () {
  //   const obj = Object.create(constructor.prototype)
  //   constructor.apply(obj, arguments)
  //   return obj
  // }
  return function() {
    var obj = {
      __proto__: constructor.prototype
    }
    constructor.apply(obj, arguments)
    return obj
  }
}
```