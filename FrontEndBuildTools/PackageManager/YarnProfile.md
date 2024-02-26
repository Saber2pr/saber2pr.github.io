The .yarnrc file can set additional parameters when executing the yarn command, such as executing the yarn install command in the ci process, but if a project requires ignore-optional, you can add new file contents under the project:
. / .yarnrc
```sh
--install.ignore-optional true
```
[Yarn document](https://classic.yarnpkg.com/en/docs/yarnrc#toc-cli-arguments)