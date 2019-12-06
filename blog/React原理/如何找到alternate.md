模型：alternate ↹ constructor ↹ instance。

所以 alternate 链接的不仅是新旧 fiber。而是使用静态的构造器作为反射者来关联两者。所以说是三者之间的关系。

就比如，函数组件执行后返回了新的 fiber 是{type, props}，此时的 type 必然是函数组件本身（function），通过在 type 上设置一个 alternate 属性就可以保存一份旧的 fiber。这样新的 fiber 通过 type.alternate 就可以访问到旧的 fiber。

所以是借助了函数组件本身作为 alternate 的宿主，这样每次生成新的 fiber 就可以直接从 type 中获取旧的 fiber。

所以只有在 hook fiber 上才能找到 alternate，host fiber 上的 alternate 其实是在 reconcileChildren 中生成的。
