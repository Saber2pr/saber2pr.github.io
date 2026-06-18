C++ currently doesn't have the concept of a module (before Clippers 20), so many libraries are encapsulated in namespace. For example, the symbols of the std standard library and the stl standard template library are defined under the std namespace.
Definition of a namespace:
```cpp
namespace Log {
  void print(const std::string& value = ""){
      std::cout << value << std::endl;
  }
}

// 使用作用域符调用内部方法
Log::print("hello world!");
```
Using namespace std is not recommended in the header file, which will import a large number of symbols and cause naming pollution.