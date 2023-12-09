```ts
import { remove } from 'fs-extra';
import got from 'got';
import * as fs from 'graceful-fs';
import { Stream } from 'stream';
import * as tar from 'tar';
import { promisify } from 'util';
import { access } from 'fs';

export async function pathExists(path: string) {
  try {
    await promisify(access)(path);
    return true;
  } catch {
    return false;
  }
}


export const downloadTarballStream = async (
  stream: Stream,
  extractDir: string,
) => {
  // 创建文件夹
  if (!(await pathExists(extractDir))) {
    await promisify(fs.mkdir)(extractDir);
  }
  const fileDownloadPath = `${extractDir}.tar.gz`;
  const file = fs.createWriteStream(fileDownloadPath);
  return new Promise((resolve, reject) => {
    stream
      .pipe(file)
      .on('finish', async () => {
        // 解压
        await tar.x({ file: fileDownloadPath, cwd: extractDir });
        // 删除tar包
        if (await pathExists(fileDownloadPath)) {
          await remove(fileDownloadPath);
        }
        resolve(extractDir);
      })
      .on('error', reject);
  });
};

export const downloadTarball = async (url: string, extractDir: string) => {
  const stream = got.stream(url) as Stream;
  await downloadTarballStream(stream, extractDir);
};
```
