```tsx
import { Table, Transfer, TransferProps } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { TableRowSelection, TablePaginationConfig } from 'antd/lib/table/interface';
import difference from 'lodash/difference';
import React from 'react';

interface TableTransferProps<T> extends TransferProps<T> {
  leftColumns: ColumnsType<T>;
  leftPagination?: TablePaginationConfig;

  rightColumns: ColumnsType<T>;
  rightPagination?: TablePaginationConfig;
}

export function TableTransfer<T>({
  leftColumns,
  rightColumns,
  leftPagination,
  rightPagination,
  ...restProps
}: TableTransferProps<T>) {
  return (
    <Transfer {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns;
        const pagination = direction === 'left' ? leftPagination : rightPagination;

        const rowSelection: TableRowSelection<any> = {
          getCheckboxProps: (item) => ({ disabled: listDisabled || item.disabled }),
          onSelectAll(selected, selectedRows) {
            const treeSelectedKeys = selectedRows
              .filter((item) => !item.disabled)
              .map(({ key }) => key);
            const diffKeys = selected
              ? difference(treeSelectedKeys, listSelectedKeys)
              : difference(listSelectedKeys, treeSelectedKeys);
            onItemSelectAll(diffKeys, selected);
          },
          onSelect({ key }, selected) {
            onItemSelect(key, selected);
          },
          selectedRowKeys: listSelectedKeys,
        };

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            pagination={pagination}
            size="small"
            style={{ pointerEvents: listDisabled ? 'none' : null }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return;
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
}
```
