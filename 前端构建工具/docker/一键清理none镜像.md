```bash
docker rmi $(docker images | grep "<none>" | grep -oE "[0-9a-z]{12}" | tr '\n' ' ')
```
