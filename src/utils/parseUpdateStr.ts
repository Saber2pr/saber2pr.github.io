/*
 * @Author: saber2pr
 * @Date: 2019-09-28 11:19:41
 * @Last Modified by: saber2pr
 * @Last Modified time: 2019-09-28 11:21:35
 */
import { lift } from './util'

export const parseUpdateStr = (updateStr: string) =>
  updateStr
    .split(";")
    .filter(l => l)
    .map(update =>
      lift(update.split("&"), ([type, text, date]) => ({
        type: type.replace("\n", ""),
        text,
        date
      }))
    )
