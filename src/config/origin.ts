export const origin = {
  userId: "saber2pr",
  repo: "saber2pr.github.io",
  mirror: "saber2pr.gitee.io",
  omit_base: ["saber2pr.gitee.io", "localhost"],
  md: "/blog",
  data: {
    home: "/static/data/home.json",
    activity: "/static/data/activity.json",
    blog: "/static/data/blog.json",
    learn: "/static/data/learn.json",
    about: "/static/data/about.json",
    links: "/static/data/links.json",
    version: "/static/data/version.json",
    musicList: "/static/data/musicList.json",
    wiki: "/wiki"
  },
  theme: {
    light: "",
    dark: "/static/style/dark.css"
  },
  workers: {
    pwa: "/service-worker.js"
  },
  constants: {
    UPDATE_OMIT_KEY: "update-omit",
    STATIC_VERSION_KEY: "saber2pr-pwa-static",
    DYNAMIC_VERSION_KEY: "saber2pr-pwa-dynamic"
  }
}
