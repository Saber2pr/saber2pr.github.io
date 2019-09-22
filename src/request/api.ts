export namespace API {
  export const createAvatars = (name: string, size = 70) =>
    `https://avatars.githubusercontent.com/${name}?size=${size}`
  export const createCommitsUrl = (username: string, repo: string) =>
    `https://api.github.com/repos/${username}/${repo}/commits`
  export const createContentUrl = (
    username: string,
    repo: string,
    path: string
  ) => `https://api.github.com/repos/${username}/${repo}/contents/${path}`
}
