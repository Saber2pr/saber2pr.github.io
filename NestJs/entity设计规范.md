entity是数据库表的实体映射，所以也就是如何设计好一个表结构避免后期麻烦。一个表的字段/一个对象的属性就是列，id就是行号用来索引一条数据/一个对象，通常为自增主键。

1. 尽可能把所有列定义为 NOT NULL，即所有字段都必须设置默认值！
2. 开发环境禁止连接线上数据库！orm的synchronize在dev环境可以打开，在线上关闭！表结构修改使用navicat、dbeaver等编辑器修改数据库。
3. 枚举字段推荐以tinyint代替varchar，例如使用 dev=0,prod=1 代替 "dev" | "prod"，节省内存占用
4. 定义varchar字段时，length尽可能小，其他类型字段同理，需要考虑好最优最节省空间。
5. create接口新增字段时，务必设置默认值。
6. create接口必须有时间戳、创建用户id等，方便定位用户
7. 尽量避免字段存json
8. 字段字符集都用uft8mb4

[MySQL 数据表设计规范](https://zhuanlan.zhihu.com/p/110543466)

