qt creator 构建 C++工具之一，qbs。属于 qt creator 自带工具。

> qmake 在 qt core 包里。

在 qbs 中配置 C++11、C++17 支持：

在项目配置中，添加一行：

```qbs
cpp.cxxLanguageVersion: "c++17"
```

例如：

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

files 项会自动配置，配置 C++语言版本是 cpp.cxxLanguageVersion。
