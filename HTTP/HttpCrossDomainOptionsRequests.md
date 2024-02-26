A few days ago, when I was writing a project that interacted with each other, I encountered a problem: Header could not send Authorization fields.
I obviously used RESTClient to send POST test well. (it was later learned that the OPTIONS request was sent automatically by the browser, and the RESTClient had to be sent manually.)
The back-end API authentication uses jwt-like authentication, so why do you say jwt-like? because I don't code according to the standard format, I directly use JSON.stringify to serialize json data (of course, I have encrypted the token attribute with my private key). The frontend gets the jwt from the localStorage and puts it in the request head Authorization field. Firefox grabs the packet and finds that the request header does not contain jwt, and the request becomes an OPTIONS request.
1. What is an OPTIONS request?
OPTIONS request, also known as pre-check request, is a "hello, inquiry" before the formal request server API.
two。 Why do I need an OPTIONS request?
If the frontend uses a special request header to access the backend, the OPTIONS request will be triggered. It will first ask whether the backend supports the request header field (corresponding to the response header Access-Control-Allow-Headers) and whether the backend supports the request method (corresponding to the response header Access-Control-Allow-Methods).
3. So you can't send two requests at a time?
OPTIONS requests can be cached (corresponding to the response header Access-Control-Max-Age), and no more OPTIONS request queries will be sent before the cache expires.