### 编译期计算

可以把一些纯的计算放到编译期执行。

而模板就是在静态编译阶段解析的，所以可以利用模板实现编译期计算。在 C++11 引入了 constexpr 关键字，可直接标记一段代码放到编译期执行。

### 模板

例如实现一个求 1+2...+n 的计算：

```cpp
#include <iostream>

template<int value>
struct Compute{
    static const int result = value + Compute<value - 1>::result;
};

// 模板特化
template<> struct Compute<0>{ static const int result = 0; };

int main(){
    std::cout<<Compute<3>::result<<std::endl; // 输出结果6
}
```

利用了模板 struct + 静态成员。执行 Compute<3>::result 时，会匹配上面的模板，到 Compute<0>::result 时特化为下面的模板。

### constexpr

很简单，就是在函数声明上加一个 constexpr 关键字。

```cpp
constexpr int compute(const int& value) {
    if(value == 0) return 0;
    return value + compute(value - 1);
}

int main(){
    std::cout<<compute(3)<<std::endl; // 输出结果6
}
```

compute(3) 会放到编译期执行。运行时的代码就直接是 std::cout<<6 了。
