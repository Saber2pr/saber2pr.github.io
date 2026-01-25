Mongodb storage structure: database > collection > document
### Interactive
1. Turn on interactive
```bash
mongo
```
two。 List the databases that exist
```bash
show dbs
```
3. Create a database
```bash
use saber2pr
```
4. Create a collection in the database
```bash
db.createCollection("qwq")
```
5. List the collections that exist in the database
```bash
show collections
```
6. Insert a document into the collection
```bash
db.qwq.insert({name: "saber"})
```
7. Find the specified document in the collection
```bash
db.qwq.find({name: "saber"})
```
8. Find all documents in the collection
```bash
db.qwq.find()
```
9. Delete the specified document in the collection
```bash
db.qwq.remove({name: "saber"})
```
10. Delete all documents in the collection
```bash
db.qwq.remove({})
```
11. Delete the specified collection in the database
```bash
db.qwq.drop()
```
twelve。 Delete the specified database
```bash
use saber2pr

db.dropDatabase()
```