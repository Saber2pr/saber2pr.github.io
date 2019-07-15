本质就是，一个观察者模式的实现。组件监听浏览器 url 的变化，作出匹配和响应。但是，路由有一点是观察者模式无法做到的，那就是当用户点击浏览器前进和后退键时，观察者不能察觉到这种行为。所以需要借助几个原生的 api 来填补这个缺点。那就是 onpopstate 事件。浏览器点击前进和后退键时会发射这个事件，所以我们可以监听这个事件，在事件回调里调用观察者 dispatch 来衔接。

```typescript
window.onpopstate = event => {
  // 调用事件处理函数
  gotoRoute(__routes, event.state);
};
```

\_\_routes 对象是我们事先注册的路由，类型如下：

```typescript
export interface Routes {
  [url: string]: string | (() => void);
}
```

gotoRoute 函数可以找到\_\_routes 对象中对应的路由分支，并执行注册的监听器。

```typescript
const gotoRoute = (routes: Routes, start: string): void => {
  let current = routes[start];
  if (typeof current === "undefined") RouteException(start);
  let url: string;
  while (typeof current === "string") {
    const next = routes[current];
    if (next) {
      url = current;
      current = next;
    } else {
      RouteException(current);
    }
  }
  __currentHref = url || start;
  current();
};
```

\_\_currentHref 会把当前的 url 记录下来以供组件拉取。

除此之外，我们还需要提供手动触发路由的函数

```typescript
export function push(url: string) {
  // 将url显示到浏览器地址栏上，并把url记录到state中备用。
  window.history.pushState(url, null, url);
  url in __routes ? gotoRoute(__routes, url) : RouteException(url);
}
```

路由注册函数 useRoutes

```typescript
export function useRoutes(
  arg1: Routes | string,
  arg2?: string | (() => void)
): UnUseRoutes {
  if (typeof arg1 === "string") {
    arg1 in __routes || (__routes[arg1] = arg2);
    return () => arg1 in __routes && delete __routes[arg1];
  } else {
    Object.keys(arg1).forEach(
      key => key in __routes || (__routes[key] = arg1[key])
    );
    return () =>
      Object.keys(arg1).forEach(key => key in __routes && delete __routes[key]);
  }
}
```

最后需要注意，在函数组件中注册路由监听器必须在 useEffect 中进行，关于 useEffect 此处不多讲了。

saber-router 项目地址

https://github.com/Saber2pr/saber-router
