## Implement reflect-metadata
1. First of all, explain what to do.
Implement a container that holds classes, and automatically build instances according to the dependencies between classes.
two。 Core principles:
Use Reflect-metadata to get the parameter type (design:paramtypes) in the constructor.
Reflect-metadata is used to define and obtain metadata on target objects.
Let me give you an example:
```typescript
class Service {
  constructor() {}
}

class Controller {
  constructor(private Service: Service) {}
}
```
A Service class, a Controller class, where the Controller class depends on the Service class.
Using Reflect, you can easily get the paramtypes in the constructor of the Controller class.
## Implement @ Injectable
> e Injectable function returns a class decorator that uses reflection to get the parameter type of the constructor of the decorated class.
Give me a chestnut first.
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
Use the design key to get the parameter list:
```typescript
class Service {
  constructor() {}
}

@Injectable() // Array [ Service() ]
class Controller {
  constructor(private Service: Service) {}
}
```
## @ Injectable
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
> Injectable provides an optional id?, to avoid naming conflicts.
In this way, classes that are decorated by Injectable () will be cached in MetaStore.
## @ Inject
> Constructor parameter injection. Read and write metadata on the target to inject dependency information.
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
> index is the subscript of the parameter in the function (constructor) arguments array, and id is Injectable-token
For example:
```typescript
@Injectable() // 缓存到MetaStore, id: 'Service'.
class Service {}

interface IService {}

class Controller {
  // inject注解，请求依赖为id: 'Service', 位置为index: 0
  constructor(@Inject("Service") private Service: IService) {}
}
```
## @ InjectProp
> member attribute injection. Read and write metadata on the target to inject dependency information.
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
For example:
```typescript
@Injectable() // 缓存到MetaStore, id: 'Service'.
class Service {}

interface IService {}

class Controller {
  // inject注解，请求依赖为id: 'Service', 属性名为'Service'
  @InjectProp() private Service: IService;
}
```
## Implement the Injector function (core)
> ild the entire dependency tree from the entrance and generate the root instance
> here, we need to use the idea of AOP to do the aspect before and after Target generates an instance.
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
> Obtain metadata information (ParamMeta) through Target, and return processed dependency instance array
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
> tain metadata information (PropMeta) through the Target instance, and define the processed dependencies on the Target instance
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