Transfer docker image occupancy from disk c to disk:
1. Exit docker and use the command to see if you want to quit
```bash
wsl --list -v
```
two。 Migrate Fil
```bash
wsl --export docker-desktop-data "D:\\docker-desktop-data.tar"
wsl --unregister docker-desktop-data
wsl --import docker-desktop-data "D:\\docker\\wsl" "D:\\docker-desktop-data.tar" --version 2
```