> 本文主要为源码解析，代码较多。以熟悉 vscode api 为主。

### 一、目标

1. 理解 webview 界面机制，如何创建一个 webview 以及渲染内容？

2. 理解 vscode 与 webview 通信原理，webview 和 vscode 之间如何发送数据？

### 二、期望收获结果

1. 学会在插件中使用 webview 能力渲染复杂的 UI 界面

2. 能够实现 vscode 发送数据到 webview

### 三、分析过程

iceworks-project-creator 是 iceworks 套件之一，负责渲染一个模版选择界面。使用 vscode webview 能力渲染。

#### 1. 创建一个 webview 界面

```ts
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  const { extensionPath, subscriptions, globalState } = context
  let projectCreatorwebviewPanel: vscode.WebviewPanel | undefined

  // projectCreatorwebviewPanel是一个单例（饿汉）
  function activeProjectCreatorWebview() {
    if (projectCreatorwebviewPanel) {
      projectCreatorwebviewPanel.reveal()
    } else {
      projectCreatorwebviewPanel = window.createWebviewPanel(
        'iceworks', // webview的 id标识
        i18n.format(
          'extension.iceworksProjectCreator.createProject.webViewTitle'
        ), // 这里是webview的title标题，iceworks内部自己封装了一个i18n方法
        ViewColumn.One, // ViewColumn是一个Enum枚举，vscode的编辑器可以分割窗口，这里可以设置在哪个窗口打开
        {
          enableScripts: true, // webview中javascript enable。默认禁用脚本
          retainContextWhenHidden: true, // 保持上下文，webview实例常驻内存（保存webview内状态或keep-alive）
        }
      )
      // 设置webview渲染内容，getHtmlForWebview根据path渲染指定路由
      projectCreatorwebviewPanel.webview.html = getHtmlForWebview(
        extensionPath,
        'createproject',
        false
      )
      // webview窗口标题设置icon
      projectCreatorwebviewPanel.iconPath = vscode.Uri.parse(ICEWORKS_ICON_PATH)
      // webview窗口关闭时，销毁实例，释放内存
      projectCreatorwebviewPanel.onDidDispose(
        () => {
          projectCreatorwebviewPanel = undefined
        },
        null,
        context.subscriptions
      )
      // 这里做的是监听webview传来的消息
      connectService(projectCreatorwebviewPanel, context, {
        services,
        recorder,
      })
    }
  }

  // 注册到vscode命令表中
  subscriptions.push(
    registerCommand('iceworks-project-creator.create-project.start', () => {
      activeProjectCreatorWebview()
    })
  )
}
```

这里注意到了命令 iceworks-project-creator.create-project.start，在之前的 iceworks-app 实现原理简介中说到了管理器点击菜单会调用这个命令。

connectService 中监听 webview 传来的消息：

```ts
// 简化代码
export function connectService(
  webviewPanel: vscode.WebviewPanel,
  context: vscode.ExtensionContext,
  options: IConnectServiceOptions
) {
  // 监听webview传来的消息
  webview.onDidReceiveMessage(
    async (message: IMessage) => {
      // message就是webview中调用vscode postMessage发来的数据
    },
    undefined,
    subscriptions
  )
}
```

#### 2. webview 内容渲染

getHtmlForWebview 方法没什么亮点，主要就是生成一个 html，根据 path 加载对应路由的 js、css 资源。

```ts
export function getHtmlForWebview(
  extensionPath: string,
  entryName?: string,
  needVendor?: boolean,
  cdnBasePath?: string,
  extraHtml?: string,
  resourceProcess?: (url: string) => vscode.Uri
): string

// getHtmlForWebview = (path) => `<html> script、link等加载cdn资源 </html>`
```

值得一题的是，这里加载的 js 是用 react 写的一个单页应用，然后放到了 cdn 上来加载渲染。

#### 3. webview 和 vscode 通信

