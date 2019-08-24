1. github即remote repository，是local repository的一个远程镜像。
2. 本地git提交后，local repository会超前于remote repository，需要执行git push更新远程仓库。
3. 如果是多人开发，远程仓库很有可能超前于本地分支，导致无法push本地到远程。需要先执行git pull，将远程的新内容更新到本地，再push。
> 如果有冲突需要取舍。

4. github上的贡献方式一般为 fork -> clone -> commit -> test -> push -> open pull request.

> 一般的就这样可以了。
