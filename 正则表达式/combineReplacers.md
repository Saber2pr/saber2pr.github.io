```ts
export const compose = <T>(...fns: Array<(value: T) => T>) =>
  fns.reduce((a, b) => value => a(b(value)));
export const pipe = <T>(...fns: Array<(value: T) => T>) =>
  compose(...fns.slice().reverse());

export const combineReplacers = (
  replacers: Array<[RegExp, (substring: string, ...args: any[]) => string]>,
) =>
  pipe<string>(
    ...replacers.map(([reg, replacer]) => (str: string) =>
      str.replace(new RegExp(reg.source, 'g'), replacer),
    ),
  );
```

使用：

```ts
const formatChangelog = combineReplacers([
  // clear changelog content
  [/# Change Log[\s\S]*?##/, () => '##'],
  // format no-link date title
  [/##\s*?(\d+\.\d+\.\d+)\s*?\((\d{4}-\d{2}-\d{2})\)/, (_, version, date) => `## [${version}](#) (${date})`],
  // format h level
  [/\n# \[(\d+\.\d+\.\d+\S*?)\]\(/, (_, version) => `\n## [${version}](`],
  // format h levels
  [/####/, () => '##'],
  [/#####/, () => '###'],
  // format no link rc title
  [/# (\d+\.\d+\.\d+-rc\.\d+)\s*?\((\d{4}-\d{2}-\d{2})\)/, (_, version, date) => `## [${version}](#) (${date})`]
])

formatChangelog(`### changelog\n ....`)
```
