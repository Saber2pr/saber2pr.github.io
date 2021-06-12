import './style.less'

import React, { memo } from 'react'

import { LazyCom, Loading, PreImg, requestFrameModal } from '../../components'
import { request } from '../../request'

type Sites = {
  [k: string]: { name: string; href: string; icon: string; frame: boolean }[]
}

export interface Learn {
  sites: Sites
}

const PreImage = (
  <div
    style={{
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      backgroundColor: 'lightgrey',
      margin: '0 auto',
      marginBottom: '0.2rem',
    }}
  />
)

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
                  {sites[key].map(({ name, icon, href, frame }, i) => {
                    let content = (
                      <>
                        <PreImg src={icon} alt={name} fallback={PreImage} />
                        <div className="libs-A">{name}</div>
                      </>
                    )
                    if (frame) {
                      content = (
                        <a
                          className="cursor-pointer"
                          title={name}
                          onClick={() => requestFrameModal(href)}
                        >
                          {content}
                        </a>
                      )
                    } else {
                      content = (
                        <a href={href} title={name} target="_blank">
                          {content}
                        </a>
                      )
                    }
                    return <li key={href + i}>{content}</li>
                  })}
                </ul>
              </dd>
            </dl>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const LearnLazy = memo(() => (
  <LazyCom await={request('learn')} fallback={<Loading type="block" />}>
    {res => <Learn sites={res} />}
  </LazyCom>
))
