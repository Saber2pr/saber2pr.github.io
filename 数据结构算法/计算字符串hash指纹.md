```ts
export const hashcode = (str: string) => {
  const string = str.toString();
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = ((hash << 5) - hash + string.charCodeAt(i)) & 0xffffffff;
  }
  return `${hash}`;
};
```
