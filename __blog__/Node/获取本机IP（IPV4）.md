利用内置的 os 模块，访问硬件设备信息。

```ts
const os = require("os")

module.exports = function getLocalIP() {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const interf of interfaces[name]) {
      const { address, family, internal } = interf
      if (family === "IPv4" && !internal) {
        return address
      }
    }
  }
}
```
