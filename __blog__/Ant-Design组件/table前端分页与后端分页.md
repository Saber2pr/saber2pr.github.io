antd 中的 Table 组件自带了分页器：

```tsx
<Table dataSource={dataSource} columns={columns} />
```

如果表格数据太多，Table 组件 pagination 分页器会自动按 10 行/页进行自动分页。

但是通常情况下分页由后端实现，一次获取大量数据会给数据库带来压力。这种情况下就需要前端自定义/虚拟分页，先设置好分页总数，换页的时候调用后端接口重新装填 dataSource 并改变分页器当前页码。

Table 组件提供了 pagination 属性用于控制分页器，将其转换为受控组件：

```tsx
<Table
  dataSource={dataSource}
  columns={columns}
  pagination={{
    pageSize: size,
    total: totalElements,
    current: pageIdx,
    onChange: changePage
  }}
/>
```

后端分页查询需返回当前页数据(Array)和全部页数据总数(Number)。前端使用 total/pageSize 即可进行虚拟分页数设置。
