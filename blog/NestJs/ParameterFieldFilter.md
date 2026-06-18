For some APIs, such as the parameter fields of the update API, there may be some unnecessary useless fields passed from the frontend, which can be filtered using ValidationPipe:
```ts
@Post('/update')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: {
      excludeExtraneousValues: true
    },
  }),
)
update(@Body() dto: Dto) {
  return this.service.update(dto);
}
```
Or partial filtering:
```ts
@Post('/update')
@UsePipes(
  new ValidationPipe({
    transform: true,
    transformOptions: {
      strategy: 'exposeAll',
      excludePrefixes: ['prop1', 'prop2'],
    },
  }),
)
update(@Body() dto: Dto) {
  return this.service.update(dto);
}
```