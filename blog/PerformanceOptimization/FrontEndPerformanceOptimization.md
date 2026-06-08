### Reduce the size and number of HTTP request resources
1. Merge and compress css and js files.
> multiple files are merged into one. Reduce the number of http requests and reduce the size of requested resources.
2. Use font icons or SVG instead of traditional PNG graphics
> Font icons and SVG are vector graphics. Zooming in will not deform, and the rendering speed is fast.
3. Picture lazy load
Reduce the number of requests for http rendering on the first screen of a page
> ing placeholder maps
4. Animation is done in css, not js (try to)
5. Using Sprite CSS Sprite
Draw a smaller picture of resources on a larger picture
> iloring with background-position
6. static resource distribution using cdn
7. Put CSS on top and JS on bottom.
> ve priority to rendering pages
### Code optimization
1. Reduce closures in js
two。 Reduce DOM operation
> u don't have to think about it if you use libraries such as react
3. Css uses link instead of @ import
> import is synchronous, link is asynchronous
4. Animation uses requestAnimationFrame instead of setInterval
5. Delegate using DOM event
6. import() code splitting, lazy loading
> take a look at react-loadable?
## Performance optimization of mobile H5 front end
In Mobile, there are three seconds to complete the first screen target, and it takes 3 seconds to load the first screen or use Loading.
Based on the average 338KB/s (2.71Mb/s) of the network, the resources of the first screen should not exceed 1014KB.
### Loading optimization
1. Merge CSS, JavaScript
two。 Merge small pictures and use Sprite diagrams
3. Cache all cacheable resources
4. Use long Cache
5. Use external references to CSS, JavaScript
6. Compress HTML, CSS, JavaScript
7. Enable GZip
8. Use the first screen to load
9. Use demand loading
10. Use scrolling to load
11. Load via Media Query
twelve。 Add Loading progress bar
13. Reduce Cookie
14. Avoid redirection
15. Load third-party resources asynchronously
### CSS optimization
1. CSS is written in the head, JavaScript is written in the tail or asynchronously
2. Avoid empty src for images and iFrames
3. Try to avoid resizing pictures
4. Try to avoid using DataURL in pictures.
5. Try to avoid writing Stye attributes in HTML tags
6. Avoid CSS expressions
7. Remove empty CSS rules
8. Properly use Display properties
9. Do not abuse Float
10. Do not abuse Web fonts
11. Do not declare too much Font-size
twelve。 No units are required when the value is 0
13. Standardize various browser prefixes
14. Avoid making selectors look like regular expressions
### Picture optimization
1. Use (CSS3, SVG, IconFont) instead of images
two。 Use Srcset
3. WebP is better than JPG
4. PNG8 is better than GIF
5. The first load is not greater than 1014KB (based on the average network speed of 3 seconds Unicom)
6. Picture no wider than 640
### Script optimization
1. Reduce redrawing and backflow
two。 Cache Dom selection and calculation
3. cache list length
4. Try to use event proxies to avoid batch binding events
5. Try to use the ID selector
6. Use touchstart, touchend instead of click
### Rendering optimization
1. HTML uses Viewport
two。 Reduce Dom nod
3. Use CSS3 animation as much as possible
4. Make requestAnimationFrame Animation replace setTimeout reasonably
5. Appropriate use of Canvas animation
6. Touchmove, Scroll event will cause multiple renderings
7. Use (CSS3 transitions, CSS3 3D transforms, Opacity, Canvas, WebGL, Video) to trigger GPU rendering