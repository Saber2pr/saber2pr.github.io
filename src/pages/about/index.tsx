import React from "react";
import "./style.less";
import { TwoSide } from "../../components";
import { useIsMobile } from "../../hooks";

export interface About {
  projects: Array<{ name: string; href: string; content: string }>;
  about: string[];
}

export const About = ({ about, projects }: About) => {
  const isMob = useIsMobile()();
  return (
    <div className="About">
      <TwoSide>
        <section className="About-Main">
          <div className="About-Main-Content">
            <h1 className="About-Main-Content-Title">saber2pr</h1>
            <ul>
              {about.map(a => (
                <li key={a}>
                  <p>{a}</p>
                </li>
              ))}
            </ul>
          </div>
          {isMob || <footer>Copyright © 2019 saber2pr.</footer>}
        </section>
        <aside className="About-Aside">
          <div className="About-Aside-Content">
            <dl>
              <dt>
                <h2 className="About-Aside-Content-Title">Projects</h2>
              </dt>
              {projects.map(({ name, href, content }) => (
                <dl key={name} className="About-Aside-Content-Proj">
                  <a href={href}>{name}</a>
                  <p>{content}</p>
                </dl>
              ))}
            </dl>
          </div>
          {isMob && <footer>Copyright © 2019 saber2pr.</footer>}
        </aside>
      </TwoSide>
    </div>
  );
};
