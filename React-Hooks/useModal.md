```tsx
import { Modal, ModalProps } from 'antd';
import React, { ReactNode, useState } from 'react';

export interface UseModalOptions extends ModalProps {
  content?: ReactNode;
  onOk?: () => Promise<any>;
  onCancel?: () => Promise<any>;
  autoClose?: boolean;
}

export const useModal = ({
  content,
  onOk,
  onCancel,
  autoClose = true,
  ...modalProps
}: UseModalOptions) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const modal = (
    <Modal
      visible={visible}
      onOk={async () => {
        if (onOk) {
          setLoading(true);
          try {
            await onOk();
            setLoading(false);
            autoClose && setVisible(false);
          } catch (error) {
            console.log(error);
          }
        } else {
          autoClose && setVisible(false);
        }
      }}
      onCancel={async () => {
        if (onCancel) {
          setLoading(true);
          try {
            await onCancel();
            setLoading(false);
            autoClose && setVisible(false);
          } catch (error) {
            console.log(error);
          }
        } else {
          autoClose && setVisible(false);
        }
      }}
      confirmLoading={loading}
      {...modalProps}
    >
      {content}
    </Modal>
  );

  return {
    visible,
    setVisible,
    modal,
  };
};

```
