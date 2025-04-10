It is recommended to use Docker image + Vscode Remote Container plug-in development:
Dockerfile
```dockerfile
FROM haskell:latest

# setup
RUN stack setup

# other tools
RUN apt update
RUN apt install curl
RUN apt install git

# git config
RUN git config --global http.sslBackend gnutls
# disable git ssl
ENV GIT_SSL_NO_VERIFY true

# proxy
ENV http_proxy "http://host.docker.internal:10809"
ENV https_proxy "http://host.docker.internal:10809"
```
[Automatic release of github warehouse](https://github.com/Saber2pr/haskell)
> notice that the v2ray agent is used here
Haskell's package management and build execution tools use stack
Create a project:
```bash
stack new my-project
cd my-project
```
Run the project:
```bash
stack run
```