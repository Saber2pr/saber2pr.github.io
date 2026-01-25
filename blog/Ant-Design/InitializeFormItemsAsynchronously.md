The form is initialized actively, suitable for the scenario: there is no value in initValues, but needs to be submitted to the form. The initial value needs to be loaded asynchronously.
```tsx
import { Input, Spin } from 'antd';
import React from 'react';

import { useAsync } from 'hooks/useAsync';

export interface ViewProps {
  id: number;
  value?: string;
  onChange?: (value: string) => void;
}

export const View: React.FC<ViewProps> = ({ value, onChange, id }) => {
  const { loading } = useAsync(async () => {
    // 例如关联表id的查询
    const initValue = await Promise.resolve(`${id}`);
    // 初始化初始值
    onChange(initValue);
  }, [id]);

  return (
    <Spin spinning={loading}>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </Spin>
  );
};
```