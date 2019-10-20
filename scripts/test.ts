const os = require("os")

function getLocalIP() {
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

console.log(getLocalIP())
