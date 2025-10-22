## JSX interface
There is an abstract interface JSX in the global namespace
Some types in the JSX interface
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
JSX tag collection interface, similar to HTMLElementTagNameMap
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
Implement the tag signature and the corresponding attributes in global::JSX::IntrinsicElements, and then the JSX tags in the .tsx file will have type prompts such as view and richText, and all prompt for an optional bindtap attribute. For example
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
#### Type mapped type
Because they all have bindtap attributes, you can extract them directly, and then use mapped type to merge the value of each property in the TagNameMap collection into a Base base type to get a new collection type, IntrinsicElements.
> similar to Functor, apply the `& Base` operation to each value in the TagNameMap category, and then get a new category IntrinsicElements
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
What is it used for? for example, 8
Expand on the basis of the above example
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
Write a Component, and the child node is a function, that is, render props rendering
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
<Text/>The child node of the label is constrained to be (value: number) =&gt; JSX.Element type, and Text Component internally passes it a value to execute and return JSX.Element.
Context Customer in React is rendered in this way.
If the declaration of children in JSX.ElementChildrenAttribute is removed, when the Text component is called within the App component, the child node type of the Text component becomes any. So its function is to constrain the type of JSX Children
## About TSX compilation
If it is a jsx file, you need to add the @babel/plugin-transform-react-jsx plugin to babel and configure pragma(i.e. jsxFactory function) for the createElement function you implement, such as the default React.createElement.
But now it's a tsx file, and when ts is compiled to js, you can configure compileOptions in tsconfig.json, and you can specify target, that is, the specific es version, and the module module specification, and so on.
Tsx needs to be configured with two options:
1. A required jsx, if specified as react,tsc, compiles the tsx tag into createElement form (desalination compilation), and if specified as preserve, leaves the jsx part unchanged (no desalination compilation). If you want to use the Fragment tag, jsx must be specified as react.
two。 Optional jsxFactory, default is React.createElement.