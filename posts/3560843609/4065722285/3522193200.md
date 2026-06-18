There is no default limit on the memory allocated by docker using wsl, so it is easy to fill up memory.
Exit dockers, edit the configuration file ~ / .wslconfig, and fill in the following:
```txt
[wsl2]
memory=8GB
swap=0
localhostForwarding=true
```
Restart docker
> Note that the memory setting is too small and docker may not be able to start.