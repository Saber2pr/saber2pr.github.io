Nestjs divides a module into three layers, combines controller and service into an accessible module through module, controller is responsible for route mapping, and service is responsible for docking dao&entity. Controller and service can also be injected into other module.
If controller injects a service, then all module to which it belongs must be injected with the serviceboxes used by controller! Class loading exceptions are usually due to the fact that other module injects another controller but not service that the controller depends on.
By the same token, if service injects a dao&entity, then all controller members must inject the corresponding daoqientitycharacters in their own module! This dependency is indirect and more covert, for example, if App module injects a controller of user, then you need to inject service and dao&entity of user.
### Class loading exception location method
1. Check whether the service of the controller corresponding to the interface has been injected into the module to which the controller belongs
two。 Check whether the dao&entity of service has been injected into the module to which controller belongs
3. Check whether the dependency chain has a loop
### Standard
1. It is recommended that module import each other, which is not prone to error. Routed module is usually injected into app module
2. When controller uses the service of other module, pay attention to whether the service is pure service (no dependency). If not, you need to add dependencies to the module to which you belong. (in this case, it is recommended to separate the service of the tool class from the service of curd.)
3. Do not implement instrumental service and curd service into a service
4. When controller uses the service of other module, try to make this service pure.