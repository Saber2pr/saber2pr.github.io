Entity is the entity mapping of database tables, so how to design a table structure to avoid later troubles. A table field/an object attribute is a column, id is a row number used to index a piece of data/an object, usually a self-increasing primary key.
1. Whenever possible, define all columns as NOT NULL, that is, all fields must set default values!
two。 The development environment forbids connecting to online databases! Orm's synchronize can be opened in the dev environment and closed online! Table structure modification use navicat, dbeaver and other editors to modify the database.
3. For enumerated fields, it is recommended to use tinyint instead of varchar. For example, use dev=0,prod=1 instead of "dev" | "prod" to save memory footprint.
4. When defining varchar fields, the length is as small as possible, and other types of fields are the same, so you need to consider the best and most space-saving.
5. When adding fields to the create interface, be sure to set default values.
6. The create interface must have a timestamp, create a user id, etc., to facilitate the location of users.
7. Avoid saving json in fields as much as possible
8. Field character sets all use uft8mb4
[Design specification of MySQL data table](https://zhuanlan.zhihu.com/p/110543466)