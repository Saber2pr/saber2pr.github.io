Checkout is one of the most important commands git uses.
### switch branches
```bash
git checkout <branch-name>
```
Switch to a new branch
```bash
git checkout -b <branch-name>
```
Create a new branch from the specified commit
```bash
git checkout -b <branch-name> <commit-id>
```

### File fallback
> git log gets hash submission history
```bash
git checkout <hash> <file>
```
> scard all uncommitted changes git checkout.