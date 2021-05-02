> 其实以前用过几次。但没好好记录一下，现在沉淀一下

大型多人参与的项目开发都要求切 feature/xxx 分支来添加自己的内容。在这个分支会有一些自己的 commit。但是在合并 feature 分支的时候，其实对 master 分支来说只关心分支最后的结果，所以最好可以将 feature 分支上的所有 commit 合并为一个 commit，减少无用信息。

git rebase 就是用来合并多次 commit 为一个 commit 的！

```bash
git rebase -i HEAD~2 # 处理近两次提交
# 或 git rebase -i start-commit end-commit （start-commit可以直接复制master的commitid， end-commit就是当前分支最新commitid）
# 通常都是rebase到master上，所以可以直接 git rebase -i master

# 然后进入vi，保留第一个pick，后面的都改成s。后面s的commit会被合并到第一个上面，wq保存退出
# 例如
# pick 75b4076 haha
# pick 75b4076 haha1
# pick 75b4076 haha2
# 改成
# pick 75b4076 haha
# s 75b4076 haha1
# s 75b4076 haha2

# 不出意外的话又会有一个vi，然后修改第一个commit信息作为最终合并后的commit，wq保存退出
```

vscode 插件推荐：Git Graph

在插件界面，在当前 feature 分支下，可以直接选择 master 分支所在的 commit，右键 rebase 并勾选第一个选项（别点到 reset 哦），然后进入 vi，后续操作同上。

日常推荐直接 git rebase -i master.

> 如果想撤销 rebase，先执行 git reflog 找到 rebase 前的 commitid，然后 git reset --hard commitid
