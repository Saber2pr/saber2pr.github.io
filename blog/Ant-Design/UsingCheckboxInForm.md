If the checkbox multiple selection component needs to be used in the form, the official recommendation is to use Checkbox Group. Checkbox cannot respond to value and onChange of Form.Item, so manual binding is required:
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