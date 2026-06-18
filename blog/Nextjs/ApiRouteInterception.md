The nextjs convention / pages/api folder is mapped to the api interface.
If you want to capture routes, the file is named [... param] .ts, for example:
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