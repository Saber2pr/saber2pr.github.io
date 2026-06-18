```javascript
/**
 * lisen
 * @param {string[]} ids
 * @param {boolean} isCatch
 */
const lisen = (ids, isCatch) =>
  ids.forEach(id =>
    document
      .getElementById(id)
      .addEventListener("click", () => alert(id), isCatch)
  )

// BubbleEvent
lisen(["root_b", "first_b", "second_b", "target_b"], false)

// CatchEvent
lisen(["root_c", "first_c", "second_c", "target_c"], true)
```
About the third parameter options of addEventListener
If the value is boolean, false is a bubble event, and true is a capture event. The default is bubble.
If it is an object, it is an optional parameter object that specifies the listener property. The available options are as follows:
1. Capture: Boolean, indicating that listener will be triggered when the event capture phase of this type propagates to the EventTarget.
2. Once: Boolean, which means that listener can only be called once at most after it is added. In the case of true, listener is automatically removed after it is called.
3. Passive: Boolean, when set to true, means that listener will never call preventDefault (). If listener still calls this function, the client will ignore it and throw a console warning. If an event does not require preventDefault, setting passive true directly can play an optimization role.