export const versionUp = (version: string) =>
  String(Number(version.split(".").join("")) + 1)
    .padStart(3, "0")
    .split("")
    .join(".")
