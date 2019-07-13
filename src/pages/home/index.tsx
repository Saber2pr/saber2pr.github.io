import React from "react";
import "./style.less";

export interface Home {
  title: string;
  infor: string;
}

export const Home = ({ title, infor }: Home) => {
  return (
    <div className="Home">
      <main className="Home-Main">
        <ul>
          <li className="Home-Main-Title shd-blue">
            <i>{title}</i>
          </li>
          <li className="Home-Main-Infor">
            <i>{infor}</i>
          </li>
        </ul>
      </main>
      <footer>Copyright © 2019 saber2pr.</footer>
    </div>
  );
};
