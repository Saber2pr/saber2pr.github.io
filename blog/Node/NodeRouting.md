Routes are mainly distinguished according to IncomingMessage.url
For example, GET and POST requests to handle / user routes:
```ts
createServer((req, res) => {
  if (req.method === "GET") {
    if (req.url.startsWith("/user")) {
      res.end("get ok.")
    }
  } else if (req.method === "POST") {
    if (req.url.startsWith("/user")) {
      res.end("post ok.")
    }
  } else {
    res.end("404")
  }
})
```
Call res.end () to end the HTTP session.
Branches are more complex, so it would be better to use some libraries.