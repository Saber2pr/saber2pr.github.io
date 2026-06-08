The previous article realized the transformation from Controllers to requestListeners. The following problem needs to be solved is how to parse and think when Controller uses IOC container to inject Service.
Build its instance with each Controller as a root node, and parser parses baseUrl and routes from the instance.
The IOC container I wrote before was refactored by me. Qwq,API is now Inject, Injectable, Injector.
> 1. Inject is responsible for adding dependency information.
> 2. Injectable is used to register and cache constructors
> 3. Injector is used to build root instances.
So you need to use Injector to inject dependency on Controller in parse method
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
> emmm, this is done. It used to be new Controller, now it's Injector (Controller)
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
> out saber-ioc has now been refactored to @ saber2pr/ioc
> the previous article has also been updated to simplify most of the code
(finally, nonsense) about OOP dependency injection and functional compose has always been a controversial issue, and no one can tell which way is better.