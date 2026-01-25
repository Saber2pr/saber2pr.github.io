### Line drawing process
1. Call beginPath, set the line style, and start the drawing
two。 Call lineTo to specify path coordinates
3. Call stroke to finish drawing
### API
1. BeginPath
Start a drawing
2. MoveTo
Set the brush start point
> set the starting point and draw the line segment; if you do not set the starting point, draw the point.
3. LineTo
Set brush end point
4. Stroke
Perform drawing
### Draw lines on the canvas with the mouse
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