在 react 单页应用中会调用@iceworks/vscode-webview 包中的一个 callService 方法，就是获取 vscode api，然后 postMessage：

```ts
// 下面的代码在浏览器环境中！！（vscode webview环境中）
export const vscode =
  typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null

export const callService = function (service: string, method: string, ...args) {
  return new Promise((resolve, reject) => {
    const eventId = setTimeout(() => {})
    const handler = event => {
      const message = event.data
      if (message.eventId === eventId) {
        window.removeEventListener('message', handler)
        message.errorMessage
          ? reject(new Error(message.errorMessage))
          : resolve(message.result)
      }
    }
    // 监听vscode传来的消息
    window.addEventListener('message', handler)
    // 向vscode发送消息
    vscode.postMessage({
      service,
      method,
      eventId,
      args,
    })
  })
}
```

其实和浏览器中的 iframe 一样。

### 四、总结与验证

#### vscode 与 webview 之间通信

1. vscode 中，使用 webview.onDidReceiveMessage 接收从 webview 发来的数据，使用 webview.postMessage 向 webview 发送数据。

2. webview 中，使用 window.addEventListener('message', () => {})接收 vscode 发来的消息，使用 vscode.postMessage 向 vscode 发送消息。

#### demo 验证

```ts
import * as vscode from 'vscode'

export function activate(context: vscode.ExtensionContext) {
  let webviewPanel: vscode.WebviewPanel | undefined

  function activeProjectCreatorWebview() {
    if (webviewPanel) {
      webviewPanel.reveal()
    } else {
      webviewPanel = vscode.window.createWebviewPanel(
        'testPanel',
        'Test',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
        }
      )

      webviewPanel.webview.html = `
			<div id="root">hello webview!</div>
			<script>
				const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : null
				const root = document.getElementById('root')
				window.sendMessage = () => {
					// 向vscode发送消息
					vscode.postMessage({
						text: 'from webview!!'
					})
				}
				// 监听从vscode发来的消息
				window.addEventListener('message', event => {
					root.innerText += ('\\n' + event.data.text)
				})
			</script>
			<button onclick="sendMessage()">send message</button>
			`

      // 监听从webview发来的消息
      webviewPanel.webview.onDidReceiveMessage(
        message => {
          // 这里在vscode环境可以调用native能力
          vscode.window.showInformationMessage(message['text'])
          // 也可以直接把webview发来的消息返回去
          webviewPanel.webview.postMessage({
            text: `from vscode: ${message['text']}`,
          })
        },
        null,
        context.subscriptions
      )

      webviewPanel.iconPath = vscode.Uri.parse(
        'https://static1.testcn.com/static/ty-lib/favicon.ico'
      )

      webviewPanel.onDidDispose(
        () => {
          webviewPanel = undefined
        },
        null,
        context.subscriptions
      )
    }
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('test-panel-manager.showList', () => {
      activeProjectCreatorWebview()
    })
  )
}

export function deactivate() {}
```

package.json

> 相关字段解释在【iceworks-app 实现原理简介】说明

```json
{
  "activationEvents": ["onCommand:test-panel-manager.showList"],
  "contributes": {
    "commands": [
      {
        "command": "test-panel-manager.showList",
        "title": "打开发布单列表"
      }
    ],
    "viewsContainers": {
      "activitybar": [
        {
          "id": "testPanel",
          "title": "test Panel Manager",
          "icon": "assets/sidebar-logo.png"
        }
      ]
    },
    "views": {
      "testPanel": [
        {
          "id": "welcome",
          "name": "Welcome"
        }
      ]
    },
    "viewsWelcome": [
      {
        "view": "welcome",
        "contents": "[发布单列表](command:test-panel-manager.showList)"
      }
    ]
  }
}
```

附录：

1. vscode-webview 通信机制

![loading](https://saber2pr.top/MyWeb/resource/image/vscode-plugin.webp)
