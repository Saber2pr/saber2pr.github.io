1.

```bash
sudo apt update
```

2.

```bash
sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

3.

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

4.

```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

5.

```bash
sudo apt update
```

6.

```bash
sudo apt install docker-ce
```
