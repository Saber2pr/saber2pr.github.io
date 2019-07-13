import React, { Fragment } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Para } from "../para";

export interface Code {
  children?: string;
}

const start = /```[a-z]+\n/;
const end = "```";

export const Code = ({ children = "" }: Code) => (
  <>
    {children.split(start).map((c, index) => {
      if (c.includes(end)) {
        const result = c.split(end);
        return (
          <Fragment key={index}>
            <SyntaxHighlighter language="typescript">
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
