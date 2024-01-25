```tsx
import { Form, Modal, ModalProps } from 'antd';
import React, { useState } from 'react';

export interface FormModal<T> {
  visible: boolean;
  onCancel: VoidFunction;
  onOk: (values: T) => any;
  forms: React.ReactNode;
  title: string;
  modalProps: ModalProps;
}

function FormModal<T>({ visible, onCancel, onOk, forms, title, modalProps }: FormModal<T>) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      {...modalProps}
      title={title}
      visible={visible}
      onCancel={onCancel}
      okButtonProps={{ ...(modalProps?.okButtonProps || {}), loading }}
      onOk={() => form.submit()}
    >
      <Form
        onFinish={async (values) => {
          try {
            setLoading(true);
            await onOk(values);
          } catch (error) {
            console.log(error);
          } finally {
            setLoading(false);
          }
        }}
        form={form}
      >
        {forms}
      </Form>
    </Modal>
  );
}

export interface UseFormModal<T> {
  initValues: T;
  forms: React.ReactNode;
  onOk: (values: T) => any;
  title: string;
  modalProps?: ModalProps;
}

export function useFormModal<T>({ forms, onOk, title, modalProps }: UseFormModal<T>) {
  const [show, setShow] = useState(false);

  return {
    setShow,
    show,
    modal: (
      <FormModal
        modalProps={modalProps}
        title={title}
        forms={forms}
        visible={show}
        onCancel={() => setShow(false)}
        onOk={onOk}
      />
    ),
  };
}
```