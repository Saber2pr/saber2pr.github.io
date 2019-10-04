### Rgba 转 Hex

```ts
export function rgba2Hex(color: string) {
  const rgb = color.split(",")
  const r = parseInt(rgb[0].split("(")[1])
  const g = parseInt(rgb[1])
  const b = parseInt(rgb[2].split(")")[0])

  const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  return hex
}
```

### Hex 转 Rgba

```ts
export function hex2Rgba(hex: string, opacity: number) {
  const RGBA =
    "rgba(" +
    parseInt("0x" + hex.slice(1, 3)) +
    "," +
    parseInt("0x" + hex.slice(3, 5)) +
    "," +
    parseInt("0x" + hex.slice(5, 7)) +
    "," +
    opacity +
    ")"
  return {
    red: parseInt("0x" + hex.slice(1, 3)),
    green: parseInt("0x" + hex.slice(3, 5)),
    blue: parseInt("0x" + hex.slice(5, 7)),
    rgba: RGBA
  }
}
```
