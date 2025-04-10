# Environment building
It is recommended to use docker to quickly build a development environment:
[Golang](https://github.com/Saber2pr/golang)
## Install the go compiler
Download and install https://go.dev/dl/ from the official website
> Note whether mac is arm or amd
## Configure environment variables
Go has two environment variables, GOPATH is the three-party tool installation path, GOROOT is the compiler path, take the docker environment variable as an example:
```dockerfile
ENV GOPATH /usr/local/gopath
ENV GOROOT /usr/local/go
ENV PATH $GOROOT/bin:$PATH
RUN chmod -R 777 "$GOROOT"
```
### Module
Go generally uses a folder as a module, and the top package declares the module name, such as the following directory:
```sh
./pkg
|-- hello
|   `-- main.go
|-- utils
|   `-- string.go
`-- vars
    `-- main.go
```
There are three modules under the pkg directory, hello, utils, and vars
Take the hello module as an example:
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
Note that `github.com/hashicorp/go- uuid` is a three-party library. Install it through the command `go get < pkg-name > `:
```sh
go get github.com/hashicorp/go-uuid
```
Import in the go module is an import, not an export syntax. Variables / functions with uppercase letters in the go convention are exported.
Note that `golangstart/pkg/ utils` is another module that imports the current project, and golangstart is the package name of the current project, which is defined in. / go.mod:
```mod
module golangstart

go 1.17

require github.com/hashicorp/go-uuid v1.0.2 // indirect
```
The package name of the current project, the version of the go compiler, and the dependent tripartite libraries are described in go.mod
# Program entry
## Directory structure
The main function is also specified as the program execution entry in the go file. The directory structure of the current project is as follows:
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
We mainly focus on three directories: pkg, cmd and cli. Pkg is the module directory, cmd is the program execution entry directory, and cli is the compiled product directory.
## Execute main function entry
For example, a cmd/hello file:
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
When cmd/hello/main.go is executed, the main function is executed automatically
# Compile output
During the debugging phase, the go file can be executed directly:
```sh
go run ./cmd/hello
```
The go compilation command is:
```sh
go build -o ./cli/hello ./cmd/hello
```
Cmd/hello will be compiled into a binary executable file to cli/hello.
One of the advantages of go is that the compiled binaries do not depend on any environment and can be executed directly.
The above example project address:
[Golangstart](https://github.com/Saber2pr/golangstart)