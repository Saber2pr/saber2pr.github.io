### 一、目标

1. 理解vscode插件机制，如何将插件行为和插件ui绑定？

2. 理解iceworks套件架构，插件之间如何互相调用？

### 二、期望收获结果

1. 学会编写vscode插件来扩展左侧菜单

2. 学会插件之间相互调用（大型插件拆分或微插件化）

### 三、分析过程

vscode插件基于事件机制，事件和插件的绑定在package.json中，点击菜单或输入command命令都会发出一个事件，vscode会查找已注册的命令并执行回调。

iceworks-app属于iceworks套件中的功能入口，负责向vscode添加新菜单，并连接菜单和iceworks套件中其他插件。

##### 1. 左侧边栏添加Iceworks菜单按钮

基于vscode插件contributes配置表，相关项：contributes.viewsContainers, contributes.views, contributes.viewsWelcome

iceworks-app配置文件（package.json）：

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
          "name": "Welcome",
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
    ],
  }
}
```

在package.json中声明以上字段，vscode就会渲染出左侧菜单按钮、点击后打开的管理器及其子容器和内容。

##### 多语言

注意到了contributes.viewsWelcome中的content，是%xxx%的格式，这个是vscode插件多语言配置，在package.json同级目录会有package.nls.json和package.nls.zh-CN.json，其中的字段可以使用%xxx$格式引用。

##### 管理器内容渲染

注意到contributes.viewsWelcome中的contents字段是markdown，在package.nls.json中定义，可以渲染简单的button和超链接。（貌似不支持复杂的界面，可以用webview方案代替）。

1. button定义格式为：[按钮文本](插件命令)，示例：

```json
{
  "iceworksApp.viewsWelcome.welcome.contents": "[打开文件夹](command:vscode.openFolder)",
}
```

管理器中将会渲染一个button，点击后发出命令vscode.openFolder（vscode内置命令，打开文件夹）。

2. 超链接定义格式为：[链接文本](链接地址)，示例：

```json
{
  "iceworksApp.viewsWelcome.welcome.contents": "查看[文档](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)",
}
```

管理器中将会渲染一个超链接，点击跳转对应地址。

##### 本地存储能力(首选项)

vscode插件可以将一些配置放到首选项设置中保存，例如iceworks将npm镜像源地址放在首选项设置中，可以保存设置到工作区或全局。

相关项：contributes.configuration

示例：

```json
{
  "contributes": {
    "title": "Iceworks Application Viewer",
    "properties": {
      "iceworks.packageManager": {
        "type": "string",
        "default": "npm",
        "enum": [
          "npm",
          "cnpm",
          "tnpm",
          "yarn"
        ],
        "description": "%iceworksApp.configuration.properties.iceworks.packageManager.description%"
      },
    }
  }
}
```

---

待更新

### 四、总结与验证

（这里写总结和相应demo）

---

待更新