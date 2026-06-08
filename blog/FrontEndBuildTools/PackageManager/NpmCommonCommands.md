Use-save for packages that need to be used at run time, otherwise use-save-dev
Cnpm install-- save for production environment | | cnpm I-S
Cnpm install-- save-dev for development environment | | cnpm I-D
### Install the project dependency package
1. Install to the node_modules directory
```bash
npm install [package]

npm i [package]

npm i [package] --registry=https://registry.npmjs.org
```
two。 Install the package to the node_modules directory
Package will be added under the dependencies attribute of package.json
```bash
npm install --save [package]
```
3. Install the package into the node_modules directory
Package will be added under the devDependencies attribute of package.json
```bash
npm install --save-dev [package]
```
4. Global installation of package
```bash
npm install -g [package]
```
### Delete dependency package
```bash
npm uninstall xxx
```
Delete a global module
```bash
npm uninstall -g xxx
```
### Delete published npm packages
```bash
npx force-unpublish <packageName> 'message'
```
### View Global Modul
```bash
npm list -g --depth 0
```
### View the package remote library
```bash
npm config get registry
```
### Set up remote library
```bash
npm config set registry url
```
[npm] https://registry.npmjs.org/
[cnpm] https://registry.npm.taobao.org