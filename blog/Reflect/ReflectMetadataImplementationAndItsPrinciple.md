Recently studied the mechanism of reflect, basically achieved all the api, but also passed all the test cases, so I want to write an article to record it.
Reflect Metadata is a proposal of ES7 that is mainly used to add and read metadata at declaration time. Using reflection in Typescript requires the installation of a dependent reflect-metadata.
Typescript has complete object-oriented support, and dependency injection technology (DI) has been widely used in frameworks such as Angular, Nest, and so on, like this.
```typescript
class Service {}

class Controller {
  constructor(private Service: Service) {}
}
```
The IOC framework takes the class that the Controller depends on and injects an instance or the class itself, where obtaining the dependency type leverages Reflect.
Use metadata Design-time type annotations to get dependency types
```typescript
function Injectable(): ClassDecorator {
  return target => {
    const metadata = Reflect.getMetadata("design:paramtypes", target)
    console.log(metadata)
  }
}

class Service {
  constructor() {}
}

@Injectable() // 输出 [ Service() ]
class Controller {
  constructor(private Service: Service) {}
}
```
Here we need to use the decorator to get it. You may have some questions here, metadata needs to be obtained first by defineMetadata and then in getMetadata, why can it be obtained directly here?
The answer is that if tsconfig is enabled and emitDecoratorMetadata is true, the compiler will issue design metadata information.
Let's take a look at the compiled js of ts (emitDecoratorMetadata enabled)
```typescript
// 判断一下Reflect上是否有metadata函数，并赋给__metadata
var __metadata =
  (this && this.__metadata) ||
  function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v)
  }

var Service = /** @class */ (function() {
  function Service() {}
  return Service
})()

var Controller = /** @class */ (function() {
  function Controller(Service) {
    this.Service = Service
  }
  Controller = __decorate(
    [
      Injectable(),
      // 注意这里，使用design-paramtypes键定义了元数据，值是[Service]
      __metadata("design:paramtypes", [Service])
    ],
    Controller
  )
  return Controller
})()

function Injectable() {
  return function(target) {
    Reflect.getMetadata("design:paramtypes", target)
  }
}
```
When emitDecoratorMetadata is turned on, the compiler automatically generates Design-time type annotations.
From the previous example, it is easy to find that a Map should be maintained inside Reflect, and it should be WeakMap
Sure enough, WeakMap is used inside the reflect-metadata library, and it comes with Polyfill (not only WeakMap, but also HashMap...).
[[Metadata]] internal slot
[Reflect.ts#L685](https://github.com/rbuckton/reflect-metadata/blob/master/Reflect.ts#L685)
Naive WeakMap shim
[Reflect.ts#L1725](https://github.com/rbuckton/reflect-metadata/blob/master/Reflect.ts#L1725)
Let's start to implement.
Implement Reflect.defineMetadata
First, create a WeakMap that will be responsible for maintaining the metadata for all classes and class instances, as well as solving the problem of automatic recycling.
```typescript
const Metadata = new WeakMap<Object, Map<PropertyKey, MetadataMap>>()
```
This is a high-dimensional Map, and for each Object, i.e. class or class instance, it is associated with a Map. This Map is associated with the attribute key and the Map corresponding to the attribute, so it is a high-dimensional Map. The Metadata is a three-dimensional Map.
```typescript
export function defineMetadata(
  metadataKey: MetadataKey,
  metadataValue: MetadataValue,
  target: Object,
  propertyKey: PropertyKey = DEFAULTKAY
) {
  // 判断target类型，因为target将作为WeakMap的键，必须是对象类型
  if (typeof target !== "object" && typeof target !== "function") {
    throw new TypeError()
  }

  // 如果传入propertyKey，要求类型为string或symbol
  if (propertyKey && !["string", "symbol"].includes(typeof propertyKey)) {
    throw new TypeError()
  }

  // 从Metadata中获取target关联的Map，若没有就创建一个新的Map
  const targetMetadata =
    Metadata.get(target) || new Map<PropertyKey, MetadataMap>()

  // 将targetMetadata再保存回Metadata中
  Metadata.set(target, targetMetadata)

  // 从targetMetadata中获取propertyKey关联的Map，若没有就创建一个新的Map
  const metadataMap: MetadataMap = targetMetadata.get(propertyKey) || new Map()

  // 将metadataMap再保存回targetMetadata中
  targetMetadata.set(propertyKey, metadataMap)

  // 设置元数据到metadataMap，键为metadataKey，值metadataValue
  metadataMap.set(metadataKey, metadataValue)
}
```
Implement Reflect.getMetadata
This api depends on getMetadataMap and getOwnMetadataMap. So do it backwards first.
1. GetOwnMetadataMap
```typescript
export function getOwnMetadataMap(
  target: Object,
  propertyKey: PropertyKey = DEFAULTKAY
) {
  // 判断target类型，因为target将作为WeakMap的键，必须是对象类型
  if (typeof target !== "object" && typeof target !== "function") {
    throw new TypeError()
  }

  // 从Metadata中获取target关联的Map，如果没有就返回undefined
  const targetMetadata = Metadata.get(target)
  if (!targetMetadata) return

  // 从targetMetadata中获取propertyKey关联的Map，如果没有就返回undefined
  const metadataMap = targetMetadata.get(propertyKey)
  if (!metadataMap) return

  // 返回metadataMap
  return metadataMap
}
```
2. getMetadataMap
Get the metadata Map on target and its prototype. For the same propertyKey, its own metadataMap overrides the metadataMap of the prototype.
```typescript
export function getMetadataMap(
  target: Object,
  propertyKey: PropertyKey = DEFAULTKAY
) {
  // 如果自身有了propertyKey对应的map
  if (Boolean(getOwnMetadataMap(target, propertyKey))) {
    return getOwnMetadataMap(target, propertyKey)
  }

  // 去原型上找propertyKey对应的map，如果没有就返回undefined
  const targetMetadata = Metadata.get(Object.getPrototypeOf(target))
  if (!targetMetadata) return

  // 从targetMetadata中获取propertyKey关联的Map，如果没有就返回undefined
  const metadataMap = targetMetadata.get(propertyKey)
  if (!metadataMap) return

  // 返回metadataMap
  return metadataMap
}
```
Implement getMetadata
Use getMetadataMap to get the metadataMap associated with target, and then get the corresponding metadataValue according to metadataKey
```typescript
export function getMetadata<T>(
  metadataKey: MetadataKey,
  target: Object,
  propertyKey?: PropertyKey
): T {
  // 根据propertyKey获取target的metadataMap，如果没有就返回undefined
  const metadataMap = getMetadataMap(target, propertyKey)
  if (!metadataMap) return

  // 返回metadataKey对应的metadataValue
  return metadataMap.get(metadataKey)
}
```
The same is true for getOwnMetadata, just consider getOwnMetadataMap
Implement Reflect.getMetadataKeys
Used to get all the metadata keys on the target
It depends on getOwnMetadataKeys, so implement getOwnMetadataKeys first
Implement getOwnMetadataKeys
Get all the metadata keys of target itself
```typescript
export function getOwnMetadataKeys(
  target: Object,
  propertyKey?: PropertyKey
): MetadataKey[] {
  // 获取target身上与propertyKey关联的metadataMap，若没有返回空数组
  const metadataMap = getOwnMetadataMap(target, propertyKey)
  if (!metadataMap) return []

  // metadataMap转为数组并返回
  return Array.from(metadataMap.keys())
}
```
Implement getMetadataKeys
Get metadataKeys of self, get metadataKeys of prototype, merge and return
```typescript
export function getMetadataKeys(
  target: Object,
  propertyKey?: PropertyKey
): MetadataKey[] {
  // 获取target自身与propertyKey关联的metadataKeys
  const ownKeys = getOwnMetadataKeys(target, propertyKey)

  // 获取target原型与propertyKey关联的metadataKeys
  const protoKeys = getOwnMetadataKeys(
    Object.getPrototypeOf(target),
    propertyKey
  )

  // 返回结果
  return [...ownKeys, ...protoKeys]
}
```
Implement Reflect.hasMetadata
It is used to determine whether there is a corresponding metadataKey on target.
Note that it is to determine whether there is key, not value, so it cannot be equivalent to Boolean (getMetadata), because metadataValue can be the equivalent of null and undefined. The test cases do a lot of test here.
```typescript
export function hasMetadata(
  metadataKey: MetadataKey,
  target: Object,
  propertyKey?: PropertyKey
) {
  const metadataKeys = getMetadataKeys(target, propertyKey)
  return metadataKeys.includes(metadataKey)
}
```
This is very simple. There is nothing to say.
There is also hasOwnMetadata, which uses getOwnMetadataKeys to ok
Implement Reflect.deleteMetadata
```typescript
export function deleteMetadata(
  metadataKey: MetadataKey,
  target: Object,
  propertyKey?: PropertyKey
) {
  const metadataMap = getOwnMetadataMap(target, propertyKey)
  if (!metadataMap) return false

  return metadataMap.delete(metadataKey)
}
```
Implement Reflect.decorate
This can get the idea from the test case.
```typescript
// reflect-decorate.test.ts

it("DecoratorCorrectTargetInPipelineForFunctionOverload", () => {
  let sent: Function[] = []
  let A = function A(): void {}
  let B = function B(): void {}
  let decorators = [
    (target: Function): any => {
      sent.push(target)
      return undefined
    },
    (target: Function): any => {
      sent.push(target)
      return undefined
    },
    (target: Function): any => {
      sent.push(target)
      return A
    },
    (target: Function): any => {
      sent.push(target)
      return B
    }
  ]
  let target = function(): void {}
  Reflect.decorate(decorators, target)
  expect(sent).toEqual([target, B, A, A])
})
```
The decorators given in the test is an array of four arrow functions, push the target parameter into sent, and then return a result
The requirement is that after Reflect.decorate is executed, sent is [target, B, A, A]
Combined with the name analysis of the test case, you see the Pipeline, which should think of reduce and reduceRight.
Target is initialValue,decorators and reducers.
Decorate
A bit of type reducers, target is state, decorators are reducers
```typescript
export function decorate(
  decorators: (PropertyDecorator | MethodDecorator)[],
  target: Object | Function,
  propertyKey?: string | symbol,
  attributes?: PropertyDescriptor
): PropertyDescriptor {
  // 如果decorators是空数组则抛出TypeError
  if (0 === decorators.length) {
    throw new TypeError()
  }

  // target作为initialValue，遍历decorators，将上一个decorator的结果作为target传给下一个decorator
  return decorators.reduceRight(
    (target, decorator) => decorator(target, propertyKey, attributes) || target,
    <any>target
  )
}
```
Determine the type of Reflect and mix with native Reflect
To avoid type conflicts, you first need to give the type of the native Reflect an alias, which is called IReflect.
```typescript
export type IReflect = typeof Reflect
export const reflect = Reflect
```
And then mixed with Reflector.
```typescript
export const Reflect: typeof Reflector & IReflect = Object.assign(
  reflect,
  Reflector
)
```
Because the properties of the native Reflect object cannot be enumerated, you can only merge to the native reflect
### Github
[@saber2pr/reflect](https://github.com/Saber2pr/-saber2pr-reflect)
> ps: the reflect-metadata on which I wrote the IOC framework has also been replaced with the current version, and demo can also run, which feels good.
[@ saber2pr/ioc](https://github.com/Saber2pr/saber-ioc)