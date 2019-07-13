import React, { useRef, useEffect } from "react";
import { Route, Router } from "@saber2pr/router";
import { Code } from "@saber2pr/react-code";

import "./style.less";
import { Icon } from "../../iconfont";

import { TwoSide, ALink } from "../../components";
import { useIsMobile } from "../../hooks";

import { store } from "../../store";

const BLink = (props: Omit<ALink, "act" | "uact">) => (
  <ALink act="Blog-A-Active" uact="Blog-A" {...props} scrollReset />
);

export interface Blog {
  links: Array<{ name: string; content: string; href: string }>;
}

export const Blog = ({ links }: Blog) => {
  const ref = useRef<HTMLDivElement>();

  const open = () => (ref.current.style.display = "block");
  const close = () => (ref.current.style.display = "none");
  const isMobile = useIsMobile(close, open);

  useEffect(() => {
    store.dispatch("href", links[0].href);
  });

  return (
    <div className="Blog">
      <TwoSide>
        <div className="Blog-Main">
          <section>
            <Router>
              {links.map(({ name, content, href }) => (
                <Route
                  key={href}
                  path={href}
                  component={() => (
                    <div className="animated fadeIn">
                      <h1 className="Blog-Main-Title">{name}</h1>
                      <div className="Blog-Main-Content">
                        <Code>{content}</Code>
                      </div>
                    </div>
                  )}
                />
              ))}
            </Router>
          </section>
          <footer>Copyright © 2019 saber2pr.</footer>
        </div>
        <div className="Blog-Aside animated bounceInDown" ref={ref}>
          <aside>
            <ul>
              {links.map(({ name, href }) => (
                <li key={href} className="Blog-Aside-Item">
                  <BLink to={href} onClick={() => isMobile() && close()}>
                    {name}
                  </BLink>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </TwoSide>
      <div className="Blog-Btn animated flip" onClick={open}>
        <Icon.Mao />
      </div>
    </div>
  );
};
