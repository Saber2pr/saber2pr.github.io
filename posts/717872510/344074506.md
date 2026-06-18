### Brief introduction
DS _ Store (English full name Desktop Services Store) [1] is a hidden file created by Apple's Mac OS X operating system to store custom properties of directories, such as the location of files' icons or the choice of background colors. [2] this file is created and maintained by Finder, similar to the desktop.ini file in Microsoft Windows.
### Disable DS_Store
```bash
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool TRUE
```
### Restore DS_Store
```bash
defaults delete com.apple.desktopservices DSDontWriteNetworkStores
```
### Delete all DS_Store in the directory
```bash
sudo find / -name ".DS_Store" -depth -exec rm {} \;
```