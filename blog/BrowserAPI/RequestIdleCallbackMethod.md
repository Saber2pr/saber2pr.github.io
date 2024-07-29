## Brief introduction
This API is one of the BOM API, or window.requestIdleCallback, implemented by the browser. There is no implementation of this API on Node.js.
It calls the registered function during the idle period of the browser, that is, the idle period of the JS engine.
Function signature (since it is still in the proposal stage, Typescript does not declare the function, so you need to declare the signature of the function on your own declare)
```typescript
declare interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number; // 时间片中剩余时间(0 <= timeRemained < 50)
}

declare type IdleOptions = {
  timeout: number;
};

declare type IdleCallback = (deadline: IdleDeadline) => void;

declare function requestIdleCallback(callback: IdleCallback): number;

declare function requestIdleCallback(
  callback: IdleCallback,
  options: IdleOptions
): number;
```
The browser cuts the time into slices per 50ms, and the JS thread executes within each time slice. If there is free time, IdleCallback is executed and a deadline object is passed in to get the remaining free time.