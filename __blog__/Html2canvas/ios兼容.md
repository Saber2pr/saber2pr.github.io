除了你已经知道的 html2canvas 最新版在 ios 上需要回退到 rc4，还有几点：

1. rc4 版本不支持 ssr，需要 head script 引入，或者动态导入 import('html2canvas').then(({default: html2canvas}) => {})

2. rc4 版本在 IOS 端不支持 css::LinearGradient !会直接报错进入 catch
