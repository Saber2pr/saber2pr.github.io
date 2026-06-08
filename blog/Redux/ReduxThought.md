With regard to redux, it is enough to grasp the three principles. As for how to achieve it, that's your business.
## Three principles of Redux
#### Single data source
In fact, it is meant to be implemented using the observer pattern.
#### State is read-only
Immutable .
#### Use pure functions to perform modifications
Pure function is emphasized.
### Essence
What do you think of subscription + immutable + pure-function all these things together?
Yes, it can deal with the functional programming idea of side-effect!
Side-effect (side effects) is handled by subscriptions in redux, and the pure function is called reducer, which can transform state into another state. What do you think of?
```ts
State1 {                State2 {
  name   -> reducer1 ->   name
  age    -> reducer2 ->   age
}                       }

State1   -> reducer  -> State2
```
So isn't Store Functor? Dispatch is the fmap,dispatch that applies reducer to State and becomes another State.
As for action, it is completely optional.
#### Is Store Monad?
Monad needs to implement two operations, > = and return.
Store.getState is return. (pure your own state)
> ppose Store.dispatch:: Monad m = > (State-> m State)-> m State
> e following is the pseudo code
Store > > = (\ state-> return state) = = Store
There should be Store.dispatch (_ = > Store.getState ()) = = Store
The operator > > = is used to concatenate a series of IO operations, where the IO operation is handled in subscriptions in redux, and the IO operation is triggered by calling dispatch.
The problem is that dispatch is executed synchronously, so you can't call dispatch in reducer (there will be an endless loop).
You can use microtask to do this in JS. Please take a look at the Promise principle for details.