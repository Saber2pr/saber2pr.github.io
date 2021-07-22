### how to build my own pages

1. fork this repo into your repos.

2. edit ./app.json, replace `userId` and `repo`, for example:

```json
{
  "title": "Hello My WebSite",
  "userId": "username",
  "repo": "username.github.io"
}
```

> username should be your github username

3. click `Settings`, replace repoName from 'saber2pr.github.io' to 'username.github.io' and enable github pages on master branch

4. click `Actions` and enable `github workflow`

5. select `Github Pages` and click `Run workflow` on master branch

6. after workflow done, visit `https://username.github.io`
