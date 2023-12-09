使用免费的 HTTPS 证书提供商 letsencrypt。需要安装一个命令行工具来生成 https 需要的证书文件：

1. 安装 snap，类似于 apt 的包管理工具

```bash
sudo snap install core; sudo snap refresh core
```

2. 使用 snap 安装 certbot

```bash
sudo snap install --classic certbot
```

3. 配置 certbot 命令

```bash
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

4. 生成 HTTPS 证书

```bash
certbot --server https://acme-v02.api.letsencrypt.org/directory -d "blog.saber2pr.top" --manual --preferred-challenges dns-01 certonly
```

这里有几个参数:

1. server: HTTPS 服务提供商 https://acme-v02.api.letsencrypt.org/directory
2. d: 需要配置 HTTPS 的域名（可以是二级域名）

在生成过程中，提示 Yes，No 的可以直接输入 Y 回车，最后一步会提示让你配置一个域名的 TXT 解析(这里先不要 Enter)：

![loading...](https://cdn.jsdelivr.net/gh/saber2pr/MyWeb@master/resource/image/certbot-txt.webp)

在域名控制台中，根据提示添加一个 TXT 解析，如图所示：

![loading...](https://cdn.jsdelivr.net/gh/saber2pr/MyWeb@master/resource/image/aliyun-https-txt.webp)

配置好解析后，再 Enter 确定，等待 cert.pem 等文件生成。生成成功会输出 pem 文件路径，一般为 /etc/letsencrypt/live。

![loading...](https://cdn.jsdelivr.net/gh/saber2pr/MyWeb@master/resource/image/certbot.webp)

### 注意

1. 这个证书是会过期的（3 个月有效期），需要执行 certbot renew 重新生成
2. 不要对生成的证书文件进行移动、复制等操作！！（以绝对路径去读取使用）

### renew刷新证书

因为是域名解析配置的txt记录，所以不能直接renew，需要手动重新记录一次。重新执行【4. 生成 HTTPS 证书】，然后重启nginx，执行nginx -s reload
