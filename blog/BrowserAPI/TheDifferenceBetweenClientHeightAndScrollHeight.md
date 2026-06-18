### clientHeight
(read-only) the height (in pixels) inside the element, including the inner margin, but excluding the horizontal scroll bar, border, and outer margin.
### ScrollHeight
(read-only) A measure of the height of the content of an element, including invisible content in the view due to an overflow.
### Difference
For the document.documentElement element, clientHeight is the viewport height and scrollHeight is the total length of the content.
Reflected in the scroll bar, scrollHeight is the total track length of the scroll bar, and for elements, clientHeight is the length of the scroll bar.
> scrollTop is the distance from the top of the scroll bar to the top of the scroll bar track.
> document.documentElement.scrollTop + document.documentElement.clientHeight = document.documentElement.scrollHeight is rolled to the bottom