### 一、目标

1. 理解 vscode 插件机制，如何将插件行为和插件 ui 绑定？

2. 理解 iceworks 套件架构，插件之间如何互相调用？

### 二、期望收获结果

1. 学会编写 vscode 插件来扩展左侧菜单

2. 学会插件之间相互调用（大型插件拆分或微插件化）

### 三、分析过程

vscode 插件基于事件机制，事件和插件的绑定在 package.json 中，点击菜单或输入 command 命令都会发出一个事件，vscode 会查找已注册的命令并执行回调。

iceworks-app 属于 iceworks 套件中的功能入口，负责向 vscode 添加新菜单，并连接菜单和 iceworks 套件中其他插件。

#### 1. 左侧边栏添加 Iceworks 菜单按钮

基于 vscode 插件 contributes 配置表，相关项：contributes.viewsContainers, contributes.views, contributes.viewsWelcome

iceworks-app 配置文件（package.json）：

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

在 package.json 中声明以上字段，vscode 就会渲染出左侧菜单按钮、点击后打开的管理器及其子容器和内容。

#### 2. 多语言

注意到了 contributes.viewsWelcome 中的 content，是%xxx%的格式，这个是 vscode 插件多语言配置，在 package.json 同级目录会有 package.nls.json 和 package.nls.zh-CN.json，其中的字段可以使用%xxx$格式引用。

#### 3. 管理器内容渲染

注意到 contributes.viewsWelcome 中的 contents 字段是 markdown，在 package.nls.json 中定义，可以渲染简单的 button 和超链接。（貌似不支持复杂的界面，可以用 webview 方案代替）。

1. button 定义格式为：`[按钮文本](插件命令)`，示例：

```json
{
  "iceworksApp.viewsWelcome.welcome.contents": "[打开文件夹](command:vscode.openFolder)\n[创建应用](command:iceworks-project-creator.create-project.start)"
}
```

管理器中将会渲染 2 个 button，第一个点击后发出命令 vscode.openFolder（vscode 内置命令，打开文件夹），第二个点击发出 iceworks 项目创建命令

2. 超链接定义格式为：`[链接文本](链接地址)`，示例：

```json
{
  "iceworksApp.viewsWelcome.welcome.contents": "查看[文档](https://marketplace.visualstudio.com/items?itemName=iceworks-team.iceworks)"
}
```

管理器中将会渲染一个超链接，点击跳转对应地址。

#### 4. 本地存储能力(首选项)

vscode 插件可以将一些配置放到首选项设置中保存，例如 iceworks 将 npm 镜像源地址放在首选项设置中，可以保存设置到工作区或全局。

相关项：contributes.configuration

示例：

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

properties 中的字段会渲染到首选项设置中，或者是 setting.json 中。

代码中获取用户首选项设置：

```ts
vscode.workspace.getConfiguration('iceworks').get('packageManager')
```

#### 5. 插件之间互相调用

注意到上有个命令是 command:iceworks-project-creator.create-project.start，但是检查发现这个命令并没有 register 在 iceworks-app 中，而是注册在了 iceworks-project-creator 插件。由于 vscode 插件基于事件机制所以也很好理解，安装一个插件会在列表中注册自己的命令，其他插件可以发出注册在列表中的命令来调用其他插件。

也就是插件的 package.json 是用来向 vscode 命令表中注册可用命令，而插件代码中 register 是用来监听对应命令提供对应操作行为。
每个插件的命令应声明在 package.json 中 activationEvents 字段里。

![loading](https://saber2pr.top/MyWeb/resource/image/vscode-plugin.webp)

### 四、总结与验证

（这里写总结和相应 demo）

---

待更新...
