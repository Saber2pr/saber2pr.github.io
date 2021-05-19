### 简介

.DS_Store (英文全称 Desktop Services Store)[1] 是一种由苹果公司的Mac OS X操作系统所创造的隐藏文件，目的在于存贮目录的自定义属性，例如文件们的图标位置或者是背景色的选择。[2]该文件由Finder创建并维护，类似于Microsoft Windows中的desktop.ini文件。

### 禁用DS_Store

```bash
defaults write com.apple.desktopservices DSDontWriteNetworkStores -bool TRUE
```

### 恢复DS_Store

```bash
defaults delete com.apple.desktopservices DSDontWriteNetworkStores
```

### 删除目录下所有DS_Store

```bash
sudo find / -name ".DS_Store" -depth -exec rm {} \;
```