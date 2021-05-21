原理比较简单，就是通过 vscode.env.language 来判断当前语言环境。

来看看 @iceworks/i18n 是怎么做的：

```ts
import * as template from 'lodash.template'

export interface ITextMap {
  // 这里约定了一个key的命名格式
  // "${namespace}.${extensionName}.${moudelName}.${fieldName}": "xxx"
  [key: string]: string
}

export default class I18n {
  // 语言包列表
  localesTextMap: { [locale: string]: ITextMap } = {}

  // 当前语言包
  currentTextMap: ITextMap = {}

  // 注册语言包
  // text是一个字典对象
  registry(locale: string, text: ITextMap) {
    this.localesTextMap[locale] = text
  }

  // 设置当前语言环境
  setLocal(locale: string) {
    this.currentTextMap =
      this.localesTextMap[locale] ||
      this.localesTextMap[Object.keys(this.localesTextMap)[0]]
  }

  // 获取lang字符串
  format(contentKey: string, args?: Record<string, unknown>) {
    const i18nformatString = this.currentTextMap[contentKey]
    if (!i18nformatString) {
      return ''
    }

    return args ? template(i18nformatString)(args) : i18nformatString
  }
}
```

使用：

```ts
import * as zhCNTextMap from './locales/zh-CN.json'
import * as enUSTextMap from './locales/en-US.json'

const i18n = new I18nService()
// 注册语言包
i18n.registry('zh-cn', zhCNTextMap)
i18n.registry('en', enUSTextMap)

// 设置当前语言环境
i18n.setLocal(vscode.env.language)
```
