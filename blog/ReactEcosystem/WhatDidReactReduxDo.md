> version: 7.1.0
### I. status update process
1. Each Connect component subscribes to Store. (including Provider)
> For Provider(component top level), onStateChange binding subscription.notifyNestedSubs
> r lower-level components, onStateChange binds checkForUpdates
> so only one listener is registered in store, and the listeners of the components are all in Provider::subscription
> Then the Provider associates the store with the subscription
[ConnectAdvanced.js#L361](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L361)
2. The Connect component calls dispatch, and each Connect component in the entire Component tree will checkForUpdates. (i.e. subscription.onStateChange)
[ConnectAdvanced.js#L309](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L309)
### II. Core
1. Provider Store is recorded in ReactReduxContext
[Provider.js#L55](https://github.com/reduxjs/react-redux/blob/master/src/components/Provider.js#L55)
2. Connect function executes mapXXXToProps to get actualChildProps
[ConnectAdvanced.js#L280](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L280)
> TODO We're reading the store directly in render () here. Bad idea?
> This will likely cause Bad Things (TM) to happen in Concurrent Mode.
> Note that we do this because on renders _ not_ caused by store updates, we need the latest store state
> to determine what the child props should be.
It is mentioned here that when executing mapXXXToProps (synchronized with component rendering), the status in Store is read, and there may be an error in concurrent mode, but mapXXXToProps execution needs to get the State in Store first. So try to ensure that mapXXXToProps is a pure function.
Then write the actualChildProps to the WrappedComponent component props rendering.
[ConnectAdvanced.js#L388](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L388)
Read Context and subscribe to Store.
> subscription is from props.context.subscription or ReactReduxContext.subscription
[connectAdvanced.js#L361](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L361)
3. Hooks support for FunctionComponent is provided. Hooks reads Store from ReactReduxContext.
[UseReduxContext.js#L22](https://github.com/reduxjs/react-redux/blob/master/src/hooks/useReduxContext.js#L22)
### III. Optimization
1. connectAdvanced provides the shouldHandleStateChanges parameter, indicating whether the component subscribes to the store. (i.e., whether it is a pure showcase component) reduces the number of batchedUpdates tasks.
[ConnectAdvanced.js#L302](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L302)
2. When obtaining actualChildProps from the Connect component, if the Props accepted by the Connect component does not change (shallow comparison), the Props after the last store.dispatch execution will be returned directly without the need to execute mapXXXToProps again.
> that is, the same input does not need to be executed again, which belongs to memorization optimization.
[ConnectAdvanced.js#L271](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L271)
3. CheckForUpdates in the Connect component is compared with shouldComponentUpdate, and the new and old props are compared. (shallow comparison) reduce re-render.
> renderIsScheduled is used as a component to update status to deal with rendering loss caused by dynamic change of shouldHandleStateChanges.
[ConnectAdvanced.js#L336](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L336)
4. Exception handling. Exceptions that occur during mapXXXToProps execution are cached to previousStateUpdateResult and passed up. Errors in mapXXXToProps for components that are not shown in conditional rendering are handled in unsubscribeWrapper.
[ConnectAdvanced.js#L372](https://github.com/reduxjs/react-redux/blob/master/src/components/connectAdvanced.js#L372)