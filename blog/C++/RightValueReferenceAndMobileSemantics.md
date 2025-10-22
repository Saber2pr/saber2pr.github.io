### Value transfer
A copy of the value passed by the function parameter occurs, for example:
```cpp
#include <iostream>

namespace Log {
  void print(std::string value){
      std::cout << value << std::endl;
  }
}

int main(int argc, char *argv[])
{
    std::string hello = "hello world!";
    Log::print(hello);
    return 0;
}
```
When the variable hello is passed to the function print, the value of hello is first copied to the formal parameter value assigned to the print function.
For other languages, string is also passed as a value as a basic type. But it can be changed into reference passing, including any other type, such as the int type, essentially taking an address, that is, pointer passing.
### reference passing
Of course, there are references in C++, but the default values are passed.
Use references:
```cpp
#include <iostream>

namespace Log {
  // 形参为引用类型，传递地址，不发生拷贝
  void print(std::string& value){
      std::cout << value << std::endl;
  }
}

int main(int argc, char *argv[])
{
    std::string hello = "hello world!";
    // 定义指向变量hello的引用
    std::string& hello_ref = hello;
    Log::print(hello_ref);
    return 0;
}
```
In this way, copying can be avoided and memory footprint can be reduced.
### Frequently quoted
The above example is sometimes too troublesome. After defining a variable, you have to define a reference to it, and then use all its references (similar to pointers). In fact, you can combine the two steps, using frequent references:
```cpp
#include <iostream>

namespace Log {
  // 形参为常引用类型
  void print(const std::string& value){
      std::cout << value << std::endl;
  }
}

int main(int argc, char *argv[])
{
    // 定义常引用hello
    const std::string& hello = "hello world!";
    Log::print(hello);
    return 0;
}
```
C++ does not allow such a definition:
```cpp
std::string& hello = "hello world!";
```
This is not safe and must be labeled const, and frequent references can ensure that reference points are not lost.
Frequent references can avoid copying values and passing them by address. However, the disadvantage is that the value pointed to by the reference cannot be modified because of const.
### Right value reference and Mobile semantics
> portant features introduced by Category 11. It not only solves the problem that frequent references can not modify the value pointed to by references, but also has the advantage of reference transmission.
The right value is the "right value" and will not be copied during the transfer process, only its address will be passed. But you can also change the value of the point.
For example:
```cpp
#include <iostream>
#include<utility>

namespace Log {
  void print(std::string&& value){
      value += "test";
      std::cout << value << std::endl;
  }
}

int main(int argc, char *argv[])
{
    std::string hello = "hello world!";

    Log::print(std::move(hello));
    std::cout << hello << std::endl;
    return 0;
}
```
Output:
```bash
hello world!test
hello world!test
```
You can see that the value of the variable hello pointed to by [reference value] has been modified.
Analysis process:
First, the std::string type variable hello is defined, and then it is forced to a right value using mobile semantics. The signature of the function that matches Log::print is successful. The address of hello change is assigned to the formal parameter value,Log::print function to modify the value of hello variable through the address of value, that is, the hello variable.
### Right value reference and frequent reference overload
Function overloading takes into account the number and type of parameters, where right-value references and frequently referenced types are different, so overloading can occur.
For example:
```cpp
#include <iostream>
#include<utility>

namespace Log {
    void print(const std::string& value){
        std::cout<< "const ref: " << value << std::endl;
    }

    void print(std::string&& value){
      std::cout<< "right ref: " << value << std::endl;
    }
}

int main(int argc, char *argv[])
{
    std::string hello = "hello world!";

    Log::print(hello);
    Log::print(std::move(hello));
    return 0;
}
```
Output:
```bash
const ref: hello world!
right ref: hello world!
```
See a signature that matches the right value reference using mobile semantics.