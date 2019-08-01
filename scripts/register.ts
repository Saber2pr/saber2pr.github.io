import JAbout from "../data/abouts.json";
import JBlog from "../data/blogs.json";
import JHome from "../data/home.json";
import JLinks from "../data/links.json";
import JProject from "../data/projects.json";
import { join } from "path";
import { copy, WriteFile, ReadFile } from "./node";

const template = {
  js: join(__dirname, "../template/bundle.min.js"),
  html: join(__dirname, "../template/index.html"),
  css: join(__dirname, "../template/style.min.css")
};

const output = {
  js: join(__dirname, "../build/bundle.min.js"),
  html: join(__dirname, "../build/index.html"),
  css: join(__dirname, "../build/style.min.css")
};

export async function register() {
  const config = [
    ["JAbout", JAbout],
    ["JBlog", JBlog],
    ["JHome", JHome],
    ["JLinks", JLinks],
    ["JProject", JProject]
  ]
    .map(([name, json]) => `var ${name}=${JSON.stringify(json)}`)
    .join(";");

  await copy(template.html, output.html);
  await copy(template.css, output.css);

  const templateJS = await ReadFile(template.js).then(b => b.toString());
  const bundleJS = `${config};${templateJS}`;
  await WriteFile(output.js, bundleJS);
}
