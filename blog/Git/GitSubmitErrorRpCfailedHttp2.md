Git push submitted stutter and reported an error after timeout:
```sh
error: RPC failed; curl 92 HTTP/2 stream 0 was not closed cleanly: PROTOCOL_ERROR (err 1)
```
Target server does not support HTTP2, workaround, git execution
```sh
git config --global http.version HTTP/1.1
```
Then push again.