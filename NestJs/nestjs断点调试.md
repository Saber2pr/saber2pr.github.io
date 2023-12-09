```json
{
  // 使用 IntelliSense 了解相关属性。
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    // Node: Auto Attach and turn it on, VSCode will auto-attach when you run npm run dev:debug in the integrated terminal
    {
      "type": "node",
      "request": "attach",
      "name": "Automatic Attach NestJS WS",
      "port": 9229,
      "restart": true,
      "stopOnEntry": false,
      "protocol": "inspector",
      "skipFiles": [
        "<node_internals>/**",
        "${workspaceFolder}/node_modules/**/*.js"
      ]
    }
  ]
}
```

--debug参数执行：

```bash
nest start --watch --debug
```
