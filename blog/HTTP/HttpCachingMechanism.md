There are two kinds of caches: strong cache and negotiation cache.
1. Strong cache: does not send a request to the server, but reads resources directly from the cache. In the Network option of the chrome console, you can see that the request returns a status code of 200, and the size displays either from disk cache or from memory cache (gray indicates cache).
two。 Negotiation cache: sends a request to the server, and the server determines whether the negotiation cache is hit according to some parameters of the request header of the request. If so, it returns the 304status code and informs the browser to read resources from the cache with the new response header.
> what they have in common: they all read resources from the client cache.
> Difference: Strong cache does not make requests, negotiation cache will make requests.
![loading](https://saber2pr.top/MyWeb/resource/image/http-cache.webp)
#### Strong cache
1. Expires
The expiration time in response header, when the browser loads the resource again, if within this expiration time, the strong cache is hit.
2. Cache-Control
When the value is set to max-age=300, it means that the resource is loaded again within 5 minutes of the correct return time of the request (which will also be recorded by the browser), and the strong cache will be hit.
> difference: Expires is the product of http1.0 and Cache-Control is the product of http1.1. If both exist at the same time, Cache-Control takes precedence over Expires.
> Expires is actually an outdated product, and its existence at this stage is only a compatible way of writing.
#### Negotiation cache
1. ETag and If-None-Match
Etag is the response header returned by the server the last time the resource was loaded, and is a unique identification of the resource.
> Etag will be regenerated whenever there is a change in resources.
The next time the browser loads a resource and sends a request to the server, it will put the last returned Etag value in the If-None-Match field of the request header.
After the server receives the value of If-None-Match, it will compare it with the Etag value of the resource file. If it is the same, it means that the resource file has not changed and the negotiation cache is hit.
2. Last-Modified and If-Modified-Since
Last-Modified is the last time the resource file was changed, and the server will return it in response header.
At the same time, the browser will save this value and put it in the If-Modified-Since in request header the next time the request is sent.
The server will also make a comparison after receiving it, and if it is the same, it will hit the negotiation cache.
The difference between the two ways:
1. Etag is better than Last-Modified in accuracy.
2. The time unit of Last-Modified is seconds. If a file changes several times in 1 second, then their Last-Modified actually does not reflect the modification. But Etag changes every time to ensure accuracy.
3. In terms of performance, Etag is inferior to Last-Modified. After all, Last-Modified only needs to record time, while Etag requires the server to calculate a hash value through an algorithm. In terms of priority, server verification gives priority to Etag.
4. Therefore, the two complement each other. It is best to work together to maximize the reduction of requests, make use of caching, and save traffic.
### Browser caching process
1. The browser loads the resource for the first time, and the server returns 200. the browser downloads the resource file from the server and caches the response header and the return time of the request (to be compared with Cache-Control and Expires)
2. When loading resources next time, first compare the time difference between the current time and the last time when 200 is returned. If it does not exceed the max-age set by Cache-Control, it does not expire, hits the strong cache, and reads the file directly from the local cache without sending a request (if the browser does not support HTTP1.1, use Expires to determine whether it expires);
3. If the time expires, send a request for header with If-None-Match and If-Modified-Since to the server
4. After receiving the request, the server first judges whether the requested file has been modified according to the value of Etag. If the value of Etag is the same, it does not modify. If it hits the negotiation cache, it returns 304. If there is any change, it directly returns the new resource file with the new Etag value and returns 200.
5. If the request received by the server has no Etag value, the If-Modified-Since is compared with the last modification time of the requested file. If the request is consistent, the negotiation cache is hit and 304 is returned. If there is inconsistency, the new last-modified and file are returned and 200 is returned.
### Control of user behavior on browser cache
#### Address bar access
Link jumping is normal user behavior and will trigger the browser caching mechanism.
> the browser initiates the request, and according to the normal process, check whether it expires locally, or the server checks the freshness, and finally returns the content.
#### F5 to refresh
The browser will set max-age=0, skip strong cache judgment, and negotiate cache judgment.
> the browser expires directly on the local cache file, but it will bring If-Modifed-Since,If-None-Match (if the last response with Last-Modified, Etag). This means that the server will check the freshness of the file, and the return result may be 304 or 200.
#### Ctrl+F5 forced refresh
Skip strong cache and negotiation cache and pull resources directly from the server.
> the browser will not only expire on local files, but also will not bring If-Modifed-Since,If-None-Match, which means it has never been requested before.
### How not to cache
#### Other fields of Cache-Control
1. No-cache: although the literal meaning is "do not cache". But its actual mechanism is that the cache is still used for the resource, but each time the cache resource must be validated to the server before using the cache.
2. No-store: no cache is used.
Forbidden cache:
```bash
Cache-Control: no-cache, no-store, must-revalidate
```
#### Expires: before setting the current time
### Front-end development settings are not cached
Add? + Math.random () after the url referencing js and css files
```html
<script type=“text/javascript” src=“/js/test.js?+Math.random()”></script>
```
The method of setting html pages from browser caching
```html
<meta http-equiv="pragma" content="no-cache" />
<meta http-equiv="Cache-Control" content="no-cache, must-revalidate" />
<meta http-equiv="expires" content="Wed, 26 Feb 1997 00:00:00 GMT" />
```
### Other
There are two forms of caching: from memory cache and from disk cache.
![loading](https://saber2pr.top/MyWeb/resource/image/http-cache-code.webp)
In the case of a strong cache hit, the process reads resources (fonts, images, scripts) from memory and css partial js from disk.