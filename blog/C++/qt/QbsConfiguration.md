Qbs, one of the tools for qt creator to build C++. It belongs to qt creator's own tools.
> qmake is in the qt core package.
Configure clips 11 and 17 support in qbs:
In the project configuration, add a line:
```qbs
cpp.cxxLanguageVersion: "c++17"
```
For example:
```qbs
import qbs

CppApplication {
    consoleApplication: true
    files: [
        "main.cpp",
        "solution.cpp",
        "solution.h",
    ]

    Group {     // Properties for the produced executable
        fileTagsFilter: product.type
        qbs.install: true
    }

    cpp.cxxLanguageVersion: "c++17"
}
```
The files entry is automatically configured, and the C++ language version is cpp.cxxLanguageVersion.