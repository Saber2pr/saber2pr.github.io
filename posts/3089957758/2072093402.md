### Reflux reflow
The browser rendering view needs to calculate the position and size of elements within the device viewport, triggering reflow when the position or size of nodes changes.
Trigger condition:
1. Add or remove visible DOM elements
two。 A change in the position or size of the element
3. The content has changed. For example, the text changes or the picture is replaced by a picture of a different size
4. When the page starts to render,
5. Window size change of browser
### Redraw repaint
Changing attributes such as the background color of the element causes the browser to repaint based on the new attribute, giving the element a new appearance.
> Reflow always triggers redraw, and redraw does not always reflow
### Optimization mechanism of browser
Browsers optimize the rearrangement process (batchedUpdates) by queuing changes and executing them in batches.
The browser will put the modification operation in the queue until a period of time or the operation reaches a threshold before emptying the queue. However, when you get the layout information (DOM operation), it forces the queue refresh, such as when you access the following properties or use the following methods:
OffsetTop 、 offsetLeft 、 offsetWidth 、 offsetHeight
ScrollTop 、 scrollLeft 、 scrollWidth 、 scrollHeight
ClientTop 、 clientLeft 、 clientWidth 、 clientHeight
GetComputedStyle ()
GetBoundingClientRect ()
The above properties and methods need to return the latest layout information, so the browser has to empty the queue and trigger a redraw to return the correct value.
Therefore, it is best to avoid using the attributes listed above when modifying styles, as they all refresh the render queue. If you want to use them, it's best to cache the values.