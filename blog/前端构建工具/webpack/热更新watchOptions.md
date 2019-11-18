合理配置可以优化 webpack 内存占用。

```js
module.exports = {
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules|lib/
  }
}
```

### aggregateTimeout

第一个文件更改后，在重建之前添加一个延迟。这允许 webpack 将在此时间段内进行的任何其他更改聚合到一次重建中。传递值（以毫秒为单位）。默认值：300。

### ignored

对于某些系统，监视许多文件系统可能会导致大量 CPU 或内存使用。可以排除诸如 node_modules 之类的巨大文件夹。也可以使用 anymatch 模式。
