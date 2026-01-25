Set the workspace user name:
```ts
git config user.name "username"
git config user.email "useremail@qq.com"
```
Set the global default user name:
```ts
git config --global user.name "username"
git config --global user.email "useremail@qq.com"
```
---
Workspace user name takes precedence over global user name
View the current project user name:
```ts
git config user.name
git config user.email
```