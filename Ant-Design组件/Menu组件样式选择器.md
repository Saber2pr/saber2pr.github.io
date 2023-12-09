```css
.ant-menu {
  // 一级菜单
  > .ant-menu-item {
    // 一级菜单hover样式
    &-active {
    }
    // 一级菜单selected样式
    &.ant-menu-item-selected {
    }
  }
  // 子菜单
  .ant-menu-submenu {
    // 子菜单标题
    &-title {
    }
    &-active {
      // 子菜单标题hover样式
      .ant-menu-submenu-title {
      }
    }
    .ant-menu-sub {
      // 二级菜单
      > .ant-menu-item {
        // 二级菜单hover样式
        &-active {
        }
        // 二级菜单selected样式
        &.ant-menu-item-selected {
        }
      }
    }
  }
}
```