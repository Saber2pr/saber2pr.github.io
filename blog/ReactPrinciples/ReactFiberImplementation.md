## Preface
There are about 20 react-like tagged items on github, almost all of which are encoded in Javascript.
It is difficult to figure out the specific structure of an object, such as the Fiber object, which has many properties, some are pointer fields, some are objects, some are arrays, some are optional.
If the data structure is not modeled properly, it is difficult to grasp the property changes of the object, and it is difficult to analyze the potential bug, let alone optimization, refactoring and so on.
Here is a piece of JS code from a project
```javascript
let oldFiber,
  newFiber,
  element,
  instance = workInProgress.stateNode;
let newState = Object.assign(
  instance.state || {},
  instance._partialState || {}
);
let oldProps = instance.props;
let newProps = workInProgress.props;
const getDerivedStateFromProps = instance.constructor.getDerivedStateFromProps;
```
From this code, you can roughly understand that Fiber has stateNode, props properties, state, partialState, props properties on Fiber.stateNode, and it is also a prototype of the constructor (it is not difficult to see that Fiber.stateNode should be an es6 class object).
Are you starting to feel confused?
It's not that the Javascript code is bad, on the contrary, the JS code is relatively simple, but as a big fan of Typescript, I decided to use TS to rewrite it to deepen my understanding of the Fiber Reconcile process.