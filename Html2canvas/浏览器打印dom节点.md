```js
// 在浏览器console控制台执行
// 首先访问这个，把代码复制到console回车执行一下 https://www.unpkg.com/html2canvas@1.4.1/dist/html2canvas.js

const width = temp1.clientWidth;
const height = temp1.clientHeight;

html2canvas(temp1, {
  width,
  height,
  useCORS: true,
  scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
  allowTaint: true,
}).then((canvas) => {
  const imgData = canvas.toDataURL('image/png', 1.0);

  const img = document.createElement('img');
  img.src = imgData;
  img.style.width = width;
  img.style.height = height;

  document.body.append(img);
});

```
