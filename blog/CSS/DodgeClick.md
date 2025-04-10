Sometimes you don't want an element to be clicked on, but rather to penetrate into its underlying container.
For example, in an event broker:
```html
<div class="wrapper">
  <div class="btn">
    <svg></svg>
    <span class="btn-name">按钮</span>
  </div>
</div>
```
To determine whether the click event source target is a btn element in the wrapper element onClick, but the click event is a bubble trigger, the event source becomes a btn-name element. The solution is to set pointer-events:none in the btn-name style, clicking will ignore the btn-name element, i.e. btn-name avoids clicking.