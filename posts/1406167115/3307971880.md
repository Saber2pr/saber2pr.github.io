Only port 80 is available on many CVMs, and other ports are disabled. You can open it by command:
Example: Open 25 ports
```sh
sudo ufw allow 25/tcp
```