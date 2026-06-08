### tty
Ubuntu has seven tty,tty1-6 full-screen command lines and tty7 is a graphical interface. Normally, the system gives priority to starting the tty7 graphical interface by default.
> Note whether there is a "Fn" key on the keyboard
### Graphical interface:
```bash
ctrl + alt + f7
```
Or
```bash
ctrl + Fn + alt + f7
```
### Enter tty:
```bash
ctrl + alt + f1
```
Or
```bash
ctrl + Fn + alt + f1
```
> F1 ~ f7 is similar, Ctrl + Fn + Alt + F1~F7
> The essence is to switch between 7 windows, and the last window 7 is the graphical interface.
### Kill the tty process
After entering tty, query the pid number of tty7:
```bash
ps -t tty7
# 会得到tty7的pid号码<pid>
```
And then execute
```bash
sudo kill <pid>
```