In the past, I used to ask OPS to help add ssh, so I think it's better to sum it up myself:
Log in to the server:
> you can either ssh root@ip directly or use xshell
```bash
cd /root

mkdir .ssh

cd .ssh

vim authorized_keys
```
Then copy the public key / user/.ssh/id_rsa.pub text into it and save it.
> if you want to add multiple ssh, you can simply wrap the line and append it.
### Xshell
Xshell is an enhanced version of the terminal that saves sessions and authenticates logins using the ssh private key with the public key added to the server.
### Other
1. Install / uninstall v2ray Agent
```bash
bash <(curl -s -L https://git.io/v2ray.sh)
```