### Register for OAuth App
Select OAuth for authentication.
Open Github-> Settings-> Developer settings-> OAuth Apps-> New OAuth App to register an app.
One thing to note is the Authorization callback URL item:
When the / authorize interface is accessed to get the access code, the access code is spelled after the callback in the form of a url parameter (for example: 'https://saber2pr.top/?code=xxxx') and the page is redirected to the url.
> when accessing the / authorize API to obtain code, you must take the scope=public_repo parameter! You can't just bring client_id!
> in the js script of the page, parse code from location.href, and then use code to get access_token.
If custom domain is used, cross-domain issues may be involved in obtaining access_token, so you can try the cors-anywhere solution.
### Issue Api
Prepare a repo and open an issue in repo. Each issue has a serial number, and the first issue serial number is 1.
The comment api corresponding to issue is `https://api.github.com/repos/${username}/${repo}/issues/${issue_id}/comments`.
Visit this api and you will get the corresponding comments of the issue.
> you can use a timestamp timestamp if necessary to prevent api from being cached and cannot be updated.
GET (get comments):
Get the first issue comment in the saber2pr/rc-gitment repository
```ts
fetch(
  `https://api.github.com/repos/saber2pr/rc-gitment/issues/1/comments?timestamp=${Date.now()}`,
  {
    headers: {
      Authorization: `token ${accessToken}`
    }
  }
).then(res => res.json())
```
POST(Send Comment):
Add a comment under the first issue in the saber2pr/rc-gitment repository that reads test from api. Exe.
> Note the body format, {body: string}
```ts
fetch(
  `https://api.github.com/repos/saber2pr/rc-gitment/issues/1/comments?timestamp=${Date.now()}`,
  {
    method: "POST",
    body: JSON.stringify({
      body: "test from api."
    }),
    headers: {
      Authorization: `token ${accessToken}`
    }
  }
)
```
DELETE (Delete comments):
The delete address is the comment corresponding to commentToDeleteUrl. This address is available in the result of the GET request, and each comment has a corresponding address.
```ts
fetch(commentToDeleteUrl, {
  method: "DELETE",
  headers: {
    Authorization: `token ${accessToken}`
  }
})
```