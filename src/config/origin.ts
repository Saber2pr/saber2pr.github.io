export const origin = {
  username: "saber2pr",
  repo: "saber2pr.github.io",
  root: null,
  data: {
    home: "/config/home.json",
    activity: "/config/activity",
    blog: "/config/blog_menu",
    learn: "/config/learn.json",
    about: "/config/about.json",
    links: "/config/links.json",
    status: "/config/blog_status.json"
  },
  md: "/blog",
  sourceRepo: "https://github.com/Saber2pr/saber2pr.github.io/blob/master",
  issue: "https://github.com/Saber2pr/saber2pr.github.io/issues/new",
  commentRepo: "rc-gitment",
  client_id: "2c7fc669975fd90315c6",
  client_secret: "d55f1ef5d23786356ef912054e1ceacdbf6a710e"
}

if (!origin.root) {
  if (process.env.NODE_ENV === "development") {
    origin.root = "http://localhost:8080"
  } else if (process.env.NODE_ENV === "production") {
    origin.root = "https://saber2pr.top"
  }
}
