1. Clean up the vscode cache, which will reach 30g.
```sh
rm -r "/Users/<user>/Library/Application Support/Code/Service Worker/CacheStorage"
```
two。 Clean up the Docker cache, which will reach 50 GB.
Docker settings: docker image size turn it down
3. Clean the yarn and npm caches, which will reach 20 GB.
---
This set can release about 70G of space