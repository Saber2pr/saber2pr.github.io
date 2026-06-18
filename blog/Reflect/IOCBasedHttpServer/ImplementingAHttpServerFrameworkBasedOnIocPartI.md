General idea:
1. Controller is used to organize metadata
2. parse method extracts metadata from Controller to get Controller-Metadata-Node
3. Transform method to convert Controller-Metadata-Node to requestListeners
Use Class to organize metadata, use decorator and Reflect to inject metadata information
```typescript
@Controller("/user") // 注入 baseUrl: '/user'
class UserController {
  @Post("/register") // 注入 POST: '/register'
  public register() {}

  @Get("/login") // 注入 GET: '/login'
  public login() {}
}
```
> now use Reflect to implement decorators Controller, Get, Post
## Before that, you need to define constants.
> because Reflect needs metadataKey to index metadata
```typescript
export namespace KEY {
  export const enum Controller {
    BaseUrl = "controller:baseUrl",
    GET = "method:get",
    POST = "method:post"
  }
}
```
## Implement the decorator part
### 1. @ Controller
> ed to inject baseUrl metadata
```typescript
export function Controller(path?: string): ClassDecorator {
  return target =>
    Reflector.defineMetadata(KEY.Controller.BaseUrl, path, target);
}
```
### + DecoratorFactory
> @ Post and @ Get have too much similar code, pull away a Factory method
> enter Method type and routing path, and return a MethodDecorator
```typescript
export function DecoratorFactory(
  type: KEY.Controller,
  path: string
): MethodDecorator {
  return (target, key) => Reflector.defineMetadata(type, path, target, key);
}
```
### 2. @ Post, @ Get
> used to inject method type, routing path, and corresponding response method name (propertyKey)
```typescript
export function Get(path?: string): MethodDecorator {
  return DecoratorFactory(KEY.Controller.GET, path);
}

export function Post(path?: string): MethodDecorator {
  return DecoratorFactory(KEY.Controller.POST, path);
}
```
Using the above decorator, the path, method, callbackName and other information needed by requestListener can be defined on Controller.
### Parse
> lve how to extract metadata from Controller and convert it to Controller-Metadata-Node
First of all, make it clear that the input and the input type
Enter a Class and return a Controller-Metadata-Node
```typescript
// 伪代码
function parse(Controller: { new (): any }): Controller-Metadata-Node
```
Define type
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
Implement parse
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
Tell me what the resolve function did.
### + resolve
> xiliary function of reduce, which is used to match method and metadata
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
Here you need to implement two util functions
### + mapMethodToKey, pathToProp
> mapMethodToKey is used for Pattern matching
> efixes used by pathToProp to process path
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
Transform
> convert Controller-Metadata-Node to requestListeners (Units)
First of all, make it clear that the input and the input type
Enter a Controller-Metadata-Node to return Units
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
> transform does a little bit in this step. In fact, it should be directly converted to requestListeners.
### + mapUnitToJob
> used to convert the units obtained by transform into requestListeners
Koa is used here, so:
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
Using Koa-compose, you can combine requestListeners sequences.
### + ContextService
```typescript
@Injectable()
export class ContextService {
  public request: Context["request"];
  public response: Context["response"];
}
```
You can get koa-context information as long as you inject ContextService
For example
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
Now there are decorators, parser, and transformer that define metadata
The last thing you need is a Factory class to organize these processes in an orderly manner.
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
Demo
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
> Now just implemented from Controllers to requestListeners, about Service Injection shared in the next article.