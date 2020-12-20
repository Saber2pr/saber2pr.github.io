### tty

ubuntu 有 7 个 tty，tty1-6 是全屏命令行，tty7 是图形界面，正常情况系统默认优先启动 tty7 图形界面。

> 笔记本要注意键盘上是否有"Fn"键

### 图形界面：

```bash
ctrl + alt + f7
```

或者

```bash
ctrl + Fn + alt + f7
```

### 进入 tty：

```bash
ctrl + alt + f1
```

或者

```bash
ctrl + Fn + alt + f1
```

> f1 ~ f7 类似，Ctrl + Fn + Alt + F1~F7

> 本质就是 7 个窗口之间的切换，最后一个窗口 7 就是图形界面。

### 杀掉 tty 进程

进入 tty 后，查询 tty7 的 pid 号码：

```bash
ps -t tty7
# 会得到tty7的pid号码<pid>
```

然后执行

```bash
sudo kill <pid>
```
