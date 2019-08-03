import React, { useState, useRef } from "react";
import "./style.less";
import { Blog } from "../../pages";
import { collect } from "../../utils";
import { Link } from "@saber2pr/router";
import { Icon } from "../../iconfont";

export interface SearchInput {
  blog: Blog["tree"];
}

type Item = {
  path: string;
  title: string;
  text: string;
}[];

type Search = (value: string) => void;

const useSearch = (blog: Blog["tree"]): [Item, Search] => {
  const list = collect(blog).filter(l => l.text);
  const [result, set] = useState<Item>([]);
  const search = (value: string) => {
    if (value) {
      set(
        list
          .filter(l => l.title.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 5)
      );
    } else {
      set([]);
    }
  };
  return [result, search];
};

const Input = ({
  search,
  onblur,
  onfocus
}: {
  search: Search;
  onblur?: Function;
  onfocus?: Function;
}) => {
  const styles = {
    open: { width: "6rem" },
    close: { width: "0" }
  };
  const [style, update] = useState<React.CSSProperties>(styles.close);
  const ref = useRef<HTMLInputElement>();
  return (
    <>
      <span onClick={() => ref.current.focus()}>
        <Icon.Sousuo />
        <span className="SearchInput-Info">搜索</span>
      </span>
      <input
        className="SearchInput-Input"
        ref={ref}
        list="blog"
        onInput={e => search(e.target["value"])}
        style={style}
        onFocus={() => {
          onfocus && onfocus();
          update(styles.open);
        }}
        onBlur={() => {
          onblur && onblur();
          update(styles.close);
        }}
        placeholder="输入关键词"
      />
    </>
  );
};

export const SearchInput = ({ blog }: SearchInput) => {
  const [result, search] = useSearch(blog);
  const [enable, set] = useState(true);
  return (
    <span className="SearchInput">
      <Input
        search={search}
        onblur={() => setTimeout(() => set(false), 500)}
        onfocus={() => set(true)}
      />
      <ul className="SearchInput-List">
        {enable &&
          result.map(({ title, path }) => (
            <li key={title}>
              <Link to={path} onClick={() => location.reload()} title={title}>
                {title}
              </Link>
            </li>
          ))}
      </ul>
    </span>
  );
};
