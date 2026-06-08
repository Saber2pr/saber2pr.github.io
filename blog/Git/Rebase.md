> tually, I have used it several times before. But I didn't record it properly. Now precipitate it.
Large-scale multi-person project development requires cutting the feature/xxx branch to add their own content. You will have some of your own commit in this branch. However, when merging feature branches, the master branch is only concerned with the final result of the branch, so it is best to merge all the commit on the feature branch into one commit to reduce useless information.
Git rebase is used to merge multiple commit into one commit!
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
Vscode plug-in recommendation: Git Graph
In the plug-in interface, under the current feature branch, you can directly select the commit where the master branch is located, right-click rebase and check the first option (do not click to reset), and then enter vi. The subsequent operations are the same as above.
Daily recommendation directly git rebase-I master.
> if you want to undo rebase, execute git reflog to find the commitid before rebase, and then git reset-- hard commitid