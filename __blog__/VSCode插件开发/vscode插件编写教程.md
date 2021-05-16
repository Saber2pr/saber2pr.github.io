# 编写一个 vscode 插件扩展你的右键菜单！

[vscode 插件编写教程](https://saber2pr.top/#/blog/VSCode%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91/vscode%E6%8F%92%E4%BB%B6%E7%BC%96%E5%86%99%E6%95%99%E7%A8%8B)

[编写一个 vscode 插件扩展你的右键菜单！](https://zhuanlan.zhihu.com/p/369595594)

### 0. 需求

src/components 文件夹通常需要一个 index.ts 做聚合导出，类似这样：

```ts
export * from './button'
export * from './link'
// ...更多组件
```

这个文件如果手写就比较麻烦，希望能通过 vscode 插件解决这个问题，右键点击文件夹在菜单里添加一个“create index.ts file”的选项。

### 1. 初始化插件项目

```bash
# 安装官方cli工具
npm install -g yo generator-code

# 生成项目脚手架
yo code
# 然后根据提示进行
```

### 2. extension.ts 文件内容

作为 vscode 插件激活、运行的入口文件。activate 函数在插件安装时调用，deactivate 函数在插件卸载时调用。

在 activate 函数执行时，可以注册一个命令和命令的回调，回调函数中会传入一个 uri 对象：

```ts
// 插件安装时调用
export function activate(context: vscode.ExtensionContext) {
  // 创建命令
  const createIndexCommand = vscode.commands.registerCommand(
    'createdirindex',
    (uri: vscode.Uri) => {
      // uri会给出命令执行时选择的路径
      // 如果右键点击文件夹，这里就是文件夹的路径
      const dirPath = uri.fsPath
      // 需要实现一个生成index.ts文件的函数
      // genIndex(dirPath)
    }
  )

  // 注册到监听队列中
  context.subscriptions.push(createIndexCommand)
}

// 插件卸载时调用
export function deactivate() {}
```

这里需要做的就是，在回调函数中根据文件夹路径扫描目录下的文件名，然后生成一个 index.ts 文件写到该目录下。

### 3. index.ts 文件生成

```ts
import { readdir, writeFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

const indexFileName = 'index'
const indexFileExt = '.ts'

export async function genIndex(dir: string) {
  // 得到目录下所有文件名集合
  const result = await promisify(readdir)(dir)

  // 过滤掉index.ts文件和index文件夹
  const moduleNames = result
    .map(n => n.split('.')[0])
    .filter(m => m !== indexFileName)

  // 生成聚合导出代码
  const content = moduleNames.map(n => `export * from './${n}';`).join('\n')

  // 写入文件夹下
  await promisify(writeFile)(join(dir, indexFileName + indexFileExt), content)
}
```

### 4. 命令配置到右键菜单

上述代码完成后，vscode 还不能调出命令，这是因为还没有配置。vscode 面板命令(ctrl + shift + P)和右键菜单中的命令都需要在 package.json 中进行配置：

package.json 只需要关心 contributes 一项就好了，其他项请看官方文档：

[package.json 文件说明](https://code.visualstudio.com/api/references/extension-manifest)

```json
{
  "contributes": {
    // 命令配置
    "commands": [
      {
        // 触发命令的事件名
        "command": "createdirindex",
        // 命令在菜单里显示的名称
        "title": "create index.ts file"
      }
    ],
    "menus": {
      // 资源管理器右键菜单
      "explorer/context": [
        {
          "command": "createdirindex",
          // group是分组，1_modification是默认类型之一
          // group字段的详细解释请看官方文档：
          // https://code.visualstudio.com/api/references/contribution-points#Sorting-of-groups
          "group": "1_modification",
          // 什么情况下显示该命令（当所选路径是文件夹时）
          "when": "explorerResourceIsFolder"
        }
      ]
    }
  }
}
```

### 5. 调试插件

以上都完成后可以进行本地调试，点击 vscode 最左侧第 4 个 debug，然后点击运行按钮，会打开一个新的 vscode 窗口并自动安装编写好的插件，可以拖一个本地的项目文件夹进去，然后就可以愉快地调试了~

### 6. 发布你的 vscode 扩展

打包插件，生成 vsix 文件：

```bash
# 安装vscode插件打包工具
npm i -g vsce

# 代码检查，这里最好用eslint格式化一下，避免发布时验证不通过
# 首选项 Eslint > Format: Enable 打勾。代码里右键格式化方式选用Eslint
yarn lint

# 打包生成vsix文件
vsce package
```

然后目录下会得到 xxx-0.0.1.vsix 的文件，.vsix 文件就是 vscode 插件标准格式。在 vscode 左侧边栏扩展中，点击更多操作，有一个“从 VSIX 安装”，可以直接安装本地的插件。

发布插件到 vscode 插件市场：

先注册一个账号，访问：

[https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)

根据提示注册账号。

注册好后进入个人中心，点击 New Extension > Visual Studio Code，然后上传刚才打包好的 vsix 文件。上传成功后还不能马上搜索到，需要等待验证，此时 version 状态为 verify，过几分钟变成对勾就表示成功发布到市场了。然后在扩展中搜索你在 package.json 中设置的 displayName，就可以找到自己的插件了。
