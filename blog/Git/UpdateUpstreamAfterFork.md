Upstream names the target remote repository of fork
1. After fork (fork as your remote repository: origin), clone to the local, submit commits, and then push to your own origin.
2. The `current branch'on github shows whether the progress between origin and upstream is consistent. If it is consistent or ahead of time, you can launch pull request.
Otherwise, local execution is required:
```bash
git pull upstream master
```
Pull and overwrite the master branch of the upstream warehouse to the `current branch`. If there is a conflict, you can resolve it manually.
> Note: `current branch `can be arbitrary, not necessarily master.
3. Then push to your own origin again and repeat step 2 until consistent.
---
There is also a way to directly set the master branch of upstream to the upstream of the current branch
```bash
git branch --set-upstream-to=upstream/master master
```
In this way, when there are updates to the upstream/master, you can directly pull down to the current branch.
However, when pushing, you need to explicitly specify the remote ref, that is,
```bash
git push origin master
```
Push the current branch to the origin/master branch.
At this time, if you omit `git Master` and execute `git push` alone, it will be pushed to upstream, but this is impossible.