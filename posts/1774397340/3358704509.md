1. Log in with git
```bash
git config --system --unset credential.helper
git config --unset-all credential.helper
git config --global --unset-all credential.helper
git config --system --unset-all credential.helper
```
2. Git cancels https verification
```bash
git config --global http.sslVerify "false"
```