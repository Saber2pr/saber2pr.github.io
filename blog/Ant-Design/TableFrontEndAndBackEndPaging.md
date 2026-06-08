The Table component in antd comes with a pager:
```tsx
<Table dataSource={dataSource} columns={columns} />
```
If there is too much data in the table, the Table component pagination pager will automatically page according to 10 rows per page.
However, paging is usually implemented by the back end, and getting a large amount of data at a time will put pressure on the database. In this case, you need front-end custom / virtual paging. Set the total number of pages first. When changing pages, call the backend API to reload dataSource and change the current page number of the pager.
The Table component provides the pagination property to control the pager and convert it to a controlled component:
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
The backend paging query needs to return the current page data (Array) and the total number of all page data (Number). The front end can use total/pageSize to set the number of virtual pages.