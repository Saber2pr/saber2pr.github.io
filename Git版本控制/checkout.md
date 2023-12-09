checkout是git最常用最重要的命令之一。

### 切换分支

```bash
git checkout <branch-name>
```

切换到一个新分支

```bash
git checkout -b <branch-name>
```

从指定commit创建新分支

```bash
git checkout -b <branch-name> <commit-id>
```
  
### 文件回退

> git log得到hash提交历史

```bash
git checkout <hash> <file>
```

> 放弃未提交的所有修改 git checkout .
