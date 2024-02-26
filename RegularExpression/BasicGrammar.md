### Matching number
1. Match a number, 0-9
```bash
/[0-9]/

/\d/
```
two。 Match multiple digits
```bash
/[0-9]+/

/\d+/
```
3. Matches a specified number of numbers, such as 1 to 3
```bash
/[0-9]{1,3}/

/\d{1,3}/
```
### Matching character
1.\ s
Match white space characters, including spaces, line breaks, tab indentation, etc.
2.\ s
Matches non-white space characters, as opposed to\ s
3. [\ s\ S]
Match all characters
4.\ w
Match word characters, equal to [A-Za-z0-9 _]
5.\ W
Matches non-word characters, as opposed to\ W
### Match string
1. Match everything
```bash
/[\s\S]*/
/[\w\W]*/
```
### Matching pattern
1. `+`
The leading character must appear one or n times in the target string
```bash
/\d+/
```
2. `*`
The leading character must appear 0 times or consecutive n times in the target string
```bash
/\d*/
```
3. ``
The leading object must appear 0 or 1 times in a row in the target string
```bash
/\d?/
```
4. `^ `
Locate the first 1 character of the string
```bash
/^\d/
```
5. `$ `
```bash
/\d$/
```
Locate the last 1 character of the string
### Greedy matching
1. Greedy mode
```bash
/\([\w\W]*\)/.exec("(add (mul 1 2) 3)")
```
Results: (add (mul 1 2) 3)
two。 Non-greedy mode
Add it before `\)`? Number means that if you encounter the first one, it will be over.
```bash
/\([\w\W]*?\)/.exec("(add (mul 1 2) 3)")
```
Result: (add (mul 1 2)