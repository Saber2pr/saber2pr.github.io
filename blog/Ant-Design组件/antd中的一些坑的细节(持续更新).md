1. DatePicker 有两个属性控制其“外貌”，一个是 picker，一个是 mode。如果想动态改变 DatePicker 类型需要同时改变 picker 和 mode。

2. Popover、Select、AutoComplete 等有弹出层的组件，弹出层 Portal 默认是挂到 body 下的，所以写 css 嵌套的时候匹配不到，而且在上层 Layout 容器为 fixed 定位时，滚动时弹出层会脱离弹出时的锚点。为了解决这些问题，它们都有一个 getPopupContainer 方法用来指定挂到那个 dom 节点下(配合 useRef)。一般都会用到的。

3. Table 组件的 dataSource 是需要 key 的，但不需要手动遍历一遍添加 key 属性，使用 rowKey 即可。

4. Modal 组件 visible 为 false 时默认是不销毁子元素的(可以理解为默认是 keep-alive 的)，如果 Model 内组件中用了定时器(比如 react-use 的 useInterval)，你会发现当 Model 消失时，定时器还在跑，useEffect 没有执行 clean subscription。Modal 提供了一个属性用来控制隐藏时是否销毁组件(建议设置为 true)：destroyOnClose，默认 false。

5. antd 中想要拿到非受控的 Input 组件的 value 只有一个办法，就是使用 Form Field，在外面包一层 Form>Form.Item 组件，然后使用 form.getFieldValue 获取相应字段的值。Input 组件没有 forwardRef。
