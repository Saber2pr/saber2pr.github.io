import React from "react";
import { Router, Route, hashHistory, Link, LinkProps } from "@saber2pr/router";

import "./app.less";
import { Home, Blog, About, Links } from "./pages";
import { ALink } from "./components";

import JHome from "../data/home.json";
import JBlog from "../data/blogs.json";
import JAbout from "../data/abouts.json";
import JProject from "../data/projects.json";
import JLinks from "../data/links.json";
import { store } from "./store";

const HLink = (props: Omit<ALink, "act" | "uact">) => (
  <ALink {...props} act="header-a-active" uact="header-a" />
);

const HNLink = (props: LinkProps) => (
  <Link {...props} onClick={() => store.dispatch("href", "")} />
);

export const App = () => {
  return (
    <>
      <nav className="header">
        <HNLink className="header-start" to="/home">
          saber2pr
        </HNLink>
        <span className="header-links">
          <HLink to="/blog">博客</HLink>
          <HLink to="/about" scrollReset>
            关于
          </HLink>
          <HLink to="/links">链接</HLink>
        </span>
        <a className="header-last" href="https://github.com/Saber2pr">
          GitHub
        </a>
      </nav>
      <main className="main">
        <Router history={hashHistory}>
          <Route default path="/home" component={() => <Home {...JHome} />} />
          <Route path="/blog" component={() => <Blog links={JBlog} />} />
          <Route
            path="/about"
            component={() => <About about={JAbout} projects={JProject} />}
          />
          <Route path="/links" component={() => <Links links={JLinks} />} />
        </Router>
      </main>
    </>
  );
};
