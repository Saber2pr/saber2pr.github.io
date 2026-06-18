### I. objectives
1. Understand the vscode plug-in mechanism and how to bind plug-in behavior to plug-in ui?
two。 Understand the iceworks suite architecture and how do plug-ins call each other?
### 2. Expected harvest results
1. Learn to write vscode plug-ins to extend the left menu
two。 Learn to call each other between plug-ins (large plug-ins split or micro-plug-in)
### III. Analysis process
The vscode plug-in is based on the event mechanism. Events and plug-ins are bound in package.json. Clicking on the menu or entering the command command will issue an event, and vscode will find the registered command and execute a callback.
Iceworks-app is a feature entry in the iceworks suite, which is responsible for adding new menus to vscode and connecting menus to other plug-ins in the iceworks suite.
#### 1. Add Iceworks menu button to left sidebar
Contributes configuration table based on vscode plug-in, related items: contributes.viewsContainers, contributes.views, contributes.viewsWelcome
iceworks-app configuration file (package.json):
```json
{
  "contributes": {
    "viewsContainers": {
      // vscode左侧边栏按钮列表
      "activitybar": [
        {
          // 菜单标识，在下面contributes.views中要用
          "id": "iceworksApp",
          // 菜单按钮hover时的title，以及管理器顶部title
          "title": "Iceworks",
          // 菜单按钮图片
          "icon": "assets/sidebar-logo.png"
        }
      ]
    },
    // 按钮点击后，在管理器中的子容器
    "views": {
      // 管理器中两个区块
      "iceworksApp": [
        {
          // 区块标识，在下面contributes.viewsWelcome要用
          "id": "welcome",
          "name": "Welcome"
        },
        {
          "id": "quickEntries",
          "name": "%iceworksApp.view.quickEntries.name%"
        }
      ]
    },
    // 子容器内容
    "viewsWelcome": [
      {
        "view": "welcome",
        // 子容器内容，是markdown格式！会被渲染为html
        "contents": "%iceworksApp.viewsWelcome.welcome.contents%"
      },
      {
        "view": "quickEntries",
        "contents": "%iceworksApp.viewsWelcome.quickEntries.contents%"
      }
    ]
  }
}
```
Declare the above fields in package.json, and vscode will render the menu button on the left, the manager that opens after clicking, and its sub-containers and contents.
#### two。 Multilingual
Notice that content in contributes.viewsWelcome is in% xxx% format, which is the multilingual configuration of the vscode plug-in. There will be package.nls.json and package.nls.zh-CN.json in the package.json sibling directory, and the fields can be referenced in% xxx$ format.
#### 3. Manager content rendering
Notice that the contents field in contributes.viewsWelcome is markdown, defined in package.nls.json, and can render simple button and hyperlinks. (it doesn't seem to support complex interfaces, so you can use webview instead).
1. button definition format: `[button text](plug-in command)`, example:
```json
{
  "iceworksApp.viewsWelcome.welcome.contents": "[打开文件夹](command:vscode.openFolder)\n[创建应用](command:iceworks-project-creator.create-project.start)"
}
```
Two button will be rendered in the manager. The first click will issue the command vscode.openFolder (vscode built-in command to open the folder), and the second click will issue the iceworks project creation command.
two。 The definition format of hyperlink is: `[link text] (link address)`, for example:
```json
{
  "iceworksApp.viewsWelcome.welcome.contents": "查看[文档](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)"
}
```
A hyperlink will be rendered in the manager and click to jump to the corresponding address.
#### 4. Local storage capacity (preference)
The vscode plug-in can save some configurations in the preference settings, such as iceworks putting the npm mirror source address in the preference settings, and saving the settings to the workspace or global.
Related item: contributes.configuration
Example:
```json
{
  "contributes": {
    "configuration": {
      "title": "Iceworks Application Viewer",
      "properties": {
        // 在首选项中的名称
        "iceworks.packageManager": {
          "type": "string",
          // 默认值
          "default": "npm",
          // 枚举类型，会渲染一个下拉框
          "enum": [
            "npm",
            "cnpm",
            "tnpm",
            "yarn"
          ],
          // 配置的描述
          "description": "%iceworksApp.configuration.properties.iceworks.packageManager.description%"
        }
      }
    }
  }
}
```
Fields in properties are rendered into preferences settings or setting.json.
Get the user preference settings in the code:
```ts
vscode.workspace.getConfiguration('iceworks').get('packageManager')
```
#### 5. Plug-ins call each other
Notice that there is a command called command:iceworks-project-creator.create-project.start, but the check shows that this command is not register in iceworks-app, but is registered in the iceworks-project-creator plug-in. Because the vscode plug-in is based on the event mechanism, it is also understandable that installing a plug-in registers its own commands in the list, and other plug-ins can issue commands registered in the list to invoke other plug-ins.
That is, the package.json of the plug-in is used to register available commands with the vscode command table, while the register in the plug-in code is used to listen for the corresponding commands to provide corresponding actions.
The commands for each plug-in should be declared in the activationEvents field in package.json.
![loading](https://saber2pr.top/MyWeb/resource/image/vscode-plugin.webp)
### IV. Summary and verification
(write a summary and corresponding demo here)
---
To be updated.