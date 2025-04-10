### Install the deb package
```bash
dpkg -i xxx.deb
```
### Delete software package
```bash
dpkg -r xxx.deb
```
### Delete along with profile
```bash
dpkg -r --purge xxx.deb
```
### View package information
```bash
dpkg -info xxx.deb
```
### View file copy details
```bash
dpkg -L xxx.deb
```
### View information about installed packages on the system
```bash
dpkg -l
```
### Reconfigure software packages
```bash
dpkg-reconfigure xxx
```
### Clean up the system
```bash
sudo apt-get autoclean
sudo apt-get clean
```