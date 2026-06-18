## API interface
```http
https://api.github.com
```
> ging query parameters page and per_page
### 1. Search for items
```http
/search/repositories
```
Parameters:
(1) Q: name of the warehouse to be searched
### two。 Read user activity
```http
/users/:userId/events
```
### 3. Read the list of user warehouses
```http
/users/:userId/repos
```
### 4. Read the list of user followers
Follower
```http
/users/:userId/followers
```
Follow
```http
/users/:userId/following
```
### 5. Read user Star list
```http
/users/:userId/starred
```
### 6. Read a file or folder
```http
/repos/:userId/:repo/contents/:path
```
Such as:
```http
GET https://api.github.com/repos/saber2pr/saber2pr.github.io/contents/blog
```
### 7. Create a new file
```http
PUT /repos/:userId/:repo/contents/:path
```
Send body format:
```ts
type Commit = {
  message: string
  content: string
  sha?: string
}
```
The content field requires base64 transcoding. Commit needs to be serialized by JSON and sent as body.
> sha in commit can be omitted. If you update an existing file, the sha field is required.
> Note: body, not parameter
### 8. Delete a file
```http
DELETE /repos/:userId/:repo/contents/:path
```
Body transmission is also required. Format:
```ts
type Commit = {
  message: string
  sha: string
}
```
The sha field is required.
### 9. Read file submission
```http
/repos/:userId/:repo/commits?path=:path
```
Such as:
```http
GET https://api.github.com/repos/saber2pr/saber2pr.github.io/commits?path=/blog
```
> submission time can be obtained through commit.committer.date
### 10. Read warehouse language type
```http
/repos/:userId/:repo/languages
```
> the corresponding number of bytes for different languages in the returned value
### 11. Recursively get directory tree
```ts
export const getContentTree = async (
  repo,
  root = { path: "", type: "dir" }
) => {
  if (root.type === "dir") {
    const children = await request(
      `https://api.github.com/repos/${username}/${repo}/contents/${root.path}`
    )
    root.children = await Promise.all(
      children.map(node => getContentTree(repo, node))
    )
  }
  return root
}
```