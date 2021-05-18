```ts
export type I18NProps = {
  [key: string]: {
    zh: string;
    en: string;
  };
};

export const useI18N = <T extends I18NProps>(options: T) => {
  const locale = useLocale(); // 语言信息
  const isCN = /^zh|cn$/i.test(locale);
  return (key: keyof T) => options[key][isCN ? 'zh' : 'en'];
};
```

```tsx
const App = () => {
  const i18n = useI18N({
    placeholder: {
      zh: '搜索组件...',
      en: 'search component...',
    },
  })
  return <div>{i18n('placeholder')}</div>
}
```