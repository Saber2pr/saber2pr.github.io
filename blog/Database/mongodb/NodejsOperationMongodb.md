Here is an example of Nodejs manipulating mongodb:
[Demo](https://github.com/Saber2pr/mongodb/blob/master/src/test/test.ts)
There is a library for operating mongodb on npm, install
```bash
yarn add mongodb @types/mongodb
```
> ngodb database service needs to be installed on this machine
The api style of the mongodb library is still the callback form at the end of nodejs, although nodejs provides a tool function promisify for transformation, but many api transformations do not work well.
It is recommended to manually write promise to convert the api of the mongodb library. Here are some:
[@ saber2pr/mongodb](https://github.com/Saber2pr/mongodb)