上一篇文章实现了从 Controllers 到 requestListeners 的转化，下面需要解决的问题是当 Controller 使用了 IOC 容器来注入 Service 时怎么 parse 以及思路。

以每个 Controller 为一个根节点构建它的实例，parser 从实例中解析出 baseUrl 和 routes

之前我写的 IOC 容器被我重构了 qwq，API 现在是 Inject、Injectable、Injector.

> 1. Inject 负责添加依赖信息
> 2. Injectable 用来注册和缓存 constructors
> 3. Injector 用来构建根实例

所以需要在 parse 方法中使用 Injector 对 Controller 进行依赖注入

```typescript
export function parse(Controller: { new (): any }): Controller {
  const baseUrl = Reflector.getMetadata<string>(
    KEY.Controller.BaseUrl,
    Controller
  );

  // Injector将Controller需要的依赖注入其中，返回它的一个实例
  const target = Injector(Controller);
  const methods = Object.keys(Object.getPrototypeOf(target));

  const routes = methods.reduce((receiver, key) => {
    resolve(target, key, "GET", receiver);
    resolve(target, key, "POST", receiver);
    resolve(target, key, "DELETE", receiver);
    resolve(target, key, "PUT", receiver);
    return receiver;
  }, []);

  return {
    baseUrl,
    routes
  };
}
```

> emmm，这就搞定了。原来是 new Controller，现在是 Injector(Controller)

Demo

```typescript
@Injectable()
class UserService {
  public getUserName() {
    return "saber2pr!";
  }

  public getHello() {
    return "Hello!";
  }
}

@Controller("/user")
class UserController {
  constructor(
    private ContextService: ContextService,
    @Inject("UserService") private UserService: UserService
  ) {}

  @Get("/login")
  public login() {
    this.ContextService.response.end(this.UserService.getUserName());
  }

  @Get("/hello")
  public hello() {
    this.ContextService.response.end(this.UserService.getHello());
  }
}

new Factory([UserController])
  .create()
  .listen(3001, () => console.log("http://localhost:3001"));
// http://localhost:3001/user/login
// http://localhost:3001/user/hello
```

> 关于 saber-ioc 现在已重构为@saber2pr/ioc
> 之前写的文章也做了更新，主要是简化了大部分代码

(最后瞎扯一句) 关于 OOP 的依赖注入和函数式的 compose 一直是个争论的问题，到底哪种方式更好谁也说不清(
