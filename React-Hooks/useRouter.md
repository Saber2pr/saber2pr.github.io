react-navigation是一个基于路由栈的路由库，可以用于react-native页面管理

```ts
import { StackActions, useNavigation, useRoute } from '@react-navigation/core';

export const useRouter = <P extends { [k: string]: any }>() => {
  const navigation = useNavigation();
  const route = useRoute();
  return {
    push: navigation.navigate,
    back: () => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        // 退出rn页面回到原生或退出应用
      }
    },
    reset: (screen: string, params?: any) => {
      navigation.reset({
        index: 0,
        routes: [{ name: screen, params }],
      });
    },
    exit: () => { /** 退出rn页面回到原生或退出应用 **/ },
    replace: (screen: string, params?: any) =>
      navigation.dispatch(StackActions.replace(screen, params)),
    getParams: () => (route?.params as any) as P,
  };
};
```
