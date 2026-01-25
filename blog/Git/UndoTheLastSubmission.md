Execute:
```bash
git reset HEAD~
```
The last commit returns to the staging area and executes:
```bash
git checkout .
```
All changes in the file will be undone.
After executing the above two commands, the local repository will be exactly the same as the remote repository (if it has not been modified).
---
If you want to undo previous submissions, such as the first two, you can:
```bash
git reset HEAD~2
```