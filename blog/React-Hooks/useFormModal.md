```tsx
import { Form, Modal, ModalProps, FormProps } from 'antd';
import React, { useState } from 'react';

export interface FormModal<T> {
  visible: boolean;
  onCancel: VoidFunction;
  onOk: (values: T) => any;
  forms: React.ReactNode;
  title: string;
  modalProps?: ModalProps;
  formProps?: FormProps;
}

function FormModal<T>({
  visible,
  onCancel,
  onOk,
  forms,
  title,
  modalProps,
  formProps,
}: FormModal<T>) {
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
        {...formProps}
        onFinish={async (values) => {
          try {
            setLoading(true);
            await onOk(values);
            onCancel();
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
  formProps?: FormProps;
}

export function useFormModal<T>({ forms, onOk, title, ...props }: UseFormModal<T>) {
  const [show, setShow] = useState(false);

  return {
    setShow,
    show,
    modal: (
      <FormModal
        {...props}
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