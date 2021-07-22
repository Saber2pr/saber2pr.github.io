export namespace API {
  export const createAvatars = (name: string, size = 70) =>
    `https://avatars.githubusercontent.com/${name}?size=${size}`
  export const createCommitsUrl = (username: string, repo: string) =>
    `https://api.github.com/repos/${username}/${repo}/commits`
  export const createContentUrl = (
    username: string,
    repo: string,
    path: string
  ) => `/${username}/${repo}/master${path}`
  export const createBlobHref = (
    username: string,
    repo: string,
    path: string
  ) => `https://github.com/${username}/${repo}/blob/master${path}`
  export const createNewHref = (username: string, repo: string, path: string) =>
    `https://github.com/${username}/${repo}/new/master/blog?filename=${`${path}/文章标题.md`}&value=${'文章正文'}`
}
