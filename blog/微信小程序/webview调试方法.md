小程序中使用 storage 保存的信息可以通过删除小程序来清空，也可以打开小程序自带的调试模式来开启控制台清除。但是 webview 里 localStorage 保存的信息是无法清除的！

这时候就需要利用 H5 虚拟控制台调试了，我用的是：
[Eruda](https://github.com/liriliri/eruda)

我对它进行了封装，增加了一个 url 参数来开启和关闭调试：

[debug.min.js](https://github.com/Saber2pr/test/blob/master/tools/debug.min.js)

将它添加到项目中，访问项目时，url 参数加上 debug=true 就可以启用调试！

### 在 webview 中使用

webview 中不能直接放个按钮来做调试开关，但可以利用页面上已有的 input，例如 input 中输入特定的字符串后执行:

```js
location.href = '/?debug=true'
```

来间接开启调试！
