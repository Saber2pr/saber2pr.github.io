### 安装 deb 软件包

```bash
dpkg -i xxx.deb
```

### 删除软件包

```bash
dpkg -r xxx.deb
```

### 连同配置文件一起删除

```bash
dpkg -r --purge xxx.deb
```

### 查看软件包信息

```bash
dpkg -info xxx.deb
```

### 查看文件拷贝详情

```bash
dpkg -L xxx.deb
```

### 查看系统中已安装软件包信息

```bash
dpkg -l
```

### 重新配置软件包

```bash
dpkg-reconfigure xxx
```

### 清理系统

```bash
sudo apt-get autoclean
sudo apt-get clean
```
