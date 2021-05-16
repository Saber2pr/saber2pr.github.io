import './style.less'

import React from 'react'

import { Link } from '@saber2pr/react-router'

import { TextTree } from '../../utils'

const NextLink = ({
  to: item,
  className,
  children: name
}: {
  to: TextTree
  className?: string
  children?: string
}) => {
  if (!item || item.children) return <li className={className} />
  return (
    <li className={className}>
      <dl>
        <dt>{name}</dt>
        <dd>
          <Link to={item.path}>{item.title}</Link>
        </dd>
      </dl>
    </li>
  )
}

export interface NextBefore {
  before?: TextTree
  next?: TextTree
}

export const NextBefore = ({ before, next }: NextBefore) => (
  <nav className="NextBefore">
    <ul>
      <NextLink className="NextBefore-Left" to={before}>
        上一篇
      </NextLink>
      <NextLink className="NextBefore-Right" to={next}>
        下一篇
      </NextLink>
    </ul>
  </nav>
)
