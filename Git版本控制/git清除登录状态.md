1. git 退出登录

```bash
git config --system --unset credential.helper
git config --unset-all credential.helper
git config --global --unset-all credential.helper
git config --system --unset-all credential.helper
```

2. git 取消 https 验证

```bash
git config --global http.sslVerify "false"
```
