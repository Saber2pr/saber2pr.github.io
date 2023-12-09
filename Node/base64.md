```ts
export const base64 = {
  encode(str) {
    return Buffer.from(str).toString('base64');
  },
  decode(base64Str) {
    return Buffer.from(base64Str, 'base64').toString('utf8');
  },
};

```
