## 实现 reflect-metadata

1. 首先说明要干什么。
   实现一个存放类的容器，并能按照类之间依赖关系自动构建实例。

2. 核心原理：

利用 Reflect-metadata 获取构造函数中的参数类型(design:paramtypes)。
利用 Reflect-metadata 在目标对象上定义和获取元数据。

先举个例子：

```typescript
class Service {
  constructor() {}
}

class Controller {
  constructor(private Service: Service) {}
}
```

一个 Service 类，一个 Controller 类，其中 Controller 类依赖于 Service 类。

利用 Reflect 可以轻松获取 Controller 类构造函数中的 paramtypes。

## 实现@Injectable

> Injectable 函数返回一个类装饰器，利用反射获取被装饰类的构造函数的参数类型。

先举个栗子

```typescript
const enum DESIGN {
  PARAMTYPES = "design:paramtypes"
}

function Injectable(): ClassDecorator {
  return target => {
    // 获取被装饰类的构造函数的参数类型
    const ctorParams: any[] = Reflect.getMetadata(DESIGN.PARAMTYPES, target);
    console.log(ctorParams);
  };
}
```

利用设计键获取到参数列表：

```typescript
class Service {
  constructor() {}
}

@Injectable() // Array [ Service() ]
class Controller {
  constructor(private Service: Service) {}
}
```

## @Injectable

```typescript
export function Injectable(id?: PropertyKey): ClassDecorator {
  return target => {
    // 索引键值默认为target.name
    const token = id || target.name;

    // 如果token已存在则抛出Error
    if (Reflect.hasMetadata(token, MetaStore)) {
      throw new Error(`id:[${String(token)}] is existed!`);
    } else {
      Reflect.defineMetadata(token, target, MetaStore);
    }
  };
}
```

> Injectable 提供了可选项 id?，用来避免命名冲突。

这样只要被 Injectable()装饰过的类都会被缓存到 MetaStore 中。

## @Inject

> 构造函数参数注入。读写 target 身上的元数据，用于注入依赖信息。

```typescript
// target身上的元数据类型(参数注入)
export type ParamMeta = Array<[PropertyKey, number]>;

export function Inject(id: PropertyKey): ParameterDecorator {
  return (target, _, index) => {
    // 获取到target身上的ParamMeta，如果没有就创建一个新的
    const depMeta =
      Reflect.getMetadata<ParamMeta>(CUSTOM.META_PARAM, target) || [];

    // push一个ParamMeta，id和index
    depMeta.push([id, index]);

    // 再把ParamMeta保存回target
    Reflect.defineMetadata(CUSTOM.META, depMeta, target);
  };
}
```

> index 即参数在函数(构造函数)arguments 数组中的下标，id 为 Injectable-token

例如：

```typescript
@Injectable() // 缓存到MetaStore, id: 'Service'.
class Service {}

interface IService {}

class Controller {
  // inject注解，请求依赖为id: 'Service', 位置为index: 0
  constructor(@Inject("Service") private Service: IService) {}
}
```

## @InjectProp

> 成员属性注入。读写 target 身上的元数据，用于注入依赖信息。

```typescript
// target身上的元数据类型(成员属性注入)
export type PropMeta = Array<[PropertyKey, PropertyKey]>;

export function InjectProp(id?: PropertyKey): PropertyDecorator {
  return (target, key) => {
    // 请求的依赖token，默认为成员属性名key
    const token = id || key;

    // 获取到target身上的PropMeta，如果没有就创建一个新的
    const depMeta =
      Reflect.getMetadata<PropMeta>(CUSTOM.META_PROP, target) || [];

    // push一个PropMeta，id和index
    depMeta.push([token, key]);

    // 再把ParamMeta保存回target
    Reflect.defineMetadata(CUSTOM.META_PROP, depMeta, target);
  };
}
```

例如：

```typescript
@Injectable() // 缓存到MetaStore, id: 'Service'.
class Service {}

interface IService {}

class Controller {
  // inject注解，请求依赖为id: 'Service', 属性名为'Service'
  @InjectProp() private Service: IService;
}
```

## 实现 Injector 函数（核心）

> 从入口开始构建整个依赖树，并生成根实例
> 这里需要利用 AOP 思想，在 Target 生成实例前后做切面

```typescript
type Constructor<T = any> = { new (...args: Array<any>): T };

export function Injector<T>(Target: Constructor<T>): T | Constructor<T> {
  // 如果是静态类，直接返回
  if (Reflect.hasMetadata(CUSTOM.STATIC, Target)) return Target;

  // before 拿到ParamMeta实例数组
  const instances = before(Target);

  // 注入ParamMeta实例数组，生成Target实例
  const target = new Target(...instances);

  // after 进行PropMeta依赖注入
  after(target);

  return target;
}
```

## before

> 通过 Target 获取元数据信息(ParamMeta)，返回处理好的依赖项实例数组

```typescript
function before<T>(Target: Constructor<T>) {
  // 获取设计元数据，也就是构造函数参数中的依赖项
  const deps =
    Reflect.getMetadata<Array<Constructor>>(DESIGN.PARAMTYPES, Target) || [];

  // 获取Injected tags
  const tags = Reflect.getMetadata<ParamMeta>(CUSTOM.META_PARAM, Target) || [];

  // 遍历每一个tag
  tags.forEach(([id, index]) => {
    // 如果MetaStore中已注册
    if (Reflect.hasMetadata(id, MetaStore)) {
      // 找到MetaStore中id对应的metadata，按index插入deps
      deps[index] = Reflect.getMetadata(id, MetaStore);
    } else {
      // 若没找到，则抛出异常
      throw new Error(`injected dep:${String(id)} not found`);
    }
  });

  // 对每一个ParamMeta依赖进行Injector依赖注入，得到实例数组并返回
  return deps.map(Injector);
}
```

## after

> 通过 Target 实例获取元数据信息(PropMeta)，将处理好的依赖项定义到 Target 实例上

```typescript
function after<T>(target: T) {
  // 获取PropMeta，也就是成员属性名关联的元数据
  const props = Reflect.getMetadata<PropMeta>(CUSTOM.META_PROP, target) || [];

  // 遍历每一个PropMeta元素
  props.forEach(([id, key]) => {
    // 如果MetaStore中已注册
    if (Reflect.hasMetadata(id, MetaStore)) {
      // 在MetaStore中找到对应metadata，也就是PropertyKey对应的依赖
      const dep = Reflect.getMetadata<Constructor>(id, MetaStore);
      // 对依赖进行依赖注入，得到依赖实例
      const instance = Injector(dep);

      // 将依赖实例作为属性定义到target上
      Object.defineProperty(target, key, { value: instance });
    } else {
      // 若没找到，则抛出异常
      throw new Error(`injected dep:${String(id)} not found`);
    }
  });
}
```

Demo

```typescript
@Injectable()
class Service {
  public getUser() {
    return "saber!";
  }
}

class Controller {
  public constructor(@Inject("Service") private Service: Service) {}

  // @InjectProp() private Service: Service

  public test() {
    console.log(this.Service.getUser());
  }
}

const app = Injector(Controller);

app.test(); // 'saber!
```
