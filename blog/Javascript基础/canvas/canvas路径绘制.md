### 线条绘制过程

1. 调用 beginPath，设置线条样式，绘制开始
2. 调用 lineTo，指定路径坐标
3. 调用 stroke 绘制完毕

### API

1. beginPath

启动一次绘制

2. moveTo

设置画笔起点

> 设置起点，绘制线段；如果不设置起点，绘制点。

3. lineTo

设置画笔终点

4. stroke

执行绘制

### 用鼠标在 canvas 上绘制线条

```js
const ctx = canvas.getContext("2d")

let lock = false

const canvasDown = () => {
  lock = true
  ctx.beginPath()
  ctx.strokeStyle = options.color
  ctx.shadowBlur = options.scale
  ctx.shadowColor = options.color
}

const canvasMove = ({ offsetX, offsetY }) => {
  if (!lock) return
  ctx.lineTo(offsetX, offsetY)
  ctx.stroke()
}

const canvasUp = () => {
  lock = false
}

canvas.addEventListener("mousedown", canvasDown)
canvas.addEventListener("mousemove", canvasMove)
canvas.addEventListener("mouseup", canvasUp)
```
