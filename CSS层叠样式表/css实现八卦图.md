```html
<div class="bagua">
  <div class="left">
    <div class="left-1">
      <div class="left-1-1"></div>
    </div>
  </div>
  <div class="right">
    <div class="right-1">
      <div class="right-1-1"></div>
    </div>
  </div>
</div>
```

```css
@keyframes circle {
    0% { 
        transform: rotate(0deg);
    }
    100% { 
        transform: rotate(360deg); 
    }
}

.bagua {
    --width: 18px;
    --height: var(--width);
    --radius: calc(var(--width) / 2);
    --radius2: calc(var(--width) / 4);
    --radius3: calc(var(--width) / 6);
    --color1: white;
    --color2: black;
    display: flex;
    width: var(--width);
    height: var(--height);
    border-radius: 50%;
    animation: circle 1s linear infinite;
    position: fixed;
    box-shadow: 0px 0px 5px var(--color2);
}

.bagua .left {
    width: var(--width);
    height: var(--height);
    background-color: var(--color1);
    border-top-left-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
}

.bagua .left .left-1 {
    background-color: var(--color1);
    width: var(--radius);
    height: var(--radius);
    border-radius: 50%;
    position: relative;
    left: var(--radius2);
}

.bagua .left-1 .left-1-1 {
    background-color: var(--color2);
    width: var(--radius3);
    height: var(--radius3);
    border-radius: 50%;
    position: relative;
    left: var(--radius2);
    top: var(--radius2);
    transform: translate(-50%, -50%);
}

.bagua .right {
    width: var(--width);
    height: var(--height);
    background-color: var(--color2);
    border-top-right-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
}

.bagua .right .right-1 {
    background-color: var(--color2);
    width: var(--radius);
    height: var(--radius);
    border-radius: 50%;
    position: relative;
    right: var(--radius2);
    top: var(--radius);
}

.bagua .right-1 .right-1-1 {
    background-color: var(--color1);
    width: var(--radius3);
    height: var(--radius3);
    border-radius: 50%;
    position: relative;
    left: var(--radius2);
    top: var(--radius2);
    transform: translate(-50%, -50%);
}
```
