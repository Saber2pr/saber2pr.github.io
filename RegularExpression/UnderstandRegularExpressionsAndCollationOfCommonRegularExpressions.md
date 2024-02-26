Sort out some rules that are often repeated in your work.
```js
export const Patterns = {
  consolelog: /console\s*?\.\s*?log\s*?\([\s\S]*?\)/g,
  import: /import\s*?{([\s\S]*?)}\s*?from\s*?["']([\s\S]*?)["']/g,
  markdown_codeblock: /\`\`\`([\s\S]*?)\n([\s\S]*?)\n\`\`\`/g
}

export const matchPattern = (pattern: RegExp, str: string) => {
  const scan = new RegExp(pattern.source, 'g')
  let next = scan.exec(str)
  const result: RegExpExecArray[] = []
  while (next) {
    result.push(next)
    next = scan.exec(str)
  }
  return result
}

export const getImportNames = (str: string) => {
  const result = matchPattern(Patterns.import, str)
  const importNames = result.map(item => {
    const names = item[1].split(',') // 捕获组第一个，即import{第一个捕获组}
    const libName = item[2] // 捕获组第二个，即import{第一个捕获组}from"{第二个捕获组}"
    return {
      lib: libName,
      names: names.map(name => name.trim())
    }
  })
  return importNames
}

export const getMarkdownCode = (str: string) => {
  const result = matchPattern(Patterns.markdown_codeblock, str)
  return result.map(item => {
    const lang = item[1]
    const code = item[2]
    return {
      lang,
      code
    }
  })
}
```
### Understand regular pattern matching
```txt
/import/     只匹配字符串 import
/import\s*?{/     匹配 import + 空白字符串 + {
/import\s*?{([\s\S]*?)}/     匹配 import + 空白字符串 + { + 任意字符串 + }
/import\s*?{([\s\S]*?)}\s*?from/     匹配 import + 空白字符串 + { + 任意字符串 + } + 空白字符串 + from
/import\s*?{([\s\S]*?)}\s*?from\s*?["']/     匹配 import + 空白字符串 + { + 任意字符串 + } + 空白字符串 + from + 空白字符串 + "或'
/import\s*?{([\s\S]*?)}\s*?from\s*?["']([\s\S]*?)["']/     匹配 import + 空白字符串 + { + 任意字符串 + } + 空白字符串 + from + 空白字符串 + "或' + 任意字符串 + "或'
```
Where [\ s\ S] * matches any string,? Indicates the nearest match (non-greedy pattern), the expression wrapped in parentheses is a capture group, and the expression wrapped in square brackets is a subexpression (where the relationship between elements is or, for example, ["'] can match double or single quotes)
Capture group: RegExpExecArray [how many capture groups]. You can get the matching string in parentheses.
Regular matching in JavaScript:
```js
export const matchPattern = (pattern: RegExp, str: string) => {
  // 这里是拷贝一个正则，因为js中的正则是有状态的（一个正则就是一个状态机）
  const scan = new RegExp(pattern.source, 'g') // g全局匹配
  let next = scan.exec(str) // 迭代向后匹配
  const result: RegExpExecArray[] = []
  while (next) { // 直到扫描到字符串结束
    // next是RegExpExecArray类型，其中保存了匹配到的字符、位置、子表达式捕获组
    result.push(next)
    next = scan.exec(str) // 向后扫描
  }
  return result // 收集到的结果
}
```
### Test case
```js
describe('MatchPattern', () => {
  it('ConsoleLog', () => {
    const str = `
    _handleBindData = () => {
      const { route, navigation, bindData } = this.props;
      const bindDataObj = parseRaw(bindData);
      const { params } = route;
      const { selectedObj } = this.state;
      console.log('绑定前', bindDataObj);
      bindDataObj[params?.mac] = selectedObj;
      console .log ('绑定后', bindDataObj);
      const newBindList = stringifyToRaw(bindDataObj);
      TYDevice.putDeviceData({
        [dpCodes.bindData]: newBindList,
      });
      navigation.navigate('analysis', { isRefresh: true });
    };
    `
    const result = matchPattern(Patterns.consolelog, str)
    expect(result.map(item => item[0])).toEqual([
      `console.log('绑定前', bindDataObj)`,
      `console .log ('绑定后', bindDataObj)`,
    ])
  })

  it('Import', () => {
    const str = `
    import { existsSync, readFile, readFileSync } from 'fs'
    import{ join } from 'path'

    import { PrivateApiList }from './types';

    export const installPrivateApi = async (version?: string) => {
      await downloadTarball(createPrivateTarballUrl(version), tempLocation)
    }
    `
    const result = matchPattern(Patterns.import, str)
    expect(result.map(item => item[0])).toEqual([
      `import { existsSync, readFile, readFileSync } from 'fs'`,
      `import{ join } from 'path'`,
      `import { PrivateApiList }from './types'`
    ])
  })

  it('GetImportNames', () => {
    const str = `
    /* eslint-disable react/jsx-props-no-spreading */
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    /* eslint-disable max-len */
    import React from 'react';
    import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
    import { Rect } from 'react-native-svg';
    import { connect } from 'react-redux';
    import { IconFont, LinearGradient, TopBar, TYSdk, TYSectionList, Utils } from 'tuya-panel-kit';
    
    import dpCodes from '../config/dpCodes';
    import Strings from '../i18n';
    import { DpState } from '../models/modules/common';
    import { handleError, hextoString, parseRaw, stringifyToRaw } from '../utils';
    
    const { parseJSON } = Utils.JsonUtils;
    const selectedPath =
      'M788.053333 276.053333a32 32 0 0 1 48.341334 41.642667l-3.114667 3.584-384 384a32 32 0 0 1-41.642667 3.114667l-3.584-3.114667-170.666666-170.666667a32 32 0 0 1 41.642666-48.341333l3.584 3.114667L426.666667 637.397333l361.386666-361.386666z';
    
    const { convertX: cx, isIphoneX, viewWidth } = Utils.RatioUtils;
    `
    const result = getImportNames(str)
    expect(result).toEqual([
      {
        lib: 'react-native',
        names: ['StyleSheet', 'Text', 'TouchableOpacity', 'View']
      },
      { lib: 'react-native-svg', names: ['Rect'] },
      { lib: 'react-redux', names: ['connect'] },
      {
        lib: 'tuya-panel-kit',
        names: [
          'IconFont',
          'LinearGradient',
          'TopBar',
          'TYSdk',
          'TYSectionList',
          'Utils'
        ]
      },
      { lib: '../models/modules/common', names: ['DpState'] },
      {
        lib: '../utils',
        names: ['handleError', 'hextoString', 'parseRaw', 'stringifyToRaw']
      }
    ])
  })

  it('MarkdownCode', () => {
    const str = `
---
title: Battery 电池
desc: '\`Battery\` 是电池组件，一般用于需要展示电池百分比的场景。'
demo: /basic/battery
---

## 代码演示

### 基础使用

\`\`\`jsx
<Battery value={60} />
\`\`\`

### 本地主题

\`\`\`jsx
<Battery value={40} size={30} theme={{ batteryColor: 'rgba(167,98,43,.5)' }} />
\`\`\`

### 修改电量颜色分配规则

\`\`\`jsx
const calcColor = (top, highColor, middleColor, lowColor) => {
  // 0-10%: 红色   10%-60%: 黑色    60%-100%: 绿色
  if (top <= 8.4 && top >= 3) {
    return highColor;
  } else if (top <= 15.6 && top > 8.4) {
    return middleColor;
  }
  return lowColor;
};
...
<Battery value={60} size={30} onCalcColor={calcColor} middleColor="#999" />
\`\`\`

## API

<API name="BatteryProps"></API>
`
    const result = getMarkdownCode(str)
    expect(result).toEqual([
      { lang: 'jsx', code: '<Battery value={60} />' },
      {
        lang: 'jsx',
        code: "<Battery value={40} size={30} theme={{ batteryColor: 'rgba(167,98,43,.5)' }} />"
      },
      {
        lang: 'jsx',
        code: 'const calcColor = (top, highColor, middleColor, lowColor) => {\n' +
          '  // 0-10%: 红色   10%-60%: 黑色    60%-100%: 绿色\n' +
          '  if (top <= 8.4 && top >= 3) {\n' +
          '    return highColor;\n' +
          '  } else if (top <= 15.6 && top > 8.4) {\n' +
          '    return middleColor;\n' +
          '  }\n' +
          '  return lowColor;\n' +
          '};\n' +
          '...\n' +
          '<Battery value={60} size={30} onCalcColor={calcColor} middleColor="#999" />'
      }
    ])
  })
})
```
### Related library recommendation
1. @ nodelib/fs.walk: traversing all the files / folders under the folder, combined with regular expressions, you can analyze and clean up a lot of useful information
[@ nodelib/fs.walk](https://www.npmjs.com/package/@nodelib/fs.walk)