如果不是fork流，那就是几个人共用一个local repository。

然后不同的人在不同的branch上commit，最后合并到master分支。
出现冲突使用merge或者rebase。

merge即字面意思合并，rebase就是重置初始提交。merge会保留被merge branch上的commits，而rebase不会。rebase就是将commits取消掉然后合并成一个commit。

### rebase

例如

```bash
git rebase master
```

这行命令会将当前分支的commits取消掉变成patches，然后更新为master分支，最后再把patches应用过来，生成一个commit。

### cherry-pick

复制指定commit到当前branch

```bash
git cherry-pick <hash>

git cherry-pick <hash1>..<hash2>
```

