1. DatePicker 有两个属性控制其“外貌”，一个是 picker，一个是 mode。如果想动态改变 DatePicker 类型需要同时改变 picker 和 mode。

2. Popover、Select、AutoComplete 等有弹出层的组件，弹出层 Portal 默认是挂到 body 下的，所以写 css 嵌套的时候匹配不到，而且在上层 Layout 容器为 fixed 定位时，滚动时弹出层会脱离弹出时的锚点。为了解决这些问题，它们都有一个 getPopupContainer 方法用来指定挂到那个 dom 节点下(配合 useRef)。一般都会用到的。

3. Table 组件的 dataSource 是需要 key 的，但不需要手动遍历一遍添加 key 属性，使用 rowKey 即可。

4. Modal 组件 visible 为 false 时默认是不销毁子元素的(可以理解为默认是 keep-alive 的)，如果 Model 内组件中用了定时器(比如 react-use 的 useInterval)，你会发现当 Model 消失时，定时器还在跑，useEffect 没有执行 clean subscription。Modal 提供了一个属性用来控制隐藏时是否销毁组件(建议设置为 true)：destroyOnClose，默认 false。

5. antd 中想要拿到非受控的 Input 组件的 value 只有一个办法，就是使用 Form Field，在外面包一层 Form>Form.Item 组件，然后使用 form.getFieldValue 获取相应字段的值。Input 组件没有 forwardRef。

6. Table 组件的 columns 最后一项的 width 最好不要指定，所有的 column.width 加起来不要正好等于容器宽度，否则在某些浏览器上会出现谜之抖动。

7. Menu 中使用 SubMenu，SubMenu 的 Item 默认有一个内联的 padding-left: 48px;，这个是根据 level 和 inlineIndent 计算而来的，inlineIndent 默认为 24px，SubMenu 下的 Item 的 level（层级）为 2，所以 24\*2=48。这两个属性只有设置在 Menu 组件上才生效！SubMenu 和 Menu.Item 上设置是不起作用的！

8. 如果你的项目大量的去覆盖 antd 的默认样式，一定会遇到严重的 CSS Layout Shift 问题！很大一部分原因是因为 antd 组件有些样式本应该通过 props 设置，而你非要使用 css 去设置，写了很复杂的选择器甚至 important 去提高权重，加上 antd 组件几乎都自带 transition，css 文件请求与 dom 渲染之间存在时差，导致页面渲染过程惨不忍睹！所以能通过 props 去设置的样式一定不要去覆盖 css，如果需要可以将 antd 组件自带的 transition 设为 none！特别是你需要自定义其大小、样式、位置时！

9. 覆盖 antd 样式会导致 cls 问题，如果需要定制 antd 风格样式时，建议使用 less modifyVars，在预处理阶段就设置好样式，相关变量参考:

[github.com/ant-design](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)

10. Form.Item 下的默认值(defaultValue)是无法通过 setState 改变的！可以用 useEffect 来检测依赖变化同时 form.resetFields。如果是在 Modal 中使用，Modal 需设置 forceRender。

11. Form.Item 可以包装组件，并自动提交表单值。可以被 Form.Item 包装的组件必须在 props 提供 value 和 onChange 即使组件受控，组件 onChange 传入的值会被提交到表单。

12. Upload 组件提交文件上传时，建议让后端开 cors 直接发，不要自己写代理特别是 nodejs 代理，nodejs 在文件中转这里非常非常坑！！
