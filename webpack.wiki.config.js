const config = require("./webpack.config")
const path = require("path")

config.entry.index = "./src/wiki.tsx"
config.output.publicPath = "/release"
config.output.path = path.join(__dirname, "release")

module.exports = config
