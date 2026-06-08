### Compilation time calculation
You can put some pure calculations to compile time for execution.
Templates are parsed at the static compilation stage, so you can use templates to achieve compile-time calculations. In C++11, the constexpr keyword was introduced, which can directly mark a piece of code to be executed at compile time.
### Template
For example, to implement a calculation of 1, 2... n:
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
The template struct + static members are utilized. When executing Compute < 3 >:: result, it matches the above template and specializes to the following template when it comes to Compute < 0 >:: result.
### Constexpr
Simply add a constexpr keyword to the function declaration.
```cpp
constexpr int compute(const int& value) {
    if(value == 0) return 0;
    return value + compute(value - 1);
}

int main(){
    std::cout<<compute(3)<<std::endl; // 输出结果6
}
```
Compute (3) will be executed at compile time. The runtime code is directly std::cout < < 6.