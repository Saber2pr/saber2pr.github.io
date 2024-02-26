The information saved by storage in Mini Program can be emptied by deleting Mini Program, or you can open the debug mode that comes with Mini Program to open the console to clear. But the information saved by localStorage in webview cannot be erased!
At this time, I need to use the H5 virtual console to debug. I use:
[Eruda](https://github.com/liriliri/eruda)
I wrapped it up and added a url parameter to turn debugging on and off:
[debug.min.js](https://github.com/Saber2pr/test/blob/master/tools/debug.min.js)
Add it to the project, and when you access the project, the url parameter plus debug=true enables debugging!
### Use in webview
You cannot directly put a button in webview to debug the switch, but you can use the existing input on the page, such as input, to enter a specific string and execute it:
```js
location.href = '/?debug=true'
```
To indirectly start debugging!