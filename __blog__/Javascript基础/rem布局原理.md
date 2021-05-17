rem 布局原理是利用了 css 单位 rem 和等比例换算。

rem 单位可以很方便的以 html 根元素的 font-size 为基础单位进行设置尺寸大小。而且当 html 根元素字体大小发生变化时，所有以 rem 为单位的尺寸也会响应式地发生变化。

换算原理：

设计稿尺寸如果为 1920px，在设计稿上的尺寸 24px 在真实设备上的尺寸可以这样换算：

```bash
24px / 1920px = 真实设备上的尺寸 / 真实设备屏幕宽度
```

即：

```bash
真实设备上的尺寸 = 设计图元素尺寸 * 真实设备屏幕宽度 / 设计图尺寸
```

而真实设备屏幕宽度可以直接通过 js 获取：

```js
const clientWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth
```

那么很容易得出换算函数：

```js
export function fontSize(size: number, designWidth = 1920) {
  const clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  return (size * clientWidth) / designWidth
}
```

当 size=1 时，进一步得出单位尺寸！

```js
const rs = fontSize(1)
```

那么真实设备上的 24px 就是：24rs。
将 html 根元素的 font-size 设置为 1rs，那么真实设备上的 24px 就是 24rem ！

### 结合 calc 和 vw 实现 rem 布局

设备宽度除了使用 js 来获取，也可以直接使用 css 单位 vw，100vw 就是设备宽度。

所以

```bash
真实设备上的尺寸 = 设计图元素尺寸 * calc(100vw / 设计图尺寸)
```

单位尺寸为： calc(100vw / 设计图尺寸)
或者是：(100 / 设计图尺寸)vw

如果需要设置比例 1:100，可以将真实设备尺寸 x100，例如：

```css
html {
  font-size: calc(100vw * 100 / 1920);
  /* 10000 / 1920 = 5.20833.. */
  font-size: 5.208333333vw;
}

.view {
  width: 0.24rem;
}
```

### postcss

以上方法都需要在 css 文件中写 rem 单位，如果有比例还要手动换算。使用 postcss-pxtorem 插件可以在编译期自动按比例换算 px 为 rem。

示例配置：

```js
// postcss.config.js

module.exports = {
  plugins: {
    'postcss-pxtorem': {
      /**
       * 所有px除100+'rem'
       */
      rootValue: 100,
      /**
       * 转换的css属性
       */
      propList: ['*'],
      /**
       * 不换算html的单位
       */
      selectorBlackList: [/^html$/],
      /**
       * 如果需要兼容ie9以下（不支持rem）,replace设为false
       */
      replace: true,
      mediaQuery: false,
      exclude: /node_modules/i,
    },
  },
}
```

然后 html 元素设置 font-size: (10000 / 设计稿尺寸)vw
