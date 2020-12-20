upstream 命名的是 fork 的目标远程仓库，

1. fork 一份（fork 一份作为自己的远程仓库:origin）后，clone 到本地，提交 commits，然后 push 到自己的 origin。

2. github 上`当前分支`会显示出 origin 与 upstream 之间的进度是否一致，如果一致或超前就可以发起 pull request。

否则，需要本地执行：

```bash
git pull upstream master
```

即将 upstream 仓库的 master 分支拉取并覆盖到`当前分支`，如果出现冲突可以手动解决。

> 注意`当前分支`可以是任意的，不一定是 master。

3. 然后再次 push 到自己的 origin，重复第 2 步，直到一致。

---

还有一种方法，直接将 upstream 的 master 分支设置为当前分支的上游

```bash
git branch --set-upstream-to=upstream/master master
```

这样当 upstream/master 有更新时，可以直接 pull 下来到当前分支。

但推送的时候，需要显式指定远程 ref，即

```bash
git push origin master
```

将当前分支推送到 origin/master 分支。

这时如果省略`origin master`单独执行`git push`就会向 upstream 推送，但这是不可能的。
