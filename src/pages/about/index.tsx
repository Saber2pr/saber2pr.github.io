import React from "react";
import { TwoSide } from "../../components";
import { useIsMob } from "../../hooks";
import "./style.less";

export interface About {
  projects: Array<{ name: string; href: string; content: string }>;
  about: string[];
}

export const About = ({ about, projects }: About) => {
  const isMob = useIsMob();
  return (
    <div className="About">
      <TwoSide>
        <section className="About-Main">
          <h1 className="About-Main-Title">saber2pr</h1>
          <div className="About-Main-Content">
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
          <h2 className="About-Aside-Title">Projects</h2>
          <ul className="About-Aside-Content animated fadeInUp">
            {projects.map(({ name, href, content }) => (
              <li key={name} className="About-Aside-Content-Proj">
                <a href={href}>{name}</a>
                <p>{content}</p>
              </li>
            ))}
          </ul>
          {isMob && <footer>Copyright © 2019 saber2pr.</footer>}
        </aside>
      </TwoSide>
    </div>
  );
};
