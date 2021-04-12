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
