export * from './browser'
export * from './origin'
import { origin } from './origin'

const Routes = {
  home: {
    href: '/',
    name: origin.userId,
  },
  about: {
    href: '/关于',
    name: '关于',
  },
  acts: {
    href: '/动态',
    name: '动态',
  },
  blog: {
    name: '笔记',
    href: '/blog',
  },
  learn: {
    href: '/文档',
    name: '文档',
  },
  links: {
    href: '/链接',
    name: '链接',
  },
  datav: {
    href: '/数据',
    name: '数据',
  },
  acg: {
    href: '/ACG空间',
    name: 'ACG',
  },
  search: {
    href: '/搜索结果',
  },
  secret: {
    href: '/secret',
  },
  v: {
    href: '/v',
  },
  notFound: {
    href: '*',
  },
}

export { origin, Routes }
