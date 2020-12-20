## JSX 接口

在 global 命名空间中有一个抽象接口 JSX

JSX 接口中的部分类型

```typescript
declare global {
  namespace JSX {
    // 标签集合接口，定义了可用的标签类型和对应属性。(需要你实现。)
    type IntrinsicElements = {};
    // JSX.Element 接口(需要你实现。)
    interface Element {}
    // Children 类型接口，用于对闭合标签中children做类型检查。(需要你实现。)
    interface ElementChildrenAttribute {}
  }
}
```

#### JSX.IntrinsicElements

JSX 标签集合接口，类似 HTMLElementTagNameMap

```typescript
declare global {
  namespace JSX {
    type IntrinsicElements = {
      view: { bindtap?: Function };
      richText: { bindtap?: Function };
      text: { bindtap?: Function };
      label: { bindtap?: Function };
      navigator: { bindtap?: Function };
    };
  }
}
```

在 global::JSX::IntrinsicElements 中实现标签名和对应的属性，然后在.tsx 文件中的 JSX 标签就会有 view、richText 这些的类型提示，并且都提示有一个可选的 bindtap 属性。例如

```typescript
function App() {
  return (
    <view>
      <text bindtap={() => console.log("click")} />
      <text />
    </view>
  );
}
```

#### 类型 mapped type

因为都有 bindtap 属性所以可以直接抽离出来，然后使用 mapped type，将 TagNameMap 集合中每个属性的值并入一个 Base 基类型得到一个新的集合类型 IntrinsicElements

> 有点类似 Functor，将`& Base`运算应用到 TagNameMap 范畴中的每个值，然后得到新的范畴 IntrinsicElements

```typescript
// TagNameMap 范畴
type TagNameMap = {
  view: {};
  richText: {};
  text: {};
  label: {};
  navigator: {};
};

type Base = {
  bindtap?: Function;
};

declare global {
  namespace JSX {
    // IntrinsicElements 范畴
    type IntrinsicElements = {
      [Tag in keyof TagNameMap]: TagNameMap[Tag] & Base
    };
  }
}
```

### JSX.ElementChildrenAttribute

它用来干什么，举个例子 8

就在上面例子基础上扩展

```typescript
declare global {
  namespace JSX {
    type IntrinsicElements = {
      [Tag in keyof TagNameMap]: TagNameMap[Tag] & Base
    };
    export interface Element extends Base {}
    export interface ElementChildrenAttribute {
      children: any; // JSX标签中子节点即children的类型
    }
  }
}
```

写一个 Component，子节点是个 function，即 render props 方式渲染

```typescript
function Text({ children }: { children?: (value: number) => JSX.Element }) {
  return <text>{children(233)}</text>;
}

function App() {
  return (
    <view>
      <text bindtap={() => console.log("click")} />
      <Text>{value => <text>{value}</text>}</Text>
    </view>
  );
}
```

<Text/>标签的子节点被约束为(value: number) => JSX.Element 类型，Text Component 内部传给它一个值执行返回 JSX.Element。
React 中 Context Customer 就是采用此种方式渲染。

如果去掉 JSX.ElementChildrenAttribute 中 children 的声明，在 App 组件内调用 Text 组件时，Text 组件的子节点类型就会变成 any。所以它的作用就是用于约束 JSX Children 的类型

## 关于 TSX 编译

如果是 jsx 文件，需要给 babel 添加@babel/plugin-transform-react-jsx 插件，并配置 pragma(即 jsxFactory 函数)为你实现的 createElement 函数，例如默认的 React.createElement。

但是现在是 tsx 文件，ts 编译到 js 可以在 tsconfig.json 中配置 compileOptions，可以指定到 target，即具体的 es 版本，和 module 模块规范等。
tsx 需要配置两个选项：

1. 一个必选的 jsx，如果指定为 react，tsc 会把 tsx 标签编译为 createElement 形式(脱糖编译)，如果指定为 preserve，则保留 jsx 部分不变(不脱糖编译)。如果要使用 Fragment 标签，则 jsx 必须指定为 react。

2. 可选的 jsxFactory，默认为 React.createElement。
