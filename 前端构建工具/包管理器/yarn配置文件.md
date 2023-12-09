.yarnrc文件可以设置在执行yarn命令时的附加参数，例如在ci流程中执行yarn install命令，但某个项目需要ignore-optional，则可以项目下新增文件内容：

./.yarnrc
```sh
--install.ignore-optional true
```

[yarn文档](https://classic.yarnpkg.com/en/docs/yarnrc#toc-cli-arguments)
