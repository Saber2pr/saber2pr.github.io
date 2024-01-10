git push 提交卡顿，超时后报错：

```sh
error: RPC failed; curl 92 HTTP/2 stream 0 was not closed cleanly: PROTOCOL_ERROR (err 1)
```

目标服务器不支持HTTP2，解决办法, git执行

```sh
git config --global http.version HTTP/1.1
```

然后重新 push 推送即可。