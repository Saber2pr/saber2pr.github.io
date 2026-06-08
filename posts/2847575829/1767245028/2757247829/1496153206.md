## State Hook
There are two questions left in the beginWork/updateHookComponent function, which are about the Order class and currentFiber.
#### UpdateHOOKComponent
```typescript
function updateHOOKComponent(fiber: Fiber) {
  // 省略细节...

  currentFiber = fiber.instance;

  Order.fallback();

  // 省略细节...
}
```
### CurrentFiber
CurrentFiber is the instantaneous execution point in the scheduling process, and a copy is captured and saved in the hook API closure.
### Order
sequential ID allocator
```typescript
class Order {
  private constructor() {}
  public static create() {
    const instance = new Order();
    Order.insList.push(instance);
    return instance;
  }
  public static insList: Order[] = [];
  private it = Order.INIT();
  public forward() {
    return this.it.next().value;
  }
  private fallback() {
    this.it = Order.INIT();
  }
  public static fallback() {
    Order.insList.forEach(ins => ins.fallback());
  }
  private static *INIT() {
    for (let i = 0; ; ++i) yield i;
  }
}
```
It's just an inert infinite sequence, that is, [0,1...]
Forward is used to allocate ID,fallback for allocator rollback.
What problem does it solve? Distinguish between contexts that call the same type of Hook API multiple times.
## UseState implementation
Depend on the Fiber.state attribute
```typescript
// state hook的顺序id分配器
const StateOrder = Order.create();

// setState类型
type Dispatcher<T> = (state: T) => void;

export function useState<T>(initialState: T): [T, Dispatcher<T>] {
  // 给当前hook关联的state分配一个id
  const id = StateOrder.forward();

  // currentFiber是一个不断变化的值，hook内部需要捕获并缓存一份它的瞬时值
  // 记录即缓存一份currentFiber，拿到控制权，用于从当前记录点恢复
  const fiber = currentFiber;

  // fiber.state是一个state map，类型为 {[id:string]: Dict}
  const stateMap = fiber.state;

  // 如果当前id不存在则stateMap[id]初始化为init state
  if (!(id in stateMap)) stateMap[id] = initialState;

  // setState函数
  const setState: Dispatcher<T> = state => {
    // 检查setState执行时期，如果workInProgress存在表明是同步调用setState
    // setState必须为异步调用，否则调度机制会陷入死循环
    // 而且同步调用setState也没有任何意义。
    if (workInProgress) {
      throw new Error("setState should be executed asynchronously.");
    }

    // 根据id拿到当前hook分配到的state，并更新为传入的新的state
    stateMap[id] = state;

    // 从hook 闭包内保存的fiber断点恢复(或叫返回现场)
    React.render(fiber);
  };

  // 返回分配到的state和setState函数
  return [stateMap[id], setState];
}
```