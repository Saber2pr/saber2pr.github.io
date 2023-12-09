# 环境搭建

这里推荐使用 docker 快速搭建开发环境：

[golang](https://github.com/Saber2pr/golang)

## 安装 go 编译器

前往官网下载安装 https://go.dev/dl/

> 注意 mac 是 arm 还是 amd

## 配置环境变量

go 有两个环境变量, GOPATH 是三方工具安装路径，GOROOT 是编译器路径，以 docker 环境变量为例：

```dockerfile
ENV GOPATH /usr/local/gopath
ENV GOROOT /usr/local/go
ENV PATH $GOROOT/bin:$PATH
RUN chmod -R 777 "$GOROOT"
```

### 模块

go 一般以一个文件夹为一个模块，顶部 package 声明模块名，例如如下目录：

```sh
./pkg
|-- hello
|   `-- main.go
|-- utils
|   `-- string.go
`-- vars
    `-- main.go
```

pkg 目录下有三个模块，hello、utils、vars

以 hello 模块为例：

```go
// pkg/hellp/main.go
package hello

import (
	"golangstart/pkg/utils"
	"github.com/hashicorp/go-uuid"
)

func Log() string {
	str := utils.TestStr()
	uuid, _ := uuid.GenerateUUID()
	return str + uuid
}
```

注意到`github.com/hashicorp/go-uuid`是一个三方库，通过命令 `go get <pkg-name>` 安装：

```sh
go get github.com/hashicorp/go-uuid
```

go 模块中 import 为导入，而没有导出语法。go 约定中首字母大写的变量/函数等会被导出。

注意到`golangstart/pkg/utils`是导入当前项目的其他模块, golangstart 是当前项目的包名，定义在./go.mod 中：

```mod
module golangstart

go 1.17

require github.com/hashicorp/go-uuid v1.0.2 // indirect
```

go.mod 中描述了当前项目的包名，依赖 go 编译器的版本，依赖的三方库

# 程序入口

## 目录结构

go 文件中也约定了 main 函数作为程序执行入口，当前项目的目录结构如下：

```sh
./
|-- Dockerfile
|-- README.MD
|-- build.sh
|-- cli
|   |-- hello
|   |-- main
|   `-- vars
|-- cmd
|   |-- hello
|   |   `-- main.go
|   `-- vars
|       `-- main.go
|-- go.mod
|-- go.sum
|-- main.go
`-- pkg
    |-- hello
    |   `-- main.go
    |-- utils
    |   `-- string.go
    `-- vars
        `-- main.go
```

主要关注 pkg、cmd、cli 三个目录，pkg 为模块目录，cmd 为程序执行入口目录，cli 为编译产物目录.

## 执行 main 函数入口

例如 cmd/hello 文件：

```go
// cmd/hello/main.go
package main

import (
	"fmt"
	"golangstart/pkg/hello"
)

func main() {
	str := hello.Log()
	fmt.Println(str)
}
```

当执行 cmd/hello/main.go 时，自动执行 main 函数

# 编译输出

在调试阶段时，go 文件可直接执行：

```sh
go run ./cmd/hello
```

go 编译命令为:

```sh
go build -o ./cli/hello ./cmd/hello
```

会将 cmd/hello 编译为二进制可执行文件到 cli/hello.

go 的优势之一就是，编译后的二进制文件不需要依赖任何环境，可以直接执行

以上示例项目地址：

[golangstart](https://github.com/Saber2pr/golangstart)
