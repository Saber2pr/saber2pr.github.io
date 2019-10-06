import React, { Fragment } from "react"
import "./style.less"
import { PreImg } from "../../components"

type Sites = {
  [k: string]: { name: string; href: string; icon: string }[]
}

export interface Learn {
  sites: Sites
}

export const Learn = ({ sites }: Learn) => {
  return (
    <div className="Learn">
      <ul className="Learn-List">
        {Object.keys(sites).map(key => (
          <li key={key} className="Learn-List-Item">
            <dl>
              <dt>
                <h3>{key}</h3>
              </dt>
              <dd>
                <ul className="libs">
                  {sites[key].map(({ name, icon, href }, i) => (
                    <li key={href + i}>
                      <a href={href} title={name} target="_blank">
                        <PreImg
                          src={icon}
                          alt={name}
                          fallback={<div style={{width: '3rem', height: '3rem'}}>loading</div>}
                        />
                        <div className="libs-A">{name}</div>
                      </a>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
          </li>
        ))}
      </ul>
      <footer>Copyright © 2019 saber2pr.</footer>
    </div>
  )
}
