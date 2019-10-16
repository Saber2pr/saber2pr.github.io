export const origin = {
  username: "saber2pr",
  repo: "saber2pr.github.io",
  root: null,
  data: {
    home: "/static/data/home.json",
    activity: "/static/data/activity",
    blog: "/static/data/blog_menu",
    learn: "/static/data/learn.json",
    about: "/static/data/about.json",
    links: "/static/data/links.json",
    status: "/static/data/blog_status.json"
  },
  md: "/blog",
  sourceRepo: "https://github.com/Saber2pr/saber2pr.github.io/blob/master",
  issue: "https://github.com/Saber2pr/saber2pr.github.io/issues/new",
  commentRepo: "rc-gitment",
  theme: {
    light: "",
    dark: "/static/style/dark.css"
  }
}

if (!origin.root) {
  if (process.env.NODE_ENV === "development") {
    origin.root = "http://localhost:8080"
  } else if (process.env.NODE_ENV === "production") {
    origin.root = "https://saber2pr.top"
  }
}
