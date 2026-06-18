When the width and height of the element is 0, the upper, lower, left and right borders will become triangles.
There are three situations:
1. When only two borders are set, two diagonal right triangles appear
two。 When three borders are set, the symmetrical two become diagonal and right triangular.
3. When you set four borders, there are four concentric triangles
Upward isosceles triangle
```css
.triangle {
  width: 0;
  height: 0;
  /* transparent为透明色彩，左右透明，下面部分就是朝上的三角形 */
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 50px solid aqua;
}
```
Four concentric triangles
```css
.triangle0 {
  width: 0;
  height: 0;
  border-left: 50px solid #ffae00;
  border-right: 50px solid #ff00d4;
  border-top: 50px solid #00ffff;
  border-bottom: 50px solid #ff0062;
}
```
Upper left triangle
```css
.triangle1 {
  width: 0;
  height: 0;
  border-right: 50px solid transparent;
  border-top: 50px solid aqua;
}
```