Body is used to transmit long bytes and needs to be received in fragments.
1. Listen for IncomingMessage data events and collect body fragments.
two。 Listen for IncomingMessage end events and receive them.
```ts
const getBody = (req: IncomingMessage) =>
  new Promise<string>((resolve, reject) => {
    const data = []
    req.on("data", chunk => data.push(chunk))
    req.on("end", () => resolve(data.join("")))
    req.on("error", err => reject(err))
  })
```