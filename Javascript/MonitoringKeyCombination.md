```js
 window.addEventListener('keydown', e => {
    const keyCode = e.keyCode || e.which || e.charCode;
    const altKey = e.ctrlKey;
    if(altKey && keyCode == 67){
        // ctrl+c
        e.preventDefault();
        return false
    }
    
    if(altKey && keyCode == 86){
        // ctrl+v
        e.preventDefault();
        return false
    }
})
```