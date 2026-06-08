### 1. Query the ip of github.com
[Https://github.com.ipaddress.com/](https://github.com.ipaddress.com/)
### two。 Edit the host file
Open C:\ Windows\ System32\ drivers\ etc\ hosts and fill in
```bash
# ip github.com
140.82.113.4 github.com
```
### 3. Refresh dns configuration
```bash
ipconfig /flushdns
```
### 4. Verification
```bash
ping github.com
```
Check whether the ip reached by ping is modified.