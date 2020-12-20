nextjs 约定/pages/api 文件夹下被映射为 api 接口。

如果想要捕获路由，文件命名为[...param].ts，例如：

```ts
// /pages/api/[...param].ts

import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb"
    }
  }
};

/**
 * 捕获所有路由
 * > 用于客户端请求的反向代理
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const apiRes = await axios({
      url: req.url,
      method: req.method as any,
      data: req.body
    });
    const { data } = apiRes;
    res.end(JSON.stringify(data));
  } catch (error) {
    res.end(JSON.stringify(error));
  }
};
```
