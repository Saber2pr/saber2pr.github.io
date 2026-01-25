Item component right-click pop-up menu
```tsx
const menu = <Menu>
  <Menu.Item onClick={() => onCollapseAll(node)}>
    {i18n.format('collapseAll')}
  </Menu.Item>
</Menu>

<Dropdown trigger={['contextMenu']} overlay={menu}>
  <Item />
</Dropdown>
```