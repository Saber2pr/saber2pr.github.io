### Linear-gradient
A css function that is used to generate image-like effects.
> generate `< gradient >` data type, which is a special `< image >` data type
Parameter format:
```css
linear-gradient(direction，...colors)
```
Examples:
```css
#demo1 {
  background-image: linear-gradient(to right, red, blue);
}
```
The background image of the element is a gradient from left to right and from red to blue.
> direction can also be deg, such as linear-gradient (45deg, red, blue)
The color can also specify the starting position, for example:
```css
#demo2 {
  background-image: linear-gradient(to right, red, blue 50%);
}
```
Indicates that the blue starts at 50%.