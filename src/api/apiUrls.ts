const apis = {
  development: {
    v: '/api/v',
  },
  production: {
    v: 'https://blog.saber2pr.top/api/v',
  },
}[process.env.NODE_ENV]

export const ApiUrls = {
  comments163: 'https://api.uomg.com/api/comments.163?format=text',
  musicService: 'https://api.zhuolin.wang/api.php',
  ...apis,
}
