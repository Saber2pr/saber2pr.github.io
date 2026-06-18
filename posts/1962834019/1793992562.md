First define/describe jsx syntax with BNF (context free grammar), then find a parsec library to start writing combinators
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
The grammar has not been fully written and is being supplemented.
The parsec library I use is Wheel's ts-parsec, and the code is here.
[Jsx-ast-parser](https://github.com/Saber2pr/jsx-ast-parser)