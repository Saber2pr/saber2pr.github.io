```ts
export const clipboard = {
  write: (text: string) => navigator.clipboard.writeText(text),
  read: () => navigator.clipboard.readText(),
};
```