最近研究了一下 reflect 机理，基本算是实现了所有的 api，也通过了全部的测试用例，所以想写一篇文章记录下来。

Reflect Metadata 是 ES7 的一个提案，它主要用来在声明的时候添加和读取元数据。Typescript 使用反射需要安装一个依赖 reflect-metadata.

Typescript 拥有完整的面向对象支持，依赖注入技术(DI)已经在 Angular、Nest 等框架中大规模使用了，就像这样

```typescript
class Service {}

class Controller {
  constructor(private Service: Service) {}
}
```

IOC 框架会获取到 Controller 所依赖的类，并注入一个实例或类本身，这其中获取依赖类型就会利用到 Reflect。

利用元数据设计键(Design-time type annotations)来获取依赖类型

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

这里需要利用装饰器来获取。这里也许你会有疑问，元数据需要先 defineMetadata 然后在 getMetadata 获取，这里为什么可以直接获取?

答案就是如果 tsconfig 开启了 emitDecoratorMetadata 为 true，编译器会发出设计元数据信息。

来看下 ts 编译后的 js (已开启 emitDecoratorMetadata)

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

开启了 emitDecoratorMetadata 编译器会自动生成 Design-time type annotations。

通过前面的实例，容易发现，Reflect 内部应该会维护一个 Map，而且应该是 WeakMap，

果不其然，在 reflect-metadata 这个库内部使用了 WeakMap，而且居然还自带了 Polyfill(不仅实现 WeakMap，还有 HashMap...)

[[Metadata]] internal slot

[Reflect.ts#L685](https://github.com/rbuckton/reflect-metadata/blob/master/Reflect.ts#L685)

naive WeakMap shim

[Reflect.ts#L1725](https://github.com/rbuckton/reflect-metadata/blob/master/Reflect.ts#L1725)

下面开始实现。

实现 Reflect.defineMetadata

首先创建一个 WeakMap，它将负责维护所有类和类实例的元数据，以及解决自动回收问题。

```typescript
const Metadata = new WeakMap<Object, Map<PropertyKey, MetadataMap>>()
```

这是一个高维的 Map，对于每个 Object 也就是类或者类实例，它都关联一个 Map。这个 Map 里又关联了属性 key 和属性所对应的 Map，所以又是一个高维的 Map。所以这个 Metadata 就是一个 3 维的 Map。

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

实现 Reflect.getMetadata

这个 api 会依赖 getMetadataMap、getOwnMetadataMap。所以先倒着来实现

1. getOwnMetadataMap

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

获取 target 及其原型上的元数据 Map，对于同一个 propertyKey，自身的 metadataMap 覆盖原型的 metadataMap

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

实现 getMetadata

利用 getMetadataMap 拿到 target 关联的 metadataMap，然后根据 metadataKey 获取对应的 metadataValue

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

同样的还有 getOwnMetadata，只需要考虑 getOwnMetadataMap 就可以了

实现 Reflect.getMetadataKeys

用来获取 target 身上的所有元数据键

它会依赖 getOwnMetadataKeys，所以先实现 getOwnMetadataKeys

实现 getOwnMetadataKeys

获取 target 自身的所有元数据键

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

实现 getMetadataKeys

获取自身的 metadataKeys，获取原型的 metadataKeys，合并后返回

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

实现 Reflect.hasMetadata

用来判断 target 上是否有对应的 metadataKey

注意是判断有无 key，而不是有无 value，所以不能等价 Boolean(getMetadata)，因为 metadataValue 可以是 null 和 undefined 等值。测试用例对这里做了大量的 test。

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

这个很简单，没什么好说的

同样还有 hasOwnMetadata，利用 getOwnMetadataKeys 就 ok

实现 Reflect.deleteMetadata

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

实现 Reflect.decorate

这个可以从测试用例上获取思路

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

测试中给出的 decorators 是 4 个箭头函数的数组，把 target 参数 push 到 sent 里，然后返回一个结果

要求是 Reflect.decorate 执行后，sent 是[target, B, A, A]

再结合测试用例的 name 分析，看到了管道(Pipeline)，那应该会想到 reduce 而且是 reduceRight。

target 就是 initialValue，decorators 就是 reducers。

decorate

有点类型 redux 的样子，target 就是 state，decorators 就是 reducers

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

确定 Reflect 的 type 以及混入原生 Reflect

为了避免类型冲突，首先需要给原生 Reflect 的 type 起个别名，就叫 IReflect 吧

```typescript
export type IReflect = typeof Reflect
export const reflect = Reflect
```

然后混入 Reflector

```typescript
export const Reflect: typeof Reflector & IReflect = Object.assign(
  reflect,
  Reflector
)
```

因为原生 Reflect 对象的属性不可枚举，所以只能往原生 reflect 合并

### Github

[@saber2pr/reflect](https://github.com/Saber2pr/-saber2pr-reflect)

> ps: 之前我写的 IOC 框架依赖的 reflect-metadata 也换成了现在实现的这个版本，demo 也能跑起来，感觉还不错。

[@saber2pr/ioc](https://github.com/Saber2pr/saber-ioc)
