```yml
name: Docker-Publish
on:
  workflow_dispatch:
  push:
    tags:
      - 'v*.*.*'
jobs:
  Docker-Publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        # secrets: DOCKER_USER, DOCKER_TOKEN
      - name: Build & Publish
        run: |
          image=${GITHUB_REPOSITORY#*/}:${GITHUB_REF#refs/*/}
          docker login -u ${{secrets.DOCKER_USER}} -p ${{secrets.DOCKER_TOKEN}}
          docker image build -t $image .
          docker tag $image ${{secrets.DOCKER_USER}}/$image
          docker push ${{secrets.DOCKER_USER}}/$image
```

上传容器静态资源示例：

```yml
- name: Copy Assets
  run: |
    image=${GITHUB_REPOSITORY#*/}:${GITHUB_REF#refs/*/}
    mkdir ./app
    docker cp $(docker create --rm ${{secrets.DOCKER_USER}}/$image):/app/.next ./app/_next
    
- name: Upload CDN
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./app
```
