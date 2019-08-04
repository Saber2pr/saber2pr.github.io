import React from "react";
import Audio from "@saber2pr/rc-audio";

import { TwoSide } from "../../components";
import { useIsMob } from "../../hooks";
import "./style.less";

export interface About {
  projects: Array<{ name: string; href: string; content: string }>;
  about: string[];
}

const Foot = () => (
  <>
    <p className="About-Main-Repo">
      <a href="https://github.com/Saber2pr/saber2pr.github.io">
        saber2pr.github.io
      </a>
    </p>
    <footer>Copyright © 2019 saber2pr.</footer>
  </>
);

const Main = ({ about }: { about: string[] }) => {
  return (
    <>
      <h1 className="About-Main-Title">saber2pr</h1>
      <div className="About-Main-Content">
        <ul>
          {about.map(a => (
            <li key={a}>
              <p>{a}</p>
            </li>
          ))}
        </ul>
        常听纯音乐>>
        <Audio src="https://m10.music.126.net/20190804152726/286bd6d44f5c4ea2316ced7b96111e9e/ymusic/ffe8/7891/0744/237333383312e4cca09ef6b289f59c3c.mp3" />
      </div>
    </>
  );
};

export const About = ({ about, projects }: About) => {
  const isMob = useIsMob();
  return (
    <div className="About">
      <TwoSide>
        <section className="About-Main">
          <Main about={about} />
          {isMob || <Foot />}
        </section>
        <aside className="About-Aside">
          <h2 className="About-Aside-Title">Projects</h2>
          <ul className="About-Aside-Content">
            {projects.map(({ name, href, content }) => (
              <li key={name} className="About-Aside-Content-Proj">
                <a href={href}>{name}</a>
                <p>{content}</p>
              </li>
            ))}
          </ul>
          {isMob && <Foot />}
        </aside>
      </TwoSide>
    </div>
  );
};
