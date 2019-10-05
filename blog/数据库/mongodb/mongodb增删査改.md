mongodb 存储结构：database > collection > document

### 交互式

1. 打开交互式

```bash
mongo
```

2. 列出存在的数据库

```bash
show dbs
```

3. 创建数据库

```bash
use saber2pr
```

4. 在数据库中创建集合

```bash
db.createCollection("qwq")
```

5. 列出数据库中存在的集合

```bash
show collections
```

6. 在集合中插入文档

```bash
db.qwq.insert({name: "saber"})
```

7. 查找集合中指定文档

```bash
db.qwq.find({name: "saber"})
```

8. 查找集合中所有文档

```bash
db.qwq.find()
```

9. 删除集合中指定文档

```bash
db.qwq.remove({name: "saber"})
```

10. 删除集合中所有文档

```bash
db.qwq.remove({})
```

11. 删除数据库中指定集合

```bash
db.qwq.drop()
```

12. 删除指定数据库

```bash
use saber2pr

db.dropDatabase()
```
