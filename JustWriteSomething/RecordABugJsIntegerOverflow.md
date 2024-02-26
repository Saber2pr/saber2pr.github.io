If you eat, you have to work overtime.
---
The node agent of the middle station receives the data returned by the java backend, then serializes it back to the front-end browser, and then the integer overflow in the json is truncated, resulting in an asynchronous query with the wrong ID to call the interface.
The cause of the error: the range of integer variables in js is ±2 to 53. Integers that are out of range are truncated when serialized by json. The seventh basic type BigInt was added to ES2020. Before, large numbers were generally stored in variables of type string.
The whole project is ssr rendering done by nextjs framework (why not mix csr below), the browser takes cookie to request node proxy, node agent uses token in cookie as jwt to request java backend, java returns BigInt,nodejs to receive large numbers and store them as BigInt objects, and then gives them to nextjs to render the page (getServerSideProps). Then nextjs's default serialization method is JSON.stringify, which will report an error when serializing objects with attributes of value type BigInt.
Solution: use the json-bigint library to fallback the BigInt property of the value type in the object to the string type when serializing.
```js
const JSONbigString = require('json-bigint')({ storeAsString: true });
```
Then parse it with JSONbigString.parse, and all the BigInt in the object becomes string. (just write an axios response interceptor)
In fact, you don't need a library, just go through the object tree and convert BigInt to string (toString).
---
Because the antd is loaded on demand, the next/link jumps only to the js chunk, not to the css chunk, so the style will be lost. Or maybe there's something wrong with my configuration and it's a little lame. Don't optimize this place until you think about it.