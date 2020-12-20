总体思路：

1. Controller 用来组织元数据
2. parse 方法将 Controller 中的 metadata 提取出来，得到 Controller-Metadata-Node
3. transform 方法将 Controller-Metadata-Node 转为 requestListeners

利用 Class 来组织元数据，利用装饰器和 Reflect 注入元数据信息

```typescript
@Controller("/user") // 注入 baseUrl: '/user'
class UserController {
  @Post("/register") // 注入 POST: '/register'
  public register() {}

  @Get("/login") // 注入 GET: '/login'
  public login() {}
}
```

> 现在利用 Reflect 来实现装饰器 Controller、Get、Post

## 在此之前需要定义 constants

> 因为 Reflect 需要 metadataKey 来索引 metadata

```typescript
export namespace KEY {
  export const enum Controller {
    BaseUrl = "controller:baseUrl",
    GET = "method:get",
    POST = "method:post"
  }
}
```

## 实现装饰器部分

### 1. @Controller

> 用来注入 baseUrl 元数据

```typescript
export function Controller(path?: string): ClassDecorator {
  return target =>
    Reflector.defineMetadata(KEY.Controller.BaseUrl, path, target);
}
```

### + DecoratorFactory

> @Post 和@Get 相似代码太多，抽离一个 Factory 方法
> 输入 Method type 和路由 path，返回一个 MethodDecorator

```typescript
export function DecoratorFactory(
  type: KEY.Controller,
  path: string
): MethodDecorator {
  return (target, key) => Reflector.defineMetadata(type, path, target, key);
}
```

### 2. @Post、@Get

> 用来注入 method 类型、路由 path、对应的响应方法名(propertyKey)

```typescript
export function Get(path?: string): MethodDecorator {
  return DecoratorFactory(KEY.Controller.GET, path);
}

export function Post(path?: string): MethodDecorator {
  return DecoratorFactory(KEY.Controller.POST, path);
}
```

利用上述装饰器可以将 requestListener 需要的 path、method、callbackName 等信息定义在 Controller 上

### parse

> 解决如何提取出 Controller 中的 metadata 及其转化为 Controller-Metadata-Node

首先明确，输入和输入的 type

输入一个 Class，返回一个 Controller-Metadata-Node

```typescript
// 伪代码
function parse(Controller: { new (): any }): Controller-Metadata-Node
```

定义 type

```typescript
// GET和POST还有别的method懒得写了
export type Method = "GET" | "POST";

// 路由
export type Routes = Array<{
  method: Method;
  path: string;
  callback: Function;
}>;

// Controller-Metadata-Node
export interface Controller {
  baseUrl: string;
  routes: Routes;
}
```

实现 parse

```typescript
// parse函数实现
// 输入一个Class类型，输出Controller-Metadata-Node
export function parse(Controller: { new (): any }): Controller {
  // 提取baseUrl
  const baseUrl = Reflector.getMetadata<string>(
    KEY.Controller.BaseUrl,
    Controller
  );
  // 实例化
  const target = new Controller();
  // 获取实例的所有方法callbackNames
  const methods = Object.keys(Object.getPrototypeOf(target));

  // 遍历所有callbackNames
  // 匹配对应的method并输出
  const routes = methods.reduce((receiver, key) => {
    resolve(target, key, "GET", receiver);
    resolve(target, key, "POST", receiver);
    return receiver;
  }, []);

  // 返回Controller-Metadata-Node
  return {
    baseUrl,
    routes
  };
}
```

说一下 resolve 函数做了什么

### + resolve

> reduce 的辅助函数，用于匹配 method 与 metadata

```typescript
export function resolve(
  target: Object,
  key: string,
  method: Method,
  receiver: Routes
) {
  // 获取target.key上methodKey对应的metadata
  const path = Reflector.getMetadata<string>(
    mapMethodToKey(method),
    target,
    key
  );
  // 如果method对应的path存在，则往receiver中push一个route
  if (path) receiver.push({ method, path, callback: target[pathToProp(path)] });
}
```

这里需要实现两个 util 函数

### + mapMethodToKey 、pathToProp

> mapMethodToKey 用来进行 Pattern matching
> pathToProp 用来处理 path 的前缀

```typescript
export function mapMethodToKey(method: Method): KEY.Controller {
  switch (method) {
    case "GET":
      return KEY.Controller.GET;
    case "POST":
      return KEY.Controller.POST;
    default:
      throw new TypeError();
  }
}

export function pathToProp(path: string) {
  if (path.startsWith("/")) {
    return path.slice(1);
  }
  return path;
}
```

transform

> 将 Controller-Metadata-Node 转为 requestListeners（Units）

首先明确，输入和输入的 type

输入一个 Controller-Metadata-Node 返回 Units

```typescript
// requestListener需要的信息
export interface Unit {
  url: string;
  callback: Function;
  method: string;
}

// 实现transform
export function transform(controller: Controller): Unit[] {
  return controller.routes.map<Unit>(({ path, callback, method }) => ({
    url: controller.baseUrl + path,
    callback,
    method
  }));
}
```

> transform 这一步做的有点少，其实应该直接转为 requestListeners

### + mapUnitToJob

> 用来把 transform 得到的 units 转为 requestListeners

这里用的是 Koa 所以：

```typescript
// 得到requestListeners序列
export function mapUnitToJob(units: Unit[]): Job<Context>[] {
  return units.map<Job>(unit => async (ctx, next) => {
    const { url, method } = ctx.request;
    if (url === unit.url && method === unit.method) {
      // 混入ctx
      await unit.callback.apply(
        Object.assign(unit.origin, { ContextService: ctx })
      );
    } else {
      await next();
    }
  });
}
```

利用 Koa-compose 就可以组合 requestListeners 序列

### + ContextService

```typescript
@Injectable()
export class ContextService {
  public request: Context["request"];
  public response: Context["response"];
}
```

只要注入 ContextService 就可以获取 koa-context 信息

例如

```typescript
@Controller("/user")
class UserController {
  constructor(private ContextService: ContextService) {}

  @Get("/login")
  public login() {
    this.ContextService.response.end("login");
  }

  @Get("/hello")
  public hello() {
    this.ContextService.response.end("hello");
  }
}
```

现在有了定义 metadata 的 decorators、parser 和 transformer

最后需要的就是一个 Factory 类，将这几个过程有序组织起来

### Factory

```typescript
export class Factory {
  public constructor(private modules: Array<{ new (): any }>) {
    // 将classes转为units
    this.units = [].concat(...this.modules.map(mod => transform(parse(mod))));
  }
  public instance: KoaBody;
  private units: Unit[];
  public create() {
    // 将units转为requestListeners，实例化一个koa-app，koa.use...
    this.instance = Koa().use(compose(...mapUnitToJob(this.units)));
    // 返回koa实例
    return this.instance;
  }
}
```

demo

```typescript
@Controller("/user")
class UserController {
  constructor(private ContextService: ContextService) {}

  @Get("/login")
  public login() {
    this.ContextService.response.end("login");
  }

  @Get("/hello")
  public hello() {
    this.ContextService.response.end("hello");
  }
}

new Factory([UserController])
  .create()
  .listen(3001, () => console.log("http://localhost:3001"));
```

> 现在只是实现了从 Controllers 到 requestListeners，关于 Service 注入在下一篇文章分享。
