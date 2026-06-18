Get the latest commit of the branch:
```sh
git rev-parse master

# 获取上一次commit
git rev-parse master^
```
Get file changes:
```sh
# git diff commit1 commit2
git diff $(git rev-parse master) $(git rev-parse master^)

# 指定文件
git diff $(git rev-parse master) $(git rev-parse master^) src/index.ts
```