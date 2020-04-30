upstream 命名的是 fork 的目标远程仓库，

1. fork 一份（fork 一份作为自己的远程仓库:origin）后，clone 到本地，提交 commits，然后 push 到自己的 origin。

2. github 上`当前分支`会显示出 origin 与 upstream 之间的进度是否一致，如果一致就可以发起 pull request。

如果不一致，需要本地执行：

```bash
git push upstream master
```

即将 upstream 仓库的 master 分支拉取并覆盖到`当前分支`，如果出现冲突可以手动解决。

> 注意`当前分支`可以是任意的，不一定是 master。

3. 然后再次 push 到自己的 origin，重复第 2 步，直到一致。
