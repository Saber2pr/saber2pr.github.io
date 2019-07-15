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

实现@Injectable

Injectable 函数返回一个类装饰器，利用反射获取被装饰类的构造函数的参数类型。

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

@Injectable() // [ Service() ]
class Controller {
  constructor(private Service: Service) {}
}
```

@Injectable

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

Injectable 提供了可选项 id?，用来避免命名冲突。

这样只要被 Injectable()装饰过的类都会被缓存到 MetaStore 中。

实现@Inject

读写 target 身上的元数据，用于注入依赖信息

```typescript
// target身上的元数据类型
export interface DepMeta {
  id: PropertyKey;
  index: number;
}

export function Inject(id: PropertyKey): ParameterDecorator {
  return (target, _, index) => {
    // 获取到target身上的DepMeta数组，如果没有就创建一个新的
    const depMeta =
      Reflect.getMetadata<Array<DepMeta>>(CUSTOM.META, target) || [];
    // push一个DepMeta，id和index
    depMeta.push({ id, index });
    // 再把DepMeta数组保存回target
    Reflect.defineMetadata(CUSTOM.META, depMeta, target);
  };
}
```

index 即参数在函数(构造函数)arguments 数组中的下标，id 为 Injectable-token

例如：

```typescript
@Injectable() // 缓存到MetaStore, id: 'Service'.
class Service {
  constructor() {}
}

interface IService {}

class Controller {
  // inject注解，请求依赖为id- 'Service', 位置为index- 0
  constructor(@Inject("Service") private Service: IService) {}
}
```

实现 Injector 函数（核心）

从入口开始构建整个依赖树，并生成根实例

```typescript
type Constructor<T = any> = { new (...args: Array<any>): T };

export function Injector(Target: Constructor): any {
  // 如果是静态类或singleton，直接返回
  if (Reflect.hasMetadata(CUSTOM.STATIC, Target)) return Target;

  // 获取Target构造函数的参数列表
  const deps =
    Reflect.getMetadata<Array<Constructor>>(DESIGN.PARAMTYPES, Target) || [];

  // 获取target身上DepMeta数组
  const tags = Reflect.getMetadata<DepMeta[]>(CUSTOM.META, Target) || [];

  // 遍历DepMetas
  tags.forEach(tag => {
    // 如果MetaStore中注册了tag.id
    if (Reflect.hasMetadata(tag.id, MetaStore)) {
      // 按index将Injectable插入deps中
      deps[tag.index] = Reflect.getMetadata(tag.id, MetaStore);
    } else {
      // Inject请求的Injectable没有在MetaStore中找到
      throw new Error(`injected dep:${String(tag.id)} not found`);
    }
  });
  // 递归构建,当deps为空时结束
  const instances = deps.map(Injector);

  // 注入依赖，生成实例
  return new Target(...instances);
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

  public test() {
    console.log(this.Service.getUser());
  }
}

const app = Injector(Controller);

app.test(); // 'saber!
```
