1. Components try not to set styles, emphasizing logic rather than styles.
2. When adding new functionality to a component, adhere to the backward compatibility principle.
3. It is best not to have http requests or operations such as useSelector to connect to redux in the component.
4. The properties of the component must be as few as possible, and the default values should be set as much as possible.
5. When components encapsulate each other, if not more than two generations, priority is given to inheritance.
6. Components folder do not aggregate exports, reference components on demand.