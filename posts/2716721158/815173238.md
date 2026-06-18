# Concept
HTTP is a transaction-oriented application layer protocol, the full name is HyperText Transfer Protocol, that is, hypertext transfer protocol, is the most widely used network protocol on the Internet, all www files must comply with this standard.
# Characteristics
HTTP is connectionless and stateless
HTTP is generally built on top of the TCP/IP protocol (transport layer), and the default port number is 80
HTTP can be divided into two parts, request and response.
# request
It consists of three parts, namely: status line, request header (Request Header), and request body.
HTTP defines different ways to interact with the server, and the four most commonly used methods are GET,POST,PUT and DELETE.
> URL is the full name of resource descriptor. You can think of it this way: an URL address corresponds to a resource on a network, and the GET,POST,PUT,DELETE in HTTP corresponds to four operations to query, modify, add, and delete the resource.
### The difference between GET request and POST request
1. The location of the request parameters is different. The parameters corresponding to the GET request are placed in the URL, while the parameters corresponding to the POST request are placed in the HTTP request body.
> but this is only a convention, and the presence of Body in GET requests is also allowed.
2. Although the RFC specification of HTTP does not specify the maximum character length limit of URL, in practice, there will always be restrictions in browsers or servers, which leads to the limited number of parameters in GET requests.
3. For security reasons, some security-related requests such as login requests need to submit forms using POST, while GET requests are generally used to obtain static resources.
4. GET and POST requests can be cached, but GET requests can be bookmarked, POST cannot.
5. The parameters of the GET request are in the URL, so you must never transfer sensitive data using the GET request. The POST request data is written in the request header of the HTTP, which is slightly more secure than the GET request.
> just a little higher
# Response
It consists of three parts. Respectively: status line, response header, response body
#### HTTP status code
1xx: indicates that the request has been accepted. Continue processing.
2xx: indicates that the request has been processed.
3xx: redirect.
4xx: generally, it means that the client has an error and the request cannot be implemented.
5xx: generally an error on the server side.
Common status codes:
200 OK client request succeeded.
301 Moved Permanently requests permanent redirection.
302 Moved Temporarily requests temporary redirection.
304 Not Modified The file has not been modified, and the cached file can be used directly.
400 Bad Request cannot be understood by the server due to syntax errors in the client request.
The 401 Unauthorized request is not authorized and cannot be accessed.
The 403 Forbidden server received a request but refused to provide service. The server usually gives the reason why the service is not provided in the response body.
The resource requested by the 404 Not Found does not exist, such as entering the wrong URL. An unexpected error occurred on the 500 Internal Server Error server and the client's request could not be completed.
503 Service Unavailable The server is currently unable to process client requests, and after some time, the server may return to normal.
# OSI 7-layer model
1. Application layer: an application that communicates with other computers, such as HTTP, FTP, DNS, etc.
2. Presentation layer: defines data formats and encryption. such as binary or ASCII format.
3. Session layer: defines how to start, control, and end a session. For example, SQL.
4. Transport layer: reuse and sort the input. For example, TCP, UDP.
5. Network layer: defines end-to-end packet transmission and identifies the logical addresses of all nodes. For example, IP.
6. Data link layer: defines how data is transmitted on a single link, depending on the media being discussed.
7. Physical layer: related to the characteristics of the transmission medium.