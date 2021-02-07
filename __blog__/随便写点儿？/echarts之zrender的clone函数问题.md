echarts 实例的 setOption 方法用来加载/更新图表数据，setOption 方法内部首先使用了 zrender 的 clone 函数对 options 进行了拷贝。但是 zrender 的 clone 方法是不严谨的，下面是一处不严谨的源码位置：

[utils.ts](https://github.com/ecomfe/zrender/blob/master/src/core/util.ts)

```ts
else if (!BUILTIN_OBJECT[typeStr] && !isPrimitive(source) && !isDom(source)) {
    result = {} as any;
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            result[key] = clone(source[key]);
        }
    }
}
```

问题就出在 source.hasOwnProperty(key) 这一行上，source 就是 option.dataset.source，所以 source 就是 object 或 array。

什么情况下 source.hasOwnProperty(key)会报错？
当 source 是一个平坦对象时，即没有继承 Object 原型的对象！例如使用 Object.create(null)创建的对象。

source 通常是我们通过接口请求到的数据进行设置的，接口请求就涉及到 JSON 反序列化，如果你用了第三方的 JSON 序列化库就可能出现平坦对象 clone 报错的问题（source.hasOwnProperty is not defined）。

这个问题其实不算特别严重，因为用原生的 JSON 解析函数就没有问题。但是吧，echarts setOption 报错 source.hasOwnProperty is not defined 你很难第一时间想到是接口请求 json 解析出了问题。
