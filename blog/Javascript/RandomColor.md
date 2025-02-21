Output random rgb color
```js
const rgb = () => {
  const r = Math.floor(Math.random()*256);
  const g = Math.floor(Math.random()*256);
  const b = Math.floor(Math.random()*256);
  const rgb = 'rgb('+r+','+g+','+b+')';
  return rgb;
}
```