Reasonable configuration can optimize webpack memory footprint.
```js
module.exports = {
  watchOptions: {
    aggregateTimeout: 1000,
    ignored: /node_modules|lib/
  }
}
```
### AggregateTimeout
After the first file changes, add a delay before rebuilding. This allows webpack to aggregate any other changes made during this period into a rebuild. Pass a value in milliseconds. Default value: 300.
### Ignored
For some systems, monitoring many file systems can result in significant CPU or memory usage. You can exclude large folders such as node_modules. Anymatch mode can also be used.