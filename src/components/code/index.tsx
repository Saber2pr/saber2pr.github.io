import React, { Fragment } from "react";

import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import ts from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import dark from "react-syntax-highlighter/dist/esm/styles/prism/atom-dark";

import { Para } from "../para";

export interface Code {
  children?: string;
}

const start = /```[a-z]+\n/;
const end = "```";

SyntaxHighlighter.registerLanguage("typescript", ts);

export const Code = ({ children = "" }: Code) => (
  <>
    {children.split(start).map((c, index) => {
      if (c.includes(end)) {
        const result = c.split(end);
        return (
          <Fragment key={index}>
            <SyntaxHighlighter language="typescript" style={dark}>
              {result[0]}
            </SyntaxHighlighter>
            <Para>{result[1]}</Para>
          </Fragment>
        );
      } else {
        return <Para key={index}>{c}</Para>;
      }
    })}
  </>
);
