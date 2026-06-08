```js
// 实例的构造函数
function Cat() {}
// 实例
const cat = new Cat()

// 实例的原型就是构造函数的prototype
console.log(cat.__proto__ === Cat.prototype)

// 实例构造函数的原型就是构造函数的原型
console.log(Cat.__proto__ === Function.prototype)

// 构造函数的原型的构造函数就是自己
console.log(Cat.prototype.constructor === Cat)

// 构造函数的原型的原型就是Object构造函数的原型
console.log(Function.prototype.__proto__ === Object.prototype)
console.log(Array.prototype.__proto__ === Object.prototype)
console.log(Date.prototype.__proto__ === Object.prototype)
console.log(Error.prototype.__proto__ === Object.prototype)
// 这些对象的构造函数就是Object
console.log(JSON.__proto__ === Object.prototype)
console.log(Reflect.__proto__ === Object.prototype)

// 实例的原型的构造函数就是实例的构造函数
console.log(Cat.prototype.constructor === Cat)

// 实例原型的原型就是Object构造函数的prototype
console.log(Cat.prototype.__proto__ === Object.prototype)

// Object实例的原型的原型是null
console.log(Object.prototype.__proto__ === null)

// __proto__链：cat实例 -> Cat原型 -> Object原型 -> null
console.log(cat.__proto__.__proto__.__proto__ === null)

// Function和Object的关系
// 所有的函数对象的原型都是Function的prototype，Object也是个函数对象
console.log(Object.__proto__ === Function.prototype)
// 那Function的原型是? [native code]
console.log(Function.__proto__)
// 应该是Function.prototype
console.log(Function.__proto__ === Function.prototype)
```
## The role of `_ _ proto__`
When reading the properties of an instance, look for it on the instance first. If you can't find it, go to `_ _ proto__`, which is a chain connecting the instance and the instance prototype.
Of course, the example prototype also has its own prototype.
Follow `__proto__` all the way up and you'll find Object.prototype, and then null.
## The role of prototype
Get a prototype of the constructor to add methods and properties to the prototype
## The role of constructor
There is a constructor attribute on prototype that points to the constructor.
That is, constructor.prototype.constructor = = constructor
If the prototype is changed, the constructor direction also changes
![loading](https://saber2pr.top/MyWeb/resource/image/prototype.webp)
# To sum up.
1. A two-way connection between the constructor and the prototype via constructor.prototype.constructor = constructor
two。 The instance uses `_ _ proto__` to find (constructor.prototype) in the direction of the prototype, find Object.prototype up, and then null.
3. Prototype is the prototype, `_ _ proto__` is the prototype chain, and `_ _ proto__` connects the instance to a series of prototype
4. The prototype of the constructor is the prototype
5. The `_ _ proto__'of the instance points to the prototype of its own constructor, while the prototype of its own constructor (including the prototype of all functions) is Function.prototype
(even Function's own prototype points to Function.prototype)
6. The prototype of the object instance eventually points to Object.prototype (and then up to null), and the prototype of the function points to Function.prototype