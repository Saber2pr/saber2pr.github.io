The main idea of micro-service is that multiple servers provide rendering while maintaining the front-end routing state. As long as a new micro-front-end server is deployed, new routing services can be injected only by updating the front-end routing table.
Rewrites configuration is provided in next.config.js to proxy front-end routing requests to another next.js server while maintaining the front-end routing state.
### Nextjs Micro Front End Architecture Implementation
First, deploy a nextjs instance used to configure the routing system as the framework of the entire platform application. Now we need to develop two applications on the platform, so we can use two nextjs instances to develop applications An and B. After the development and deployment of An and B is complete, you can configure route distribution in rewrites on the platform.
> e nextjs micro-service architecture requires that all applications should be implemented using nextjs
```js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/a',
        destination: 'https://a.xxx.com',
      },
      {
        source: '/b',
        destination: 'https://b.xxx.com',
      },
    ]
  },
}
```
> Note that if / an and / b are implemented in the platform, the local implementation of the platform will be preferred rather than rewrite will be triggered.
### Difference between Redirects and Redirects
Do you think the micro-front end above is superfluous? Why don't you just jump with a tag? No, the meaning of micro-front-end is that as a performance optimization means of giant front-end applications, it can maintain the state of front-end routing and update page data without reloading the whole web page.
### Advantages of micro-service
When a front-end application becomes larger and larger, the project will also become particularly bloated. At this time, the application can be split according to function and style and divided into different projects and warehouses for management. People can concentrate more on the development of a piece of content, which looks like an overall application to the outside.