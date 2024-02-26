# Write a vscode plug-in to extend your right-click menu!
[Vscode plug-in writing tutorial](https://saber2pr.top/blog/VSCode%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91/vscode%E6%8F%92%E4%BB%B6%E7%BC%96%E5%86%99%E6%95%99%E7%A8%8B)
[Write a vscode plug-in to extend your right-click menu!](https://zhuanlan.zhihu.com/p/369595594)
### 0. Demand
The src/components folder usually requires an index.ts for aggregate export, like this:
```ts
export * from './button'
export * from './link'
// ...更多组件
```
It is troublesome to write this file by hand. I hope you can solve this problem through the vscode plug-in. Right-click on the folder to add an option of "create index.ts file" to the menu.
### 1. Initialize the plug-in project
```bash
# 安装官方cli工具
npm install -g yo generator-code

# 生成项目脚手架
yo code
# 然后根据提示进行
```
### 2. Contents of extension.ts file
The entry file that is activated and run as the vscode plug-in. The activate function is called when the plug-in is installed, and the deactivate function is called when the plug-in is uninstalled.
When the activate function executes, you can register a command and the callback of the command, and a uri object is passed into the callback function:
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
What you need to do here is to scan the file name in the directory according to the folder path in the callback function, and then generate an index.ts file to write to that directory.
### 3. Index.ts file generation
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
### 4. Command to right-click menu
After the above code is completed, vscode cannot call up the command because it has not been configured yet. vscode panel commands (ctrl + shift + P) and commands in the right-click menu need to be configured in package. json:
Package.json only needs to care about contributes. For other items, please see the official documentation:
[Package.json file description](https://code.visualstudio.com/api/references/extension-manifest)
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
### 5. Debug plug-in
After all the above are completed, you can debug locally. Click the 4th debug on the leftmost side of vscode, and then click the run button, which will open a new vscode window and automatically install the written plug-in. You can drag a local project folder into it, and then you can happily debug.
### 6. Release your vscode extension
Package the plug-in and generate the vsix file:
```bash
# 安装vscode插件打包工具
npm i -g vsce

# 代码检查，这里最好用eslint格式化一下，避免发布时验证不通过
# 首选项 Eslint > Format: Enable 打勾。代码里右键格式化方式选用Eslint
yarn lint

# 打包生成vsix文件
vsce package
```
Then you will get the xxx-0.0.1.vsix file in the directory, and the. vsix file is the standard format for the vscode plug-in. In the vscode left sidebar extension, click more actions, there is a "install from VSIX", you can directly install local plug-ins.
Release plug-ins to the vscode plug-in market:
Sign up for an account and visit:
[Https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)
Register your account according to the prompts.
After registering, go to the personal center, click New Extension > Visual Studio Code, and then upload the vsix file you just packaged. After the upload is successful, it cannot be searched immediately, and you need to wait for verification. At this time, the version status is verify. After a few minutes, it becomes a check box to indicate that it has been successfully released to the market. Then search the extension for the displayName you set up in package.json and you can find your own plug-in.