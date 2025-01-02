### Browser rendering steps:
1. Parse HTML documents and build DOM trees
two。 Parsing CSS documents and constructing CSSOM trees
3. DOM tree and CSSOM tree are merged into Render tree.
4. According to the Render tree layout, calculate the layout information of each node and draw it to the screen
> if DOM or CSSOM is modified, all the above steps will be reperformed, that is, reflow redrawing will be triggered.
![loading](https://saber2pr.top/MyWeb/resource/image/dom-cssom.webp)
### Building an object Model (DOM,CSSOM)
#### Build DOM
1. Parse the HTML document into an HTML string based on the file encoding (charset, for example: utf-8).
2. Parses HTML strings and converts tags into nodes.
3. Build the DOM based on the label node.
#### Build CSSOM
1. Parsing HTML requests resources when it encounters a link tag.
two。 Parse the CSS string and convert it to a node.
3. Build CSSOM based on nodes.
> SOM and DOM are separate data structures.
### Synthesis and drawing of Render trees
The CSSOM tree and the DOM tree are merged into a Render tree, which calculates the layout of each visible element and outputs it to the drawing process, rendering the pixels to the screen.
Synthesis steps:
1. Starting from the root node of the DOM tree, iterate through each visible node.
> visible nodes: display:none and visibility:hidden
two。 For each visible node, find the corresponding CSSOM rule for it and apply it.
3. Generate Render tree
Draw:
1. Layout phase: output box model
two。 Drawing phase: output screen pixels
### CSS blocking rendering
CSS does not block DOM tree parsing, but does block Render tree rendering.
> when rendering, you need to wait for the CSS to load, because the Render tree needs to find rules from the CSSOM.
Therefore, it is necessary to download CSS resources to the client as soon as possible.
> Put the introduction of external styles in the head tab and build CSSOM before rendering the body.
### JavaScript blocking rendering
JavaScript blocks DOM parsing and Render tree rendering.
> you can let JavaScript execute asynchronously to remove unnecessary JavaScript from critical rendering paths.
#### Async and defer
1. Async attribute: [process of loading and rendering subsequent document elements] and [loading and execution of JavaScript] are carried out in parallel (asynchronously).
> there is no order between scripts.
2. Defer attribute: [the process of loading subsequent document elements] and [loading of JavaScript] are performed in parallel (asynchronously). However, the execution of [JavaScript] is completed after all element parsing is completed and before the DOMContentLoaded event is triggered.
> in order between scripts.