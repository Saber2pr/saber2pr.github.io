A project's version library becomes large after a long period of maintenance, and it takes a long time to download if you want to clone it.
Fortunately, the git clone command provides additional options: [--depth]
For example:
```bash
git clone xxx --depth=1
```
Indicates that only the contents of the last commit are cloned.