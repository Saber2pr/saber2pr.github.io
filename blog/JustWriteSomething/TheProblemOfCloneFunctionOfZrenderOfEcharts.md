The setOption method of the echarts instance is used to load / update chart data. The setOption method first uses the clone function of zrender to copy the options. However, zrender's clone method is not rigorous. Here is an imprecise source location:
[Utils.ts](https://github.com/ecomfe/zrender/blob/master/src/core/util.ts)
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
The problem lies in the line of source.hasOwnProperty (key). Source is option.dataset.source, so source is object or array.
Under what circumstances will source.hasOwnProperty (key) report an error?
When source is a flat object, there is no object that inherits the Object prototype! For example, objects created using Object.create (null).
Source is usually set through the data requested by the interface, and the interface request involves JSON deserialization. If you use a third-party JSON serialization library, you may have a flat object clone error (source.hasOwnProperty is not defined).
This problem is not particularly serious, because there is no problem with parsing functions with native JSON. But, echarts setOption error source.hasOwnProperty is not defined, it is difficult to think of the interface request json parsing problem in the first place.