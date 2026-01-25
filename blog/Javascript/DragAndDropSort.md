Application scenario
```html
<ul id="container">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
</ul>
```
You want the mouse to drag the list li element to sort it.
### The solution is as follows:
When the element node attribute draggable is true, it can be dragged by the mouse.
Take advantage of listeners about drag events:
1. Ondragstart
Triggered when an element is dragged
2. Ondragover
Triggers when an element is dragged over the element
Delegate the drag event to the container ul to determine whether to insert before or after when an element is dragged over.
Js Code:
```js
function createDragable(node) {
    node.childNodes.forEach(node => {
        node.draggable = true
    })

    let draging = null;

    node.addEventListener('dragstart', event => {
        draging = event.target;
    })

    node.addEventListener('dragover', event => {
        const target = event.target;
        if (target.nodeName === "LI") {
            if (getIndex(draging) < getIndex(target)) {
                target.parentNode.insertBefore(draging, target.nextSibling);
            } else {
                target.parentNode.insertBefore(draging, target);
            }
        }
    })

    const getIndex = el => {
        let index = 0;
        while (el) {
            index++;
            el = el.previousElementSibling;
        }
        return index;
    }
}

createDragable(document.querySelector("#container"))
```