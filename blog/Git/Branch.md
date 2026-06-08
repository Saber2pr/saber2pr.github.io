If it is not a fork stream, then several people share a local repository.
Then different people commit on different branch and finally merge into the master branch.
Use merge or rebase when there is a conflict.
Merge literally means merge, and rebase literally resets the initial commit. Merge retains the commits on the merge branch, while rebase does not. To rebase is to cancel commits and merge them into one commit.
### Rebase
For example
```bash
git rebase master
```
This command cancels the commits of the current branch to patches, then updates it to the master branch, and finally applies the patches to generate a commit.
### Cherry-pick
Copy the specified commit to the current branch
```bash
git cherry-pick <hash>

git cherry-pick <hash1>..<hash2>
```