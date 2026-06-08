There are no spaces in HTML documents, and the `& nbsp;` symbol is used to force the insertion of spaces.
Remove nbsp:
```js
export const noNbsp = (str: string) =>
  str.replace(new RegExp("\u00A0", "g"), "")
```