There is a special dns:host.docker.internal in the docker container, which is the host localhost!
If the host localhost:10809 starts an http proxy service, you can set it like this in the docker container:
```bash
export http_proxy="http://host.docker.internal:10809"
export https_proxy="http://host.docker.internal:10809"
```