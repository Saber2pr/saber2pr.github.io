Install react-sortable-hoc
```sh
yarn add array-move react-sortable-hoc styled-components
```
```tsx
import { Table } from 'antd';
import { ColumnsType, TableProps } from 'antd/lib/Table';
import arrayMoveImmutable from 'array-move';
import React, { useMemo } from 'react';
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle,
} from 'react-sortable-hoc';
import { createGlobalStyle } from 'styled-components';

import MenuOutlined from '@ant-design/icons/MenuOutlined';

const helperClass = 'react-sortable-hoc-row-dragging';

// 因为SortableContainer是挂在body下的，所以需要全局样式
const GlobalStyle = createGlobalStyle`
  .${helperClass} {
    background: #fafafa;
    border: 1px solid #ccc;
    z-index: 1000;
  }
  .${helperClass} td {
    /* padding: 16px; */
    padding: 8px 22px; // 这里需要根据table宽度和size类型调整
  }
`;

function getArray<T>(array: T[]) {
  return Array.isArray(array) ? array : [];
}

const DragHandle = sortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = sortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

interface SortTableProps<T extends { id: string }> extends TableProps<T> {
  onSort: (data: T[]) => void;
}

/**
 * 排序table
 * item元素必须有id属性
 */
export function SortTable<T extends { id: string }>({
  columns,
  dataSource,
  onSort,
  ...props
}: SortTableProps<T>) {
  dataSource = getArray<T>(dataSource as T[]);
  // 添加拖拽icon
  const columnsNew = useMemo(
    () =>
      [
        {
          title: '排序',
          key: 'sort',
          width: 72,
          align: 'center',
          render: () => <DragHandle />,
        } as ColumnsType<T>[0],
      ].concat(columns),
    [columns],
  );

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable([].concat(dataSource), oldIndex, newIndex).filter(
        (el) => !!el,
      );
      onSort(newData);
    }
  };

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = dataSource.findIndex((x) => x.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  const DraggableContainer = (props) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass={helperClass}
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  return (
    <>
      <Table
        size="small"
        rowKey="id"
        {...props}
        dataSource={dataSource}
        pagination={false}
        columns={columnsNew}
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
      <GlobalStyle />
    </>
  );
}
```
Use:
```tsx
import { ColumnsType } from 'antd/lib/table';

export interface DependencyTableProps {
  value?: Data[];
  onChange?: (data: Data[]) => void;
}

export const DependencyTable: React.FC<DependencyTableProps> = ({ value, onChange }) => {
  const columns: ColumnsType<any> = []
  return <SortTable columns={columns} dataSource={value} onSort={onChange} />;
};

```