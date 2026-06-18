> this article is mainly about source code parsing, with a lot of code. Mainly familiar with vscode api.
### I. objectives
1. Understand the mechanism of the webview interface, how to create a webview and render content?
two。 Understand the principle of communication between vscode and webview, and how to send data between webview and vscode?
### 2. Expected harvest results
1. Learn to use webview capabilities in plug-ins to render complex UI interfaces
two。 Be able to send data to webview by vscode
### III. Analysis process
Iceworks-project-creator is one of the iceworks suites that renders a template selection interface. Use vscode webview capabilities to render.
#### 1. Create a webview interface
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
Notice the command iceworks-project-creator.create-project.start here, which was mentioned in the previous introduction to iceworks-app implementation that the manager clicks on the menu to invoke this command.
Listen to the message from webview in connectService:
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
#### 2. Webview content rendering
There is no bright spot in the getHtmlForWebview method, which mainly generates a html and loads the js and css resources of the corresponding route according to the path.
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
It is worth mentioning that the js loaded here is a single-page application written in react, and then put on cdn to load the rendering.
#### 3. Webview and vscode communication
In the react single-page application, a callService method in the @ iceworks/vscode-webview package is called to get vscode api, and then postMessage:
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
It's actually the same as the iframe in the browser.
### IV. Summary and verification
#### Communication between vscode and webview
1. In vscode, use webview.onDidReceiveMessage to receive data sent from webview, and use webview.postMessage to send data to webview.
2. In webview, use window.addEventListener ('message', () = > {}) to receive messages from vscode and use vscode.postMessage to send messages to vscode.
#### Demo verification
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
Package.json
> related fields are explained in [introduction to the principle of iceworks-app implementation]
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
Appendix:
1. Vscode-webview communication mechanism
![loading](https://saber2pr.top/MyWeb/resource/image/vscode-plugin.webp)