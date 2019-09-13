import React from "react"
import "./style.less"

type Link = {
  name: string
  href: string
}

type MessLink = Link & {
  message: string
}

type HeadLink = Link & {
  head: string
}

export interface Links {
  owns: MessLink[]
  friends: HeadLink[]
}

const OwnLinks = ({ links }: { links: MessLink[] }) => (
  <dl className="Links-Own">
    <dt className="Links-Own-Title">
      <h3>我的</h3>
    </dt>
    <dd className="Links-Own-Content">
      {links.map(({ name, href, message }) => (
        <a
          key={name}
          className="Links-Own-Content-Link"
          href={href}
          target="_blank"
        >
          <p>
            <strong>{name}</strong>
          </p>
          <p className="Links-Own-Content-Link-Message">{message}</p>
        </a>
      ))}
    </dd>
  </dl>
)

const FriendLinks = ({ links }: { links: HeadLink[] }) => (
  <dl className="Links-Friend">
    <dt className="Links-Friend-Title">
      <h3>友链</h3>
    </dt>
    <dd className="Links-Friend-Content">
      {links.map(({ name, href, head }) => (
        <a
          className="Links-Friend-Content-Link"
          href={href}
          key={name}
          target="_blank"
        >
          <table>
            <tbody>
              <tr>
                <td>
                  <img
                    className="Links-Friend-Content-Link-Head"
                    src={head}
                    alt={name}
                  />
                </td>
                <td>
                  <p>
                    <strong>{name}</strong>
                  </p>
                  <p className="Links-Friend-Content-Link-Message">{href}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </a>
      ))}
    </dd>
  </dl>
)

export const Links = ({ owns, friends }: Links) => (
  <div className="Links">
    <OwnLinks links={owns} />
    <FriendLinks links={friends} />
    <footer>Copyright © 2019 saber2pr.</footer>
  </div>
)
