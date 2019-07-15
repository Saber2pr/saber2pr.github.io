/*
 * @Author: saber2pr
 * @Date: 2019-07-15 11:59:42
 * @Last Modified by:   saber2pr
 * @Last Modified time: 2019-07-15 11:59:42
 */
import { promisify } from "util";
import { readdir, readFile, writeFile } from "fs";
import { join, parse } from "path";

const readD = promisify(readdir);
const readF = promisify(readFile);
const writeF = promisify(writeFile);

async function generate() {
  const dir = join(process.cwd(), "md/blog");
  const blogs = await readD(dir);
  const blogs_data = await Promise.all(
    blogs.map(async b => {
      const path = join(dir, b);
      const mdFiles = await readD(path);
      const content = await readF(join(path, mdFiles[0]));
      return {
        name: parse(mdFiles[0]).name,
        content: content.toString(),
        href: `/blog/${b}`
      };
    })
  );

  const data_path = join(process.cwd(), "data/blogs.json");
  await writeF(data_path, JSON.stringify(blogs_data));
}

generate().catch(console.log);
