本质就是把下一层的 async 函数包装一层后传给上一层 await 调用，和递归差不多。

```typescript
const process = (...jobs) =>
  jobs.reduceRight(
    (next, job) => async () => await job(ctx, next),
    () => Promise.resolve()
  );
```

测试

```typescript
async function job1(ctx, next) {
  console.log(ctx.name, "1");
  await next();
  console.log(ctx.name, "5");
}

async function job2(ctx, next) {
  console.log(ctx.name, "2");
  await next();
  console.log(ctx.name, "4");
}

async function job3(ctx) {
  console.log(ctx.name, "3");
}

const ctx = { name: "koa" };

const process = (...jobs) =>
  jobs.reduceRight((next, job) => async () => await job(ctx, next), null);

process(job1, job2, job3)(); // koa 1, koa 2, koa 3, koa 4, koa 5
```
