```js
/**
 * @param {string} url
 * @param {string} method
 * @param {object} params
 * @returns
 */
function request(url, method = "GET", params = null) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.addEventListener("readystatechange", () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText)
        } else {
          reject({
            code: xhr.status,
            response: xhr.response
          })
        }
      }
    })
    setTimeout(() => reject("timeout:1000"), 1000)
    xhr.send(JSON.stringify(params))
  })
}

request("http://localhost:3005/user/?name=saber&age=21").then(console.log)
request("http://localhost:3005/user/", "POST", {
  name: "saber",
  age: 233
}).then(console.log)

request("http://localhost:30051/user/?name=saber&age=21").then(console.log)
request("http://localhost:30051/user/", "POST", {
  name: "saber",
  age: 233
}).then(console.log)
```
# Onreadystatechange
This function is called whenever the readyState property changes
### ReadyState
0. The request is not initialized
1. Server connection established
two。 Request received
3. Request processing
4. The request has been completed and the response is ready
### Status http status code
1xx: request is being processed
2xx: request processing completed
3xx: redirect
4xx: Browser (client) error
5xx: server internal error