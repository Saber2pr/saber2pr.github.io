先用BNF（上下文无关文法）定义/描述jsx语法，然后找个parsec库开始写组合子就好了

```bnf
JSX ::= JSXOPENED | JSXSELFCLOSE

PARAMETER ::= "(" (IDENTITY ("," IDENTITY)* (",")?)? ")"

EXPRESSION ::= JSX 
             | STRING 
             | NUMBER 
             | OBJ 
             | ARRAY 
             | ARROWFUNCTION 
             | CALLCHAIN 
             | FUNCTION

STATEMENT ::= DECLAREVARIABLE 
            | VARIABLEASSIGN
            | CALLCHAIN
            | IFSTATEMENT

NUMBER ::= digit

TEXT ::= (letter | digit)*

STRING ::= '"' TEXT '"'
         | "'" TEXT "'"

KEYWORD ::= "var"
          | "let"
          | "const"

IDENTITY ::= letter (NUMBER TEXT)?

OBJ ::= "{" (IDENTITY ":" EXPRESSION ("," IDENTITY ":" EXPRESSION)* (",")?)? "}"

ARRAY ::= "[" (EXPRESSION ("," EXPRESSION)* (",")?)? "]"

PROP ::= IDENTITY
       | IDENTITY "=" "{" EXPRESSION "}"

OPENTAG ::= "<" IDENTITY ((PROP)*)? ">"

CLOSETAG ::= "<" "/" IDENTITY ">"

JSXSELFCLOSE ::= "<" IDENTITY ((PROP)*)? "/" ">"

JSXOPENED ::= OPENTAG (JSX | TEXT)* CLOSETAG

ARROWFUNCTION ::= PARAMETER "=" ">" BLOCK

FUNCTION ::= "function" (IDENTITY)? PARAMETER BLOCK

CALLCHAIN ::= IDENTITY ("." IDENTITY)* PARAMETER

VARIABLEASSIGN ::= IDENTITY "=" EXPRESSION

BLOCK ::= "{" STATEMENT (";" STATEMENT)* (";")? "}"

DECLAREVARIABLE ::= KEYWORD IDENTITY
                  | KEYWORD VARIABLEASSIGN

IFSTATEMENT ::= "if" PARAMETER BLOCK

PROGRAM ::= (EXPRESSION | STATEMENT)*
```

语法还没写全，正在补充中...

我用的parsec库是轮子哥的ts-parsec，代码在这里

[jsx-ast-parser](https://github.com/Saber2pr/jsx-ast-parser)
