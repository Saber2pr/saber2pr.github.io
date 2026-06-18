Explanation: the state of an uncertain pushdown automaton is a deep freely scalable stack, and it is impossible to enumerate all cases, that is, uncertain states.
For example, for jsx syntax parsing, you can list the syntax rules of jsx:
```txt
JSX
  = Text
  = OpenTag JSX CloseTag
```
It is obviously a stack of uncertain length. If regular expressions are used to match JSX patterns, greedy matching will not be terminated, and non-greedy matching results will not be complete, for example:
```jsx
<div>
  <span>
    text1
  </span>
</div>
<div>
  text2
</div>
```
Use regularization:
```js
/<[\w\W]*>/ // 贪婪，将匹配所有文本
/<[\w\W]*?>/ // 非贪婪，匹配不完整
```
These two regular matching patterns determine that only finite states can be handled, that is, nested syntax is not supported.
Nested syntax requires manual recording of the stack, and it is recommended to use parsec.