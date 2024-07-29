1. The user enters the url address and resolves the IP address from DNS
2. The browser sends an http request to the server, and if the server segment returns a redirect such as 301, the browser sends the request again based on the location in the corresponding header.
3. The server accepts the request, processes the request to generate html code, and returns it to the browser. In this case, the html page code may be compressed.
4. The browser receives the response from the server, and if there is compression, it is decompressed first, followed by page parsing rendering.
### Parse the rendering process:
1. Parsing HTML
two。 Build a DOM tree
3. DOM tree is attached to CSS style to construct rendering tree.
4. Overall Arrangement
5. drawn