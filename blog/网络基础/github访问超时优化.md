### 1. 查询github.com的ip

[https://github.com.ipaddress.com/](https://github.com.ipaddress.com/)

### 2. 编辑host文件

打开 C:\Windows\System32\drivers\etc\hosts，填入

```bash
# ip github.com
140.82.113.4 github.com
```

### 3. 刷新dns配置

```bash
ipconfig /flushdns
```

### 4. 验证

```bash
ping github.com
```

查看ping到的ip是不是修改后的
