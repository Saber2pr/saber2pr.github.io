### Canvas

Canvas 是 HTML5 支持的标签，可以使用像素级别绘图。

### CanvasRenderingContext2D

2d 绘图时需要的 context

```ts
const ctx = canvas.getContext("2d")
```

### ImageData 类

一个缓存层，先在 ImageData 上操作，然后 put 到 ctx 上。

设置指定坐标位置的像素。

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

> color 为 rgba 值(red, green, blue, 透明度)

### 示例

在（100, 100）坐标处画一个点。

```ts
const ctx = canvas.getContext("2d")

const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

set(imageData, 100, 100, [0, 0, 0, 255])

ctx.putImageData(imageData, 0, 0)
```
