declare const JHome: Home;
declare const JBlog: Blog["tree"];
declare const JAbout: About["about"];
declare const JProject: About["projects"];
declare const JLinks: Links["links"];

import React, { useEffect } from "react";
import { Router, Route, Link, LinkProps, usePush } from "@saber2pr/router";

import "./app.less";
import { Home, Blog, About, Links } from "./pages";
import { ALink, SearchInput } from "./components";

import { store } from "./store";
import { history } from "./config";
import { getHash } from "./utils";

const HLink = (props: Omit<ALink, "act" | "uact">) => (
  <ALink {...props} act="header-a-active" uact="header-a" />
);

const HNLink = (props: LinkProps) => (
  <Link {...props} onClick={() => store.dispatch("href", "")} />
);

export const App = () => {
  const [push] = usePush();
  const hash = getHash();
  useEffect(() => {
    if (hash) {
      push(hash);
    } else {
      push("/home");
    }
  });

  const onhashchange = () => store.dispatch("href", getHash());
  useEffect(() => {
    window.addEventListener("hashchange", onhashchange);
    return () => window.removeEventListener("hashchange", onhashchange);
  });

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
        <SearchInput blog={JBlog} />
        <a className="header-last" href="https://github.com/Saber2pr">
          GitHub
        </a>
      </nav>
      <main className="main">
        <Router history={history}>
          <Route path="/home" component={() => <Home {...JHome} />} />
          <Route path="/blog" component={() => <Blog tree={JBlog} />} />
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
