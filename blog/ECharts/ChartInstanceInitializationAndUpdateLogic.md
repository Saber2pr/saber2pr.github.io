1. Initialize the instance:
```ts
let chart = null
chart = echarts.init(element) // echarts初始化后会将chart实例id记录到dom节点attribute上
chart = echarts.init(element) // 重复init时，会判断dom节点是否已初始化过echarts
```
Echart init method implementation (simplified):
```ts
let idBase: number = +new Date() - 0 // chart id生成
const DOM_ATTRIBUTE_KEY = '_echarts_instance_' // chart id记录到dom上时的key
const instances: { [id: string]: ECharts } = {} // 存放chart的map

export function init(dom: HTMLElement): EChartsType {
  const existInstance = instances[dom.getAttribute(DOM_ATTRIBUTE_KEY)]
  if (existInstance) {
    return existInstance // 如果已有初始化实例，直接返回
  }

  const chart = new ECharts(dom)
  chart.id = 'ec_' + idBase++
  instances[chart.id] = chart // chart实例存入instances保存
  dom.setAttribute(DOM_ATTRIBUTE_KEY, chart.id) // 将chart实例id记录到dom上

  return chart
}
```
2. SetOption update
```ts
chart.setOption({
  series: [
    {
      data: [150, 230, 224],
    },
  ],
})
// 更新
chart.setOption({
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
    },
  ],
})
```
SetOption implementation (simplified):
```ts
function setOption<Opt extends ECBasicOption>(option: Opt): void {
  if (this._disposed) {
    return
  }
  if (!this._model) {
    this._model = new GlobalModel()
  }
  this._model.setOption(clone(option))
}
```
The clone function here is a deep copy implementation (simplified):
```ts
export function clone<T extends any>(source: T): T {
  if (source == null || typeof source !== 'object') {
    return source
  }

  let result = {} as any
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      result[key] = clone(source[key])
    }
  }

  return result
}
```
Here source.hasOwnProperty is prone to errors:
[The problem of clone function of zrender of echarts](/blog/随便写点儿？/echarts之zrender的clone函数问题)