示例：

```tsx
export const UrlPrefix = /^(https|http):\/\//

export const UrlValidator: RuleRender = ({ getFieldValue }) => ({
  validator(rule, value) {
    if (!value || UrlPrefix.test(value)) {
      return Promise.resolve()
    }
    return Promise.reject('请输入正确的链接！')
  },
})

const App = () => {
  const [form] = Form.useForm()
  const onFinish = ({ href }: { href: string }) => {
    console.log(href)
  }
  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        label="链接"
        name="href"
        initialValue={'http://saber2pr.top/'}
        rules={[{ required: true, message: '链接不能为空！' }, UrlValidator]}
      >
        <Input autoComplete="off" placeholder="请输入链接" />
      </Form.Item>
    </Form>
  )
}
```

复杂一点的，从接口获取数据校验混合正则校验：

组件：

```tsx

export interface InputCodeProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: VoidFunction; // 注意这里的onBlur
}

export const InputCode: React.FC<InputCodeProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  return (
    <Space>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur} // 注意这里的onBlur
      />
     <span>...</span>
    </Space>
  );
};
```

form表单:

```tsx
 <Form.Item
  name="code"
  validateTrigger={['onBlur', 'onChange']} // 注意这里的onBlur
  rules={[
    { required: true },
    CodeValidator, CodeDedupValidator(query?.libraryCode)
  ]}
>
  <InputCode/>
</Form.Item>
```

验证器：

```tsx
export const CodeValidator: RuleRender = (form) => ({
  validateTrigger: 'onChange', // 这里
  async validator(rule, value) {
    if (!value) {
      return Promise.resolve();
    }
    if (!/[a-zA-Z0-9_]+$/.test(value)) {
      return Promise.reject('组件标识只能包含字母数字');
    }
    return Promise.resolve();
  },
});

export const CodeDedupValidator: (libraryCode: string) => RuleRender = (libraryCode: string) => (
  form,
) => ({
  validateTrigger: 'onBlur', // 注意这里onBlur
  async validator(rule, value) {
    // 请求接口
    const list = await queryBaseComponentList({
      componentCode: value,
      libraryCode,
    });

    // 根据接口返回做校验
    const hasComp = getArray(list?.dataList)[0]?.code === value;
    if (hasComp) {
      return Promise.reject(`组件标识${value}已存在`);
    }

    return Promise.resolve();
  },
});

```
