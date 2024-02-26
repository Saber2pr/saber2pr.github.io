### Tooltip suspension Tip
```tsx
options = {
  tooltip: {
    // formatter 可以是函数，返回格式字符串或 html 字符串。可以自定义其样式
    formatter: props => {
      const { name, value } = props
      return ReactDOMServer.renderToString(
        <div className="tooltip">
          <span className="tooltip-name">{name}</span>:
          <span className="tooltip-value">{value}</span>
        </div>
      )
    },
  },
}
```
### Inner margin of grid chart
```ts
options = {
  grid: {
    left: 24,
    top: 24,
    bottom: 24,
    right: 24,
  },
}
```
### Legend legend
```ts
options = {
  legend: {
    data: ['支出', '收入'], // 图例对应维度
    icon: 'rect', // 图例标记样式
    itemWidth: 8, // 图例标记宽度
    itemHeight: 8, // 图例标记高度
    textStyle: {
      // 图例的公用文本样式
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0)',
    },
    itemGap: 24, // 图例每项之间的间隔
  },
}
```
### X axis
```ts
options = {
  xAxis: {
    type: 'category', // x轴一般为类目轴category
    // x轴类目
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    boundaryGap: false, // 曲线两侧贴边
    // 坐标轴文本样式
    axisLabel: {
      color: '#6B6678',
    },
    // 坐标轴分割线
    splitLine: {
      show: false,
    },
    // 坐标轴刻度
    axisTick: {
      show: false,
    },
    // 坐标轴样式
    axisLine: {
      lineStyle: {
        color: 'rgba(107, 102, 120, 0.32)',
      },
    },
  },
}
```
### y-axis
```ts
options = {
  yAxis: [
    {
      type: 'value', // y轴一般为数值轴value
      name: '支出',
      minInterval: 10000,
      // y轴名称文本样式
      nameTextStyle: {
        align: 'left',
        padding: [0, 0, 0, -42],
        color: '#141B27',
        fontSize: 14,
        fontWeight: 500,
      },
      // y轴名称文本和y轴竖直间隔距离
      nameGap: 19,
      // 坐标轴文本样式
      axisLabel: {
        color: '#6B6678',
        align: 'left',
        margin: 42,
        fontSize: 12,
        // y轴刻度文本格式化
        formatter: value => `￥${value}`,
      },
      // 坐标轴分割线
      splitLine: {
        show: false,
      },
      // 坐标轴刻度
      axisTick: {
        show: false,
      },
      // 坐标轴样式
      axisLine: {
        show: false,
      },
    },
  ],
}
```