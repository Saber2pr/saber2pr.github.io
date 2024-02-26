Now.sh (vercel) is a free web application hosting platform that supports serverless functions features, runs nodejs servers, deploys static websites, server-side ssr-rendered websites, and supports file storage (/ tmp directory).
The following example deploys nestjs to vercel:
### Install now.sh
```bash
sudo npm i -g now

# 登陆
now login # 会提示打开vercel操作
```
### Create a now configuration for your Nestjs application
Create a now.json file under the nestjs project directory
Name is an application name that is used for management. Other configurations remain the same.
```json
{
  "version": 2,
  "name": "nest-api-analyse-imports",
  "builds": [
    {
      "src": "dist/main.js",
      "use": "@now/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/main.js"
    }
  ]
}
```
### Deploy Nestjs applications to vercel
```bash
yarn build && now
```
Note that the Inspect link is the status of the current project on the vercel. After successful deployment, the output of a Preview link is the application access portal.
Example:
[Nest-api-analyse-imports](https://github.com/Saber2pr/nest-api-analyse-imports)
### Be careful
Only the / tmp directory of the file system in the vercel environment is readable and writable, and the rest is read-only.
### Automate deployment using Github Action
You need to configure a vercelToken: ZEIT_TOKEN
```yml
name: Deploy-Server
on:
  workflow_dispatch:
  push:
    tags:
      - 'v*.*.*'
jobs:
  Deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
        
      - name: Install Deps
        run: yarn add now
      
      - name: Deploy
        run: yarn build && now -c --token ${{secrets.ZEIT_TOKEN}}
```
### What can it be used for?
1. Deploy your own nestjs server and provide various micro-service interfaces