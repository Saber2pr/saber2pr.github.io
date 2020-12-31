checkbox多选组件如果需要在表单中使用，官方推荐是使用Checkbox Group。checkbox不能响应Form.Item的value和onChange，需要手动绑定：

```tsx
const FormCheckbox = ({
  children,
  value,
  onChange,
}: {
  children: ReactNode
  value?: boolean
  onChange?: (value: boolean) => void
}) => {
  return (
    <Checkbox
      checked={value}
      onChange={event => onChange(event?.target?.checked)}
    >
      {children}
    </Checkbox>
  )
}
```