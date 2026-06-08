The principle of rem layout is the use of css unit rem and proportional conversion.
Rem units can easily be sized based on the font-size of the html root element. And when the font size of the html root element changes, all sizes in rem will change in response.
Conversion principle:
If the size of the design draft is 1920px, the size of the design draft 24px on the real equipment can be converted as follows:
```bash
24px / 1920px = 真实设备上的尺寸 / 真实设备屏幕宽度
```
That is:
```bash
真实设备上的尺寸 = 设计图元素尺寸 * 真实设备屏幕宽度 / 设计图尺寸
```
The screen width of a real device can be obtained directly from js:
```js
const clientWidth =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth
```
Then it is easy to get the conversion function:
```js
export function fontSize(size: number, designWidth = 1920) {
  const clientWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  return (size * clientWidth) / designWidth
}
```
When size=1, further get the unit size!
```js
const rs = fontSize(1)
```
So the 24px on the real device is: 24rs.
If the font-size of the html root element is set to 1rs, then the 24px on the real device is 24rem!
### Implementation of rem layout by combining calc and vw
In addition to using js to obtain the device width, you can also directly use the css unit vw,100vw, which is the device width.
so
```bash
真实设备上的尺寸 = 设计图元素尺寸 * calc(100vw / 设计图尺寸)
```
Unit size is: calc (100vw / blueprint size)
Or: (100mm / blueprint size) vw
If you need to set a scale of 1VR 100, you can set the real device size x100, for example:
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
### Postcss
All of the above methods require rem units to be written in the css file, and manual conversion if there is a scale. The postcss-pxtorem plug-in automatically scales px to rem at compile time.
Example configuration:
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
Then the html element sets font-size: (10000 / design size) vw