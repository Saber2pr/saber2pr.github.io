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
  commentRepo: "rc-gitment"
}

if (!origin.root) {
  if (process.env.NODE_ENV === "development") {
    origin.root = "http://localhost:8080"
  } else if (process.env.NODE_ENV === "production") {
    origin.root = "https://saber2pr.top"
  }
}
