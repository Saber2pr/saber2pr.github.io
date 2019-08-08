import React from "react"
import "./style.less"

export interface Links {
  links: Array<{
    name: string
    href: string
    message: string
  }>
}

export const Links = ({ links }: Links) => {
  return (
    <div className="Links">
      {links.map(({ name, href, message }) => (
        <a key={name} className="Links-Link" href={href} target="_blank">
          <p>
            <strong>{name}</strong>
          </p>
          <p className="Links-Link-Message">{message}</p>
        </a>
      ))}
    </div>
  )
}
