### Canvas
Canvas is a label supported by HTML5 and can be drawn at the pixel level.
### CanvasRenderingContext2D
2d context required for drawing
```ts
const ctx = canvas.getContext("2d")
```
### ImageData class
A cache layer that operates on ImageData and then put to ctx.
Sets the pixel of the specified coordinate location.
```ts
export function get(imageData: ImageData, x: number, y: number) {
  const color = []
  color[0] = imageData.data[4 * (imageData.width * y + x)]
  color[1] = imageData.data[4 * (imageData.width * y + x) + 1]
  color[2] = imageData.data[4 * (imageData.width * y + x) + 2]
  color[3] = imageData.data[4 * (imageData.width * y + x) + 3]
  return color
}

export function set(
  imageData: ImageData,
  x: number,
  y: number,
  color: number[]
) {
  imageData.data[4 * (imageData.width * y + x)] = color[0]
  imageData.data[4 * (imageData.width * y + x) + 1] = color[1]
  imageData.data[4 * (imageData.width * y + x) + 2] = color[2]
  imageData.data[4 * (imageData.width * y + x) + 3] = color[3]
}
```
> color is the rgba value (red, green, blue, transparency)
### Example
Draw a point at (100,100) coordinates.
```ts
const ctx = canvas.getContext("2d")

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

set(imageData, 100, 100, [0, 0, 0, 255])

ctx.putImageData(imageData, 0, 0)
```