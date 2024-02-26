Switch to admin
```js
use admin
```
Add Super Admin
```js
db.createUser({
  user: 'root',
  pwd: '123456',
  roles: [{ role: 'root', db: 'admin' }],
})
```