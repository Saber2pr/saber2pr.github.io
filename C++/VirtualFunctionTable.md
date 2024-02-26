### Pure virtual class (abstract class)
There is no abstract keyword or interface keyword in C++. The function of a pure virtual class is to act as an interface.
If the members are in an unimplemented state, this class is a pure virtual class.
```cpp
class Node { // abstract class
public:
    virtual int getIndex() = 0; // 纯虚函数
};
```
### Virtual function and virtual function table
Inherits the pure virtual class and rewrites the parent virtual function table.
The Rect class inherits the virtual function table and virtual function table pointer from the Node class, and then the Rect class overwrites the virtual function table.
```cpp
class Rect: public Node {
public:
    // 重写父类虚函数表
    virtual int getIndex(){ // 虚函数
        return 233;
    }
};

class Box: public Rect {
public:
    // 重写父类虚函数表
    int getIndex(){
        return 114514;
    }
};
```
Use the base class pointer to invoke the subclass instance:
```cpp
int main(){
    // 基类指针指向子类实例
    Node* node1 = new Rect;
    Node* node2 = new Box;
    std::cout<<node1->getIndex()<<std::endl;
    std::cout<<node2->getIndex()<<std::endl;
}
```
Although the base class pointer is defined to point to the subclass instance, the virtual table pointer is declared in the base class type, so although you access the virtual table pointer of the Node class, it points to the memory of the Rect class instance, and the actual access is the virtual table of the Rect class. Base classes can also be understood as type annotations.