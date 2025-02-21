### Function pointer
When a function is passed as an argument, what needs to be passed is the address of the function.
In the c language, callback functions are often defined by function pointer types, such as:
```cpp
void log(int value){
    std::cout << value << std::endl;
}

void callFunc2(void(*cb)(int), int value){
    cb(value);
}
```
Then, when called, pass in the log function name, that is, the address:
```cpp
int main()
{
    callFunc2(log, 233);

    // lambda
    callFunc2([](int value) -> void {
        log(233);
    }, 233);

    return 0;
}
```
Output:
```bash
233
233
```
### Function type std::function
Instead of using function pointers in C++, use std::function to rewrite the above example:
```cpp
#include<functional>

void log(int value){
    std::cout << value << std::endl;
}

// 定义Callback类型(别名)
using Callback = std::function<void(int)>;

void callFunc(Callback cb, int value){
    cb(value);
}
```
```cpp
int main()
{
    callFunc(log, 233);

    callFunc([](int value) -> void {
        log(233);
    }, 233);

    return 0;
}
```
Output:
```bash
233
233
```