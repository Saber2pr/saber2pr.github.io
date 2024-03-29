Use the free HTTPS certificate provider letsencrypt. You need to install a command line tool to generate the certificate files required by https:
1. Install snap, a package management tool similar to apt
```bash
sudo snap install core; sudo snap refresh core
```
two。 Install certbot using snap
```bash
sudo snap install --classic certbot
```
3. Configure certbot command
```bash
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```
4. Generate HTTPS certificate
```bash
certbot --server https://acme-v02.api.letsencrypt.org/directory -d "blog.saber2pr.top" --manual --preferred-challenges dns-01 certonly
```
Here are a few parameters:
1. Server: HTTPS service provider https://acme-v02.api.letsencrypt.org/directory
2. D: the domain name that needs to be configured with HTTPS (can be a secondary domain name)
During the generation process, those who prompt Yes,No can directly enter Y enter, and the last step will prompt you to configure TXT resolution of a domain name (not Enter here):
![loading...](https://cdn.jsdelivr.net/gh/saber2pr/MyWeb@master/resource/image/certbot-txt.webp)
In the domain name console, add a TXT resolution as prompted, as shown in the figure:
![loading...](https://cdn.jsdelivr.net/gh/saber2pr/MyWeb@master/resource/image/aliyun-https-txt.webp)
After parsing is configured, Enter determines it and waits for files such as cert.pem to be generated. A successful generation will output the path of the pem file, usually / etc/letsencrypt/live.
![loading...](https://cdn.jsdelivr.net/gh/saber2pr/MyWeb@master/resource/image/certbot.webp)
### Be careful
1. This certificate will expire (valid for 3 months) and need to be regenerated by certbot renew
two。 Do not move, copy and other operations on the generated certificate file! (read and use with absolute path)
### Renew refresh certificate
Because it is the txt record of the domain name resolution configuration, it cannot be directly renew and needs to be manually re-recorded. Re-execute [4. Generate HTTPS certificate], then restart nginx and execute nginx-s reload