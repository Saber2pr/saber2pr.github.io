import Md2jsx from '@saber2pr/md2jsx'
import cpp from '@saber2pr/md2jsx/lib/languages/cpp'
import hs from '@saber2pr/md2jsx/lib/languages/haskell'
import tsx from '@saber2pr/md2jsx/lib/languages/tsx'
import MD_Theme from '@saber2pr/md2jsx/lib/theme/atom-dark'
import { HashHistory } from '@saber2pr/react-router'

Md2jsx.registerLanguage("tsx", tsx)
Md2jsx.registerLanguage("hs", hs)
Md2jsx.registerLanguage("cpp", cpp)

export const history = HashHistory
export const md_theme = MD_Theme
export { Md2jsx }